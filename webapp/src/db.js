var mysql = require("mysql");

const allParams = [
  "download",
  "browse",
  "subscribe",
  "stream",
  "auto_download"
];

var pool = mysql.createPool({
  connectionLimit: 104, //important
  host: "db",
  user: "root",
  password: "myTeletunesPw",
  database: "teletunes"
});

exports.insertIntoDB = data => {
  return new Promise((resolve, reject) => {
    var inserts = [];
    data.forEach(array => {
      inserts.push(insert(array));
    });
    Promise.all(inserts).then(returnValues => {
      var newData = returnValues.reduce((total, num) => {
        return total + num;
      });
      resolve(newData);
    });
  });
};

function insert(array) {
  return new Promise((resolve, reject) => {
    getConnection().then(connection => {
      connection.query(
        "INSERT INTO data (date, itunes_id, content_title, browse, subscribe, download, stream, auto_download) VALUES (?)",
        [array],
        (err, result) => {
          connection.release();
          if (err) {
            if (err.errno != 1062) reject(err);
            resolve(0);
          }
          resolve(1);
        }
      );
    });
  });
}

function queryDatabase(sql) {
  return new Promise((resolve, reject) => {
    getConnection().then(connection => {
      connection.query(sql, (err, result) => {
        if (err) reject(err);
        connection.release();
        resolve(result);
      });
    });
  });
}

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        if (connection) connection.release();
        reject(err);
      }
      if (connection) {
        console.log("connected as id " + connection.threadId);

        resolve(connection);
      }
    });
  });
}

exports.getConnection = getConnection;

exports.setup = () => {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host: "db",
      user: "root",
      password: "myTeletunesPw"
    });
    connection.connect(err => {
      if (err) throw err;

      connection.query("SHOW DATABASES", (err, result) => {
        if (err) throw err;
        var tableExists = result.some(val => {
          return val.Database === "teletunes";
        });
        if (tableExists) {
          resolve();
        } else {
          connection.query("CREATE DATABASE teletunes", (err, result) => {
            if (err) throw err;
            console.log("Database created");
            connection.end();
            getConnection().then(con => {
              con.query(
                "CREATE TABLE data (id INT PRIMARY KEY AUTO_INCREMENT, date DATE, itunes_id VARCHAR(100), content_title VARCHAR(255), browse INT, subscribe INT, download INT, stream INT, auto_download INT, itunes_title VARCHAR(255), itunes_author VARCHAR(255),  UNIQUE(date, itunes_id))",
                (err, result) => {
                  if (err) throw err;
                  console.log("Table created");
                  con.release();
                  resolve();
                }
              );
            });
          });
        }
      });
    });
  });
};

exports.clear = () => {
  return new Promise((resolve, reject) => {
    getConnection().then(con => {
      con.query("DROP DATABASE teletunes", (err, result) => {
        if (err) {
          console.log("failed dropping datapase:" + err);
          con.release();
          reject();
        } else {
          console.log("database cleared.");
          con.release();
          resolve();
        }
      });
    });
  });
};

exports.toMYSQLDate = date => {
  var year, month, day;
  year = String(date.getFullYear());
  month = String(date.getMonth() + 1);
  if (month.length == 1) {
    month = "0" + month;
  }
  day = String(date.getDate());
  if (day.length == 1) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
};

exports.getCombinedVisitsPerDay = (startDate, endDate, parameters) => {
  return new Promise((resolve, reject) => {
    var sql = "SELECT date, ";
    var params = checkParams(parameters);
    if (params && params.length > 0) sql += makeSQLString(params, "SUM", "sum", "+");
    else sql += makeSQLString(allParams, "SUM", "sum", "+");
    sql += " FROM data ";
    if (startDate && endDate)
      sql +=
        "WHERE date BETWEEN '" + [startDate] + "' AND '" + [endDate] + "' ";
    sql += "GROUP BY date";
    queryDatabase(sql).then(results => {
      var responseArray = [];
      results.forEach(item => {
        var tempObj = {};
        tempObj.date = item.date
          .toJSON()
          .substring(0, item.date.toJSON().indexOf("T"));
        tempObj.sum = item.sum;
        responseArray.push(tempObj);
      });
      resolve(responseArray);
    });
  });
};

exports.getMaximumInteractionsInInterval = (
  startDate,
  endDate,
  limit,
  parameters
) => {
  return new Promise((resolve, reject) => {
    var sql =
      "SELECT content_title, SUM(download) AS download, SUM(browse) AS browse, SUM(subscribe) AS subscribe, SUM(stream) AS stream, SUM(auto_download) AS auto_download, ";
    var params = checkParams(parameters);
    if (params && params.length > 0) sql += makeSQLString(params, "SUM", "sum", "+");
    else sql += makeSQLString(allParams, "SUM", "sum", "+");
    sql += " FROM data ";
    if (startDate && endDate)
      sql +=
        "WHERE date BETWEEN '" + [startDate] + "' AND '" + [endDate] + "' ";
    sql += "GROUP BY content_title ORDER BY sum DESC LIMIT ";
    if (limit) sql += limit;
    else sql += 1;
    queryDatabase(sql).then(results => {
      var responseArray = [];
      results.forEach(item => {
        var resultObj = {};
        resultObj.title = item.content_title;
        resultObj.sum = item.sum;
        resultObj.download = item.download;
        resultObj.browse = item.browse;
        resultObj.subscribe = item.subscribe;
        resultObj.stream = item.stream;
        resultObj.auto_download = item.auto_download;
        responseArray.push(resultObj);
      });
      resolve(responseArray);
    });
  });
};

function makeSQLString(parameters, operation, name, concat) {
  if (!parameters) return "";
  var operationalString = operation + "(";
  var tmpString = "";
  parameters.forEach(param => {
    tmpString += operationalString + param + ")" + concat;
  });
  tmpString = tmpString.substring(0, tmpString.length - concat.length);
  tmpString += " AS " + name;
  return tmpString;
}

function checkParams(parameters) {
  if(!parameters) return parameters;
  return parameters.filter(item => {
    return allParams.indexOf(item) != -1
  })
}