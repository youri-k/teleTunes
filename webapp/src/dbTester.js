var dbHelper = require("./db.js"); 
const assert = require('assert');

function setupSampleData(){
    //TODO: @jurin: fill db with demo data
}

setupSampleData();

function assertDBValue(rowId, colName, colValue){
    return new Promise((resolve, reject) => {
        dbHelper.getConnection().then(
            con => {
                return con.query("SELECT * FROM `data` WHERE `id` = ?",rowId,function(err,res){
                    try{
                        if(err) reject(err);
                        assert.equal(res.length,1);
                        res.some(val => {
                            assert.equal(val[colName],colValue);
                        });
                        resolve();
                    }catch(err){
                        reject(err);
                    };
                });
            }, 
            err => {reject("db connection failed")}
        );
    });
}

module.exports = {
  assertDBValue: assertDBValue
};


