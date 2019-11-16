const sql = require('mssql')
const config = {
  user: 'Theadmin',
  password: '234dawdokdfwoap34234123AAA',
  server: 'eat-with-me-sql-server.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'eat-with-me-sql',
  encrypt: true,
}
//var connectionPool = new sql.ConnectionPool(config);


function connect() {
  return sql.connect(config);
}

function insertRow() {
  connect().then((pool) => {
    const request = new sql.Request(pool)
    var fromDate = new Date("2019-03-22 01:01:01");
    var toDate = new Date("2019-03-22 01:01:02")
    request.input("type", sql.NVarChar, 'Fika');
    request.input("userid", sql.NVarChar, '1231234132432');
    request.input("timeFrom", sql.DateTime, fromDate);
    request.input("timeTo", sql.DateTime, toDate);
    request.query("INSERT INTO table_name (type, userId, timeFrom, timeTo) VALUES (@type, @userid, @timeFrom, @timeTo)", function(err, recordsets) {
      console.log(recordsets);
      console.log(err);
      pool.close();
    });
  });
}

function getAll() {
  return new Promise((resolve , reject)=>{
    console.log("apan sover");
    connect().then((pool) => {
      const request = new sql.Request(pool)
      request.query("SELECT * from table_name").then((result)=> {
        pool.close()
        resolve(result);

      });
    });
  });
}
module.exports = {
  "connect": connect,
  "getAll": getAll,
  "insertRow":insertRow
}
