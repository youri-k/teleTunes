"use strict";

const express = require("express");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "db",
  user: "root",
  password: "myTeletunesPw",
  database: "teletunes"
});

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
const app = express();
app.get("/", (req, res) => {
  res.send("Hello TeleTask\n");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
setup();

function setup() {
  var connection = mysql.createConnection({
    host: "db",
    user: "root",
    password: "myTeletunesPw"
  });
  connection.connect(function(err) {
    if (err) throw err;    

    connection.query("SHOW DATABASES", function(err, result) {
      if (err) throw err;
      if (
        result.some(val => {
          return val.Database === "teletunes";
        })
      ) {
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
        });
      } else {
        console.log("else");

        connection.query("CREATE DATABASE teletunes", function(err, result) {
          if (err) throw err;
          console.log("Database created");
          con.connect(function(err) {
            if (err) throw err;
            con.query(
              "CREATE TABLE data (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(100), itunes_id VARCHAR(100), content_title VARCHAR(100), browse INT, subscribe INT, download INT, stream INT, auto_download INT)",
              function(err, result) {
                if (err) throw err;
                console.log("Table created");
              }
            );
          });
        });
      }
    });
  });
}
