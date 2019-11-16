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

function insertRow(params) {
  return new Promise((resolve, reject) => {
    connect().then((pool) => {
      const request = new sql.Request(pool)
      var fromDateTime = params.date + " " + params.start_time
      var toDateTime = params.date + " " + params.end_time
      params.start_time = fromDateTime;
      params.end_time = toDateTime;
      request.input("type", sql.NVarChar, params.type);
      request.input("userid", sql.NVarChar, params.userId);
      request.input("timeFrom", sql.NVarChar, fromDateTime);
      request.input("timeTo", sql.NVarChar, toDateTime);
      request.query("INSERT INTO table_name (type, userId, timeFrom, timeTo) VALUES (@type, @userid, @timeFrom, @timeTo)", (err, recordsets) => {
        pool.close();
        resolve(params);
      });
    });
  });
}

function getAll(params) {
  return new Promise((resolve, reject) => {
    connect().then((pool) => {
      const request = new sql.Request(pool)
      request.query("SELECT * from table_name").then((result) => {
        pool.close()
        console.log(result);
        resolve({"dbData":result, "params":params});

      });
    });
  });
}
module.exports = {
  "connect": connect,
  "getAll": getAll,
  "insertRow": insertRow
}
