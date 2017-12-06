const request = require("request");

function crawl(dbConnection) {
  //loadItunesPage("433154761");

  var sql =
    "SELECT itunes_id FROM data WHERE itunes_title IS NULL GROUP BY itunes_id";
  dbConnection.query(sql, [], function(err, result) {
    if (err) throw err;

    result.some(val => {
      console.log(val.itunes_id);
      loadItunesPage(val.itunes_id)
        .then(body => {
          return Promise.all([grapHeadline(body), grapAuthor(body)]);
        })
        .then(
          values => {
            console.log(val.itunes_id + " " + values);
            return saveCrawled(dbConnection, val.itunes_id, [0], values[1]);
          },
          err => {}
        );
    });
    dbConnection.release();
  });
}

function loadItunesPage(itunesId) {
  return new Promise((resolve, reject) => {
    var url = "https://itunes.apple.com/de/podcast/id" + itunesId;
    //var url = "http://localhost:8080/sampleItunes.html";
    request.get(url, (error, response, body) => {
      if (error) reject(error);
      resolve(body);
    });
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
    if (matches == null || matches.size < 1) reject();
    var author = matches[0].replace(/<h2>By /g, "");
    author = author.replace(/<\/h2>/g, "");
    resolve(author);
  });
}

function saveCrawled(dbConnection, itunes_id, headline, author) {
  return new Promise((resolve, reject) => {
    dbConnection.query(
      "UPDATE `data` SET `itunes_title` = ?, `itunes_author` = ? WHERE `itunes_id` = ?;",
      [headline, author, itunes_id],
      function(err, result) {
        if (err) reject();
        resolve();
      }
    );
  });
}

module.exports = {
  crawl: crawl,
  grapHeadline: grapHeadline,
  grapAuthor: grapAuthor,
  saveCrawled: saveCrawled
};
