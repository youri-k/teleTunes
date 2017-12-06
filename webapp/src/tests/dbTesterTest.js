var dbTester = require("../dbTester.js");
const assert = require('assert');

it("should assert true as d entry exists",function(){
    
    return dbTester.assertDBValue(1, "id",1);
});

it("should assert false as the entry as a  wrong id",function(){
    return dbTester.assertDBValue(2, "id",1).then(
        function(){assert.fail("should not succed");},
        function(){assert(true);});
});

it("should assert false as the column name is unknown",function(){
    return dbTester.assertDBValue(1, "idfsfsfdsf",1).then(
        function(){assert.fail("should not succed");},
        function(){assert(true);});
});

