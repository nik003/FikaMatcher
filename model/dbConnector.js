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

function insertRow(type, userId, date, fromTime, toTime) {
  return new Promise((resolve, reject) => {
    connect().then((pool) => {
      const request = new sql.Request(pool)
      var fromDateTime = date + " " + fromTime
      var toDateTime = date + " " + toTime
      var fromDate = new Date(fromDateTime);
      var toDate = new Date(toDateTime)
      request.input("type", sql.NVarChar, type);
      request.input("userid", sql.NVarChar, userId);
      request.input("timeFrom", sql.DateTime, fromTime);
      request.input("timeTo", sql.DateTime, toTime);
      request.query("INSERT INTO table_name (type, userId, timeFrom, timeTo) VALUES (@type, @userid, @timeFrom, @timeTo)", function(err, recordsets) {
        console.log(recordsets);
        console.log(err);
        pool.close();
        resolve(type, userId, date, fromTime, toTime);
      });
    });
  });
}

function getAll(type, userId, date, fromTime, toTime) {
  return new Promise((resolve, reject) => {
    console.log("apan sover");
    connect().then((pool) => {
      const request = new sql.Request(pool)
      request.query("SELECT * from table_name").then((result) => {
        pool.close()
        resolve(result, type, userId, date, fromTime, toTime);

      });
    });
  });
}
module.exports = {
  "connect": connect,
  "getAll": getAll,
  "insertRow": insertRow
}
