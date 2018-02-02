"use strict";

const express = require("express");
const fs = require("fs");
var dbHelper = require("./db.js");
var parse = require("csv-parse");
//var mail = require("./mail.js");
var itunesCrawler = require("./itunesCrawler.js");
var path = require("path");
var session = require("express-session");
const fileUpload = require("express-fileupload");

var bodyParser = require("body-parser");

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

// App
dbHelper.setup().then(() => {
  const app = express();
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(session({ secret: "Eesh9moh" }));
  app.use(fileUpload());

  app.set("views", path.join(__dirname + "/view/"));
  app.set("view engine", "ejs");

  // Use external files in root-folder for HTML, CSS, JS
  app.use(express.static(__dirname + "/"));

  // Show charts.html on /charts
  app.get("/", (req, res) => {
    var sess = req.session;
    res.render("charts.ejs", { user: sess.user });
  });

  app.get("/sample", (req, res) => {
    res.sendFile(path.join(__dirname + "/view/sample.html"));
  });

  function checkLogin(req, res) {
    var sess = req.session;
    if (typeof sess.user == "undefined" || sess.user == "") {
      res.render("login2.ejs", { user: sess.user });
      return false;
    }

    return true;
  }

  app.get("/login", (req, res) => {
    if (checkLogin(req, res)) {
      res.render("upload.ejs", { user: sess.user });
    }
  });

  app.post("/login", (req, res) => {
    if (req.body.user == "Test" && req.body.password == "Passwort") {
      var sess = req.session;
      sess.user = req.body.user;
      res.render("upload.ejs", { user: sess.user });
    } else {
      res.render("login2.ejs", {
        loginFailed: true
      });
    }
  });

  app.get("/logout", (req, res) => {
    var sess = req.session;
    sess.user = "";
    res.render("login2.ejs", { user: sess.user });
  });

  app.post("/import", (req, res) => {
    var sess = req.session;
    if (checkLogin(req, res)) {
      tsvStringToDB(req.files.file.data.toString()).then(array => {
        crawlAfterInsert();
        res.render("uploaded.ejs", {
          user: sess.user,
          newEntries: array[1],
          allEntries: array[0]
        });
      });
    }
  });

  app.get("/combinedVisitsPerDay", (req, res) => {
    var fields;
    if (req.query.fields) fields = req.query.fields.split(",");
    dbHelper
      .getCombinedVisitsPerDay(req.query.startDate, req.query.endDate, fields)
      .then(values => res.send(JSON.stringify(values)));
  });

  app.get("/maxInteractionsInInterval", (req, res) => {
    var fields;
    if (req.query.fields) fields = req.query.fields.split(",");
    dbHelper
      .getMaximumInteractionsInInterval(
        req.query.startDate,
        req.query.endDate,
        req.query.limit,
        fields
      )
      .then(value => res.send(JSON.stringify(value)));
  });

  app.get("/api/course", function(req, res) {
    var fields;
    if (req.query.fields) fields = req.query.fields.split(",");
    dbHelper
      .getSingleCourse(
        req.query.startDate,
        req.query.endDate,
        fields,
        req.query.id
      )
      .then(value => res.send(JSON.stringify(value)));
  });

  app.get("/api/courses", (req, res) => {
      var startingWith = "";
      if (req.query.startingWith)
          startingWith = req.query.startingWith;
      dbHelper.getCourses(startingWith).then(value => res.send(JSON.stringify(value)));
  });

  app.get("*", function(req, res) {
    res.send("Leider gibt es die angefragte Seite nicht :(", 404);
  });

  app.listen(PORT, HOST);
  console.log(`Running on http://${HOST}:${PORT}`);
});

function tsvToDB(file) {
  fs.readFile(file, "ascii", (err, data) => {
    if (err) throw err;
    return tsvStringToDB(data);
  });
}

function tsvStringToDB(string) {
  return new Promise((resolve, reject) => {
    parse(string, { delimiter: "\t", auto_parse: true }, (err, output) => {
      output.splice(0, 1);
      output.forEach(itemToDate);
      dbHelper.insertIntoDB(output).then(completed => {
        resolve([output.length, completed]);
      });
    });
  });
}

function itemToDate(item, index, parent) {
  var tempDate = new Date(item[0]);
  item[0] = dbHelper.toMYSQLDate(tempDate);
  parent[index] = item;
}

//mail.setup();
function crawlAfterInsert() {
  dbHelper.getConnection().then(con => {
    itunesCrawler.crawl(con);
  });
}
//crawlAfterInsert();
//itunesCrawler.crawl(dbHelper.getConnection());
//mail.sendReport("jakob.braun@posteo.de");
