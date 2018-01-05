var mysql = require("mysql");

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

exports.getCombinedVisitsPerDay = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    var sql = "";
    if (startDate && endDate) {
      sql =
        "SELECT date, SUM(download)+SUM(browse)+SUM(subscribe)+SUM(stream)+SUM(auto_download) AS sum FROM data WHERE date BETWEEN '" +
        [startDate] +
        "' AND '" +
        [endDate] +
        "' GROUP BY date";
    } else {
      sql =
        "SELECT date, SUM(download)+SUM(browse)+SUM(subscribe)+SUM(stream)+SUM(auto_download) AS sum FROM data GROUP BY date";
    }
    queryDatabase(sql).then(result => {
      var responseArray = [];
      result.forEach(item => {
        var tempObj = {};
        tempObj.date = item.date.toJSON().substring(0, item.date.toJSON().indexOf("T"));
        tempObj.sum = item.sum;
        responseArray.push(tempObj);
      });
      resolve(responseArray);
    });
  });
};

exports.getMaximumInteractionsInInterval = (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    var sql = "";
    if (startDate && endDate)
      sql =
        "SELECT content_title, date, SUM(download)+SUM(browse)+SUM(subscribe)+SUM(stream)+SUM(auto_download) AS sum FROM data WHERE date BETWEEN '" +
        [startDate] +
        "' AND '" +
        [endDate] +
        "' GROUP BY date, content_title ORDER BY sum DESC LIMIT 1";
    else
      sql =
        "SELECT content_title, date, SUM(download)+SUM(browse)+SUM(subscribe)+SUM(stream)+SUM(auto_download) AS sum FROM data WHERE date GROUP BY date, content_title ORDER BY sum DESC LIMIT 1";
    queryDatabase(sql).then(results => {
      console.log(result);
      var result = results[0];
      var resultObj = {};
      resultObj.title = result.content_title;
      resultObj.date = result.date
        .toJSON()
        .substring(0, result.date.toJSON().indexOf("T"));
      resultObj.max = result.sum;
      resolve(resultObj);
    });
  });
};
