var mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 100, //important
  host: "db",
  user: "root",
  password: "myTeletunesPw",
  database: "teletunes"
});

exports.insertIntoDB = function(data) {
  return new Promise(function(resolve, reject) {
    var inserts = [];
    data.forEach(function(array) {
      inserts.push(insert(array));
    });
    Promise.all(inserts).then(function(returnValues) {
      var newData = returnValues.reduce(function(total, num) {
        return total + num;
      });
      resolve(newData);
    });
  });
};

function insert(array) {
  return new Promise(function(resolve, reject) {
    getConnection().then(function(connection) {
      connection.query(
        "INSERT INTO data (date, itunes_id, content_title, browse, subscribe, download, stream, auto_download) VALUES (?)",
        [array],
        function(err, result) {
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
  return new Promise(function(resolve, reject) {});
}

function getConnection() {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        reject();
      }
      console.log("connected as id " + connection.threadId);

      resolve(connection);
    });
  });
}

exports.setup = function() {
  return new Promise(function(resolve, reject) {
    var connection = mysql.createConnection({
      host: "db",
      user: "root",
      password: "myTeletunesPw"
    });
    connection.connect(function(err) {
      if (err) throw err;

      connection.query("SHOW DATABASES", function(err, result) {
        if (err) throw err;
        var tableExists = result.some(val => {
          return val.Database === "teletunes";
        });
        if (tableExists) {
          resolve();
        } else {
          connection.query("CREATE DATABASE teletunes", function(err, result) {
            if (err) throw err;
            console.log("Database created");
            getConnection().then(function(con) {
              con.connect(function(err) {
                if (err) throw err;
                con.query(
                  "CREATE TABLE data (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(100), itunes_id VARCHAR(100), content_title VARCHAR(255), browse INT, subscribe INT, download INT, stream INT, auto_download INT, UNIQUE(date, itunes_id))",
                  function(err, result) {
                    if (err) throw err;
                    console.log("Table created");
                    con.release();
                    resolve();
                  }
                );
              });
            });
          });
        }
      });
    });
  });
};
