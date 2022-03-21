var express = require('express');
var router = express.Router();
const path = require('path');
const mysql = require('mysql2'); 
const e = require('express');

const getMerchantList = (req , res, 參數) => {
    console.log("取得攤商清單")
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let sql =`SELECT 攤商GUID, 攤商名稱, 攤商圖片, 攤商介紹 FROM 攤商 `;
    connection.query( sql, function(err, results, fields) {
        //console.log(results); // results contains rows returned by server
        console.log(err);
        //有此帳號回傳true
        if(err) {
            console.log(err);
        } else {
            res.json(results);
        }
    });

}
const getStockList = (req, res, 參數) => {
    console.log("取得商品清單");
    let 攤商GUID = 參數.攤商GUID;
    console.log(攤商GUID);
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let sql =`SELECT 商品GUID, 商品名稱, 商品上架日期, 商品圖片, 商品介紹, 商品數量, 商品價格 FROM 商品 WHERE 商品攤商GUID='${攤商GUID}'`;
    console.log(sql);
    connection.query( sql, function(err, results, fields) {
        //console.log(results); // results contains rows returned by server
        if(err) {
            console.log(err);
        } else {
            console.log(results);
            res.json(results);
        }
    });
}
const getStock = (req, res, 參數) => {
    console.log("取得商品");
    let 商品GUID = 參數.商品GUID;
    console.log(商品GUID);
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let sql =`SELECT 商品名稱, 商品圖片, 商品數量, 商品價格 FROM 商品 WHERE 商品GUID='${商品GUID}'`;
    console.log(sql);
    connection.query( sql, function(err, results, fields) {
        //console.log(results); // results contains rows returned by server
        if(err) {
            console.log(err);
        } else {
            console.log(results[0]);
            res.json(results[0]);
        }
    });
}
const getOrderRecord = (req, res, 參數) => {
    console.log("取得訂單");
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器' 
    });
    let sql;
    if(參數.type == 'user'){
        sql =`SELECT 訂單GUID, 訂單攤商GUID, 訂單內容, 訂單付款lnd, 訂單狀態, 訂單EthHash, 訂單IPFSHash, 訂單外送員GUID FROM 訂單 WHERE 訂單消費者GUID='${參數.消費者GUID}'`;
        connection.query( sql, function(err, results, fields) {
            //console.log(results); // results contains rows returned by server
            if(err) {
                console.log(err);
            } else {
                console.log(`已回傳消費者GUID: ${參數.消費者GUID}的訂單(${results.length}筆資料)`);
                
                res.json(results);
            }
        });
    }
    if(參數.type == 'merchant'){
        sql =`SELECT 訂單GUID, 訂單攤商GUID, 訂單內容, 訂單付款lnd, 訂單狀態, 訂單EthHash, 訂單IPFSHash, 訂單外送員GUID FROM 訂單 WHERE 訂單攤商GUID='${參數.攤商GUID}'`;
        connection.query( sql, function(err, results, fields) {
            //console.log(results); // results contains rows returned by server
            if(err) {
                console.log(err);
            } else {
                console.log(`已回傳攤商GUID: ${參數.攤商GUID}的訂單(${results.length}筆資料)`);
                
                res.json(results);
            }
        });
    }
    if(參數.type == 'deliverer'){
        sql =`SELECT 訂單GUID, 訂單攤商GUID FROM 訂單 WHERE 訂單外送員GUID='外送' AND 訂單狀態='已付款'`;
        connection.query( sql, function(err, results, fields) {
            //console.log(results); // results contains rows returned by server
            if(err) {
                console.log(err);
            } else {
                console.log(results)
                res.json(results);
            }
        });
    }
    connection.end();
}

const getData = () => {
    console.log("取得任何資訊, sql=");
    let sql = 參數.sql;
    console.log(sql);
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    connection.query( sql, function(err, results, fields) {
        //console.log(results); // results contains rows returned by server
        if(err) {
            console.log(err);
        } else {
            console.log(results);
            res.json(results);
        }
    });
}

router.get('/:commond', (req, res) => {
    console.log("=====請求=====")
    console.log("指令:")
    console.log(req.params)
    let 指令=req.params.commond;
    console.log("參數:")
    let 參數=req.query;
    console.log(req.query);

    if(指令 == 'getMerchantList') {
        getMerchantList(req, res, 參數);
    } else if(指令 == 'getStockList') {
        getStockList(req, res, 參數);
    } else if(指令 == 'getStock') {
        getStock(req, res, 參數);
    } else if(指令 == 'getOrderRecord') {
        getOrderRecord(req, res, 參數);
    } else {
        getData(req, res, 參數);
    }  
});

module.exports = router;