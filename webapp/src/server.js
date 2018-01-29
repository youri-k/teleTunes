"use strict";

const express = require("express");
const fs = require("fs");
var dbHelper = require("./db.js");
var parse = require("csv-parse");
var auth = require("http-auth");
//var mail = require("./mail.js");
var itunesCrawler = require("./itunesCrawler.js");
var path = require("path");
var session = require('express-session');
const fileUpload = require('express-fileupload');

var bodyParser = require('body-parser');

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
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.use(session({secret: 'Eesh9moh'}));
  app.use(fileUpload());
  
  app.set('views', path.join(__dirname + "/view/"));
  app.set('view engine', 'ejs');

  // Use external files in root-folder for HTML, CSS, JS
  app.use(express.static(__dirname + "/"));

  app.use("/upload", auth.connect(basic));

  // Show charts.html on /charts
  app.get("/charts", (req, res) => {
    res.render('charts.ejs');
  });

  app.get("/sample", (req, res) => {
    res.sendFile(path.join(__dirname + "/view/sample.html"));
  });
  

function checkLogin(req, res){
      var sess=req.session;
      if(typeof sess.user == "undefined" || sess.user == ""){
            res.render('login2.ejs', {"user":sess.user});
            return false;
      }
      
      return true;
  }
  
  app.get("/", (req, res) => {
      if(checkLogin(req, res)){
          res.render('upload.ejs',{"user":sess.user});
      }
  });
  

  app.post("/", (req, res) => {
      if(req.body.user == "Test" && req.body.password == "Passwort"){
          var sess=req.session;
          sess.user = req.body.user;
          res.render('upload.ejs',{"user":sess.user});
      }
      else{
        res.render('login2.ejs',{
          "loginFailed" : true
        });   
      }
  });
  
  app.get("/logout", (req, res) => {
      var sess=req.session;
      sess.user = "";
      res.render('login2.ejs',{"user":sess.user});
  });
  

  app.post("/import", (req, res) => {
      
    if(checkLogin(req, res)){
        tsvStringToDB(req.files.file.data.toString()).then(array => {
        crawlAfterInsert();
        res.send(
            "Uploaded " +
            array[1] +
            " from a total of " +
            array[0] +
            " entries in the file\n"
        );
        });
    }
  });
  
  
  app.get("/upload", (req, res) => {
    tsvToDB("src/1280846484_20171001_20171029_details.tsv").then(array => {
      crawlAfterInsert();
      res.send(
        "Uploaded " +
          array[1] +
          " from a total of " +
          array[0] +
          " entries in the file\n"
      );
    });
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
