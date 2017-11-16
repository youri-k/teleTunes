"use strict";

const express = require("express");
const fs = require("fs");
var mysql = require("mysql");
var parse = require("csv-parse");
var auth = require('http-auth');

var basic = auth.basic({
        realm: "Private Area"
    }, (username, password, callback) => {
        callback(username === "Test" && password === "Passwort");
    }
);


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

app.use("/upload", auth.connect(basic));

app.get("/", (req, res) => {
  res.send("Hello TeleTask\n");
});

app.get("/upload", (req, res) => {
  tsvToDB("src/1280846484_20171001_20171029_details.tsv");
  res.send("Uploaded\n");
});


setup();

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

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
        connection.query("CREATE DATABASE teletunes", function(err, result) {
          if (err) throw err;
          console.log("Database created");
          con.connect(function(err) {
            if (err) throw err;
            con.query(
              "CREATE TABLE data (id INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(100), itunes_id VARCHAR(100), content_title VARCHAR(255), browse INT, subscribe INT, download INT, stream INT, auto_download INT, UNIQUE(date, itunes_id))",
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

function tsvToDB(file) {
  fs.readFile(file, "ascii", function(err, data) {
    if (err) throw err;
    parse(data, { delimiter: "\t", auto_parse: true }, function(err, output) {
      output.splice(0, 1);
      var sql =
        "INSERT INTO data (date, itunes_id, content_title, browse, subscribe, download, stream, auto_download) VALUES ?";
      con.query(sql, [output], function(err, result) {
        if(err) {
          if(err.errno != 1062) throw err;

          var n = err.sqlMessage.indexOf("\'")
          var string = err.sqlMessage.substring(n + 1, err.sqlMessage.length)
          n = string.indexOf("\'")
          string = string.substring(0, n)
          var values = string.split("-")          
          n = output.findIndex(function(item) {
            return item[0] == values[0] && item[1] == values[1]
          })
          console.log(n)
        }
       
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });
  });
}

function insertIntoDB()
