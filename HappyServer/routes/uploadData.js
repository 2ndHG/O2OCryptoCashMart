var express = require('express');
var router = express.Router();
const path = require('path');
const mysql = require('mysql2'); 


//表單解碼，下兩行為fetch post必需
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/:commond', urlencodedParser, (req, res) => {
    console.log("=====請求=====")
    console.log("指令:")
    console.log(req.params)
    let 指令=req.params.commond;
    console.log("參數:")
    let 參數=req.query;
    console.log(req.query);
    let body = req.body;
    console.log("訊息body:")
    console.log(body);
    if(指令 == 'getMerchantList') {
        getMerchantList(req, res, 參數);
    } else if (指令 == 'updateInvoice') {
        console.log(body)
    } else
        res.json({message: '未知的指令'})
});

module.exports = router;