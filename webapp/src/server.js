"use strict";

const express = require("express");
const fs = require("fs");
var dbHelper = require("./db.js");
var parse = require("csv-parse");
var auth = require("http-auth");

var basic = auth.basic(
  {
    realm: "Upload"
  },
  (username, password, callback) => {
    callback(username === "Test" && password === "Passwort");
  }
);

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
dbHelper.setup().then(() => {
  const app = express();

  app.use("/upload", auth.connect(basic));

  app.get("/", (req, res) => {
    res.send("Hello TeleTask\n");
  });

  app.get("/upload", (req, res) => {
    tsvToDB("src/1280846484_20171001_20171029_details.tsv").then(array => {
      res.send(
        "Uploaded " +
          array[1] +
          " from a total of " +
          array[0] +
          " entries in the file\n"
      );
    });
  });

  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
});

function tsvToDB(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "ascii", (err, data) => {
      if (err) throw err;
      parse(data, { delimiter: "\t", auto_parse: true }, (err, output) => {
        output.splice(0, 1);
        output.forEach(itemToDate);
        dbHelper.insertIntoDB(output).then(completed => {
          resolve([output.length, completed]);
        });
      });
    });
  });
}

function itemToDate(item, index, parent) {
  var tempDate = new Date(item[0]);
  item[0] = dbHelper.toMYSQLDate(tempDate);
  parent[index] = item;
}
