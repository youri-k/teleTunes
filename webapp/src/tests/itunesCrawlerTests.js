const assert = require('assert');
var itunesCrawler = require("../itunesCrawler.js");

it("should extract the headline",function(){
    assert.equal(itunesCrawler.grapHeadline("asdfsdfsdf\ndsds<h1>myHeadline ä ö ü ß</h1> asasasas \nsasas"),"myHeadline ä ö ü ß");
});


it("should extract the author",function(){
    assert.equal(itunesCrawler.grapAuthor("asdfsdfsdf\ndsds<h2>By a demo Prof</h2>"),"a demo Prof");
});


