var msalConfig = {
    auth: {
        clientId: "048ead97-e02d-4e52-a6e6-057f26eff72a",
        authority: "https://login.microsoftonline.com/f82b0fb7-0101-410d-8e87-0efa7c1d3978"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

var graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

// this can be used for login or token request, however in more complex situations
// this can have diverging options
var requestObj = {
    scopes: ["user.read"]
};

var myMSALObj = new Msal.UserAgentApplication(msalConfig);
// Register Callbacks for redirect flow

myMSALObj.handleRedirectCallback(authRedirectCallBack);


function signIn() {

    myMSALObj.loginPopup(requestObj).then(function (loginResponse) {
        //Login Success
        showWelcomeMessage();
        acquireTokenPopupAndCallMSGraph();
    }).catch(function (error) {
        console.log(error);
    });
}

function acquireTokenPopupAndCallMSGraph() {
    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
        callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
    }).catch(function (error) {
        console.log(error);
        // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
        // Call acquireTokenPopup(popup window)
        if (requiresInteraction(error.errorCode)) {
            myMSALObj.acquireTokenPopup(requestObj).then(function (tokenResponse) {
                callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
}


function graphAPICallback(data) {
    document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
}


function showWelcomeMessage() {
    var divWelcome = document.getElementById('WelcomeMessage');
    divWelcome.innerHTML = 'Welcome ' + myMSALObj.getAccount().userName + "to Microsoft Graph API";
    var loginbutton = document.getElementById('SignIn');
    loginbutton.innerHTML = 'Sign Out';
    loginbutton.setAttribute('onclick', 'signOut();');
}


//This function can be removed if you do not need to support IE
function acquireTokenRedirectAndCallMSGraph() {
    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
        callMSGraph(graphConfig.graphMeEndpoint, tokenResponse.accessToken, graphAPICallback);
    }).catch(function (error) {
        console.log(error);
        // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
        // Call acquireTokenRedirect
        if (requiresInteraction(error.errorCode)) {
            myMSALObj.acquireTokenRedirect(requestObj);
        }
    });
}


function authRedirectCallBack(error, response) {
    if (error) {
        console.log(error);
    }
    else {
        if (response.tokenType === "access_token") {
            callMSGraph(graphConfig.graphEndpoint, response.accessToken, graphAPICallback);
        } else {
            console.log("token type is:" + response.tokenType);
        }
    }
}

function requiresInteraction(errorCode) {
    if (!errorCode || !errorCode.length) {
        return false;
    }
    return errorCode === "consent_required" ||
        errorCode === "interaction_required" ||
        errorCode === "login_required";
}

// Browser check variables
var ua = window.navigator.userAgent;
var msie = ua.indexOf('MSIE ');
var msie11 = ua.indexOf('Trident/');
var msedge = ua.indexOf('Edge/');
var isIE = msie > 0 || msie11 > 0;
var isEdge = msedge > 0;
//If you support IE, our recommendation is that you sign-in using Redirect APIs
//If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
// can change this to default an experience outside browser use
var loginType = "REDIRECT"; // isIE ? "REDIRECT" : "POPUP";

window.addEventListener('load', function () {

    if (loginType === 'POPUP') {
        if (myMSALObj.getAccount()) {// avoid duplicate code execution on page load in case of iframe and popup window.
            showWelcomeMessage();
            acquireTokenPopupAndCallMSGraph();
        }
    }
    else if (loginType === 'REDIRECT') {

        document.getElementById("SignIn").onclick = function () {
            myMSALObj.loginRedirect(requestObj);
        };
        if (myMSALObj.getAccount() && !myMSALObj.isCallback(window.location.hash)) {// avoid duplicate code execution on page load in case of iframe and popup window.
            showWelcomeMessage();
            acquireTokenRedirectAndCallMSGraph();
        }

        //myMSALObj.loginRedirect(requestObj);

    } else {
        console.error('Please set a valid login type');
    }


    var form = document.getElementsByTagName('form').item(0);
    form.onsubmit = function (e) {
        // stop the regular form submission
        e.preventDefault();

        // collect the form data while iterating over the inputs
        var data = {};
        for (var i = 0, ii = form.length; i < ii; ++i) {
            var input = form[i];
            if (input.name) {
                data[input.name] = input.value;
            }
        }

        data.token = window.localStorage.getItem("msal.idtoken");
        data.userId = myMSALObj.getAccount().idToken.aud;

        debugger;

        fetch(
            '', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(call => call.json())
            .then(x => console.log(x));
        return false;
    };


})
