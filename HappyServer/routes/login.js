var express = require('express');
var router = express.Router();
const mysql = require('mysql2');


//表單解碼，下兩行為fetch post必需
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//登入
router.post('/', urlencodedParser, function(req, res) {
    let body = req.body;
    console.log(body)
    if(body.type == 'user') {
        // create the connection to database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: '藍錢包伺服器'
        });
        let sql =`SELECT * FROM 消費者 where 消費者信箱='${body.address}' AND 消費者密碼='${body.password}' LIMIT 1`;
        // simple query
        connection.query( sql, function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(err);
            //有此帳號回傳true
            let response = {
                loginOK: results.length == 1,
                message: results.length == 1? '登入成功' :'帳號或密碼錯誤',
                userData: results[0]
            }
            res.json(response);
        });
    } else if( body.type == 'merchant') {
        // create the connection to database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: '藍錢包伺服器'
        });
        let sql =`SELECT * FROM 攤商 where 攤商信箱='${body.address}' AND 攤商密碼='${body.password}' LIMIT 1`;
        // simple query
        connection.query( sql, function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(err);
            //有此帳號回傳true
            let response = {
                loginOK: results.length == 1,
                message: results.length == 1? '登入成功' :'帳號或密碼錯誤',
                userData: results[0]
            }
            res.json(response);
        });
    } else if( body.type == 'deliverer') {
        // create the connection to database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: '藍錢包伺服器'
        });
        let sql =`SELECT * FROM 外送員 where 外送員信箱='${body.address}' AND 外送員密碼='${body.password}' LIMIT 1`;
        // simple query
        connection.query( sql, function(err, results, fields) {
            console.log(results); // results contains rows returned by server
            console.log(err);
            //有此帳號回傳true
            let response = {
                loginOK: results.length == 1,
                message: results.length == 1? '登入成功' :'帳號或密碼錯誤',
                userData: results[0]
            }
            res.json(response);
        });
    } else
        res.json({loginOK: false, message: 'login type error'})
});

router.get('/', function(req, res) {
   
    let body = req.query;
    if(body.type == 'user') {
        // create the connection to database
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: '藍錢包伺服器'
        });
        connection.connect((err) => {
            if (err) {
                throw err;
            }
        });
        let sql =`SELECT * FROM 消費者 where 消費者地址='${body.address}' AND 消費者密碼='${body.password}' LIMIT 1`;
        // simple query
        connection.query( sql, function(err, results, fields) {
            if(err)
            {
                console.log(err);
                return;
            }
            res.send('OK');
            console.log(results); // results contains rows returned by server
        });
       
    }
});

router.get('/all', function(req, res) {
    console.log('取得所有資料');
    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器',
    });
    connection.connect((err) => {
        if (err) {
            throw err;
        }
    });
    let sql =`SELECT * FROM 消費者`;
    // simple query
    connection.query( sql, function(err, results, fields) {
        if(err)  {
            console.log(err);
            return;
        }
        res.json({message: 'ok'});
        console.log(results); // results contains rows returned by server
    });
});
module.exports = router;