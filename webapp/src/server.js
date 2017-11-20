"use strict";

const express = require("express");
const fs = require("fs");
var dbHelper = require("./db.js");
var parse = require("csv-parse");
var auth = require("http-auth");

var basic = auth.basic(
  {
    realm: "Private Area"
  },
  (username, password, callback) => {
    callback(username === "Test" && password === "Passwort");
  }
);

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
  tsvToDB("src/1280846484_20171001_20171029_details.tsv").then(function(array) {
    res.send(
      "Uploaded " + array[1] + " from a total of " + array[0] + " entries in the file\n"
    );
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

function tsvToDB(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, "ascii", function(err, data) {
      if (err) reject(err);
      parse(data, { delimiter: "\t", auto_parse: true }, function(err, output) {
        output.splice(0, 1);
        dbHelper.insertIntoDB(output).then(function(completed) {
          resolve([output.length, completed]);
        });
      });
    });
  });
}
