const request = require("request");

function crawl(dbConnection) {
  //loadItunesPage("433154761");

  var sql = "SELECT itunes_id FROM data WHERE itunes_title IS NULL GROUP BY itunes_id";
    dbConnection.query(sql,[], function(err, result) {
        if (err) throw err;
        
        result.some(val => {
          console.log(val);
        });
    });
}

function loadItunesPage(itunesId) {
  var url = "https://itunes.apple.com/de/podcast/id" + itunesId;
  //var url = "http://localhost:8080/sampleItunes.html";
  request.get(url, (error, response, body) => {
    grapHeadline(body);
    grapAuthor(body);
  });
}

function grapHeadline(body) {
    return new Promise((resolve, reject) => {
        var matches = body.match(/<h1>[^<]*<\/h1>/g);
        if (matches == null || matches.size < 1) reject();
        var headline = matches[0].replace(/<\/?h1>/g, "");
        resolve(headline);
    });
}

function grapAuthor(body) {
    return new Promise((resolve, reject) => {
        var matches = body.match(/<h2>By[^<]*<\/h2>/g);
        if (matches == null || matches.size < 1) reject();;
        var author = matches[0].replace(/<h2>By /g, "");
        author = author.replace(/<\/h2>/g, "");
        resolve( author);
    });
}

function saveCrawled(headline, author){
    
}

module.exports = {
  crawl: crawl,
  "grapHeadline":grapHeadline,
  grapAuthor:grapAuthor
};
