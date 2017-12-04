const request = require("request");

function crawl(dbConnection) {
  loadItunesPage("433154761");

  /*var sql = "SELECT itunes_id FROM data GROUP BY itunes_id";
    dbConnection.query(sql,[], function(err, result) {
        if (err) throw err;
        
        result.some(val => {
          console.log(val);
        });
    });*/
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
  var matches = body.match(/<h1>[^<]*<\/h1>/g);
  if (matches == null || matches.size < 1) return false;
  var headline = matches[0].replace(/<\/?h1>/g, "");
  return headline;
}

function grapAuthor(body) {
  var matches = body.match(/<h2>By[^<]*<\/h2>/g);
  if (matches == null || matches.size < 1) return false;
  var author = matches[0].replace(/<h2>By /g, "");
  author = author.replace(/<\/h2>/g, "");
  return author;
}

module.exports = {
  crawl: crawl,
  "grapHeadline":grapHeadline,
  grapAuthor:grapAuthor
};
