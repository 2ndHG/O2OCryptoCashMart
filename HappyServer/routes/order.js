var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

//表單解碼，下兩行為fetch post必需
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**=====================web3 ====================*/
const Web3 = require('web3');
const infuraAPIKey = "";//輸入你的infuraAPI金鑰
web3js = new Web3(new Web3.providers.HttpProvider(infuraAPIKey));

var privateKey = ""//輸入你的私鑰

const signer = web3js.eth.accounts.privateKeyToAccount(privateKey);
web3js.eth.accounts.wallet.add(signer);
var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "setMSG1",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
    }]
var contractAddress = '0x40509BeC520bc4abBbc44B6f6067Dd5c4c721AC8';
var contract= new web3js.eth.Contract(abi, contractAddress);

deployContract = async (訂單IPFSHash, 訂單GUID) => {

    let timer =0;
    
    const tx = contract.methods.setMSG1(訂單IPFSHash);
    const receipt = await tx
    .send({
        from: signer.address,
        gas: await tx.estimateGas(),
    })
    .once("transactionHash", (txhash) => {
        timer = Date.now();
        console.log(`Mining transaction ...`);
        console.log(txhash);

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: '藍錢包伺服器'
        });
        let sql = `UPDATE 訂單 SET 訂單EthHash="${txhash}", 訂單狀態="已付款" WHERE 訂單GUID="${訂單GUID}"`
        connection.query( sql, function(err, results, fields) {
            if(err) {
                console.log(err);
                res.json({message: 'Fail'});
            } else {
                console.log(results); // results contains rows returned by server
            }
        });
    });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
    console.log(`共耗時 ${(Date.now()-timer)/1000}秒被放入區塊鏈中`);
}
/**===================web3 ========================*/
router.post('/sendOrder', urlencodedParser, function(req, res) {
    let body = req.body;
    console.log(body)
    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let 訂單GUID = uuidv4();
    let sql =
    `INSERT INTO 訂單(訂單GUID, 訂單消費者GUID, 訂單攤商GUID, 訂單內容, 訂單狀態, 訂單外送員GUID) VALUES('${訂單GUID}', '${body.消費者GUID}', '${body.攤商GUID}', '${JSON.stringify(body.購物車)}', '待確認', '店家親送')`;
    // simple query
    connection.query( sql, function(err, results, fields) {
        if(err) {
            console.log(err);
            res.json({message: 'Fail'});
        } else {
            console.log(results); // results contains rows returned by server
            res.json({message: 'OK'});
        }
        
    });
});
router.post('/switchDeliverer', urlencodedParser, function(req, res) {
    let body = req.body;
    let 訂單外送員GUID ;
    if(body.訂單外送員GUID == '店家親送')
        訂單外送員GUID = '外送';
    else if(body.訂單外送員GUID == '外送')
        訂單外送員GUID = '店家親送';
    console.log(body)
    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let sql =
    `UPDATE 訂單 SET 訂單外送員GUID="${訂單外送員GUID}" WHERE 訂單GUID="${body.訂單GUID}"`    // simple query
    connection.query( sql, function(err, results, fields) {
        if(err) {
            console.log(err);
            res.json({message: 'Switch Fail'});
        } else {
            console.log(results); // results contains rows returned by server
            res.json({message: 'Switch OK'});
        }
        
    });
});
router.post('/endOrder', urlencodedParser, function(req, res) {
    let body = req.body;
    console.log(body)
    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    let sql =
    `UPDATE 訂單 SET 訂單狀態="已完成" WHERE 訂單GUID="${body.訂單GUID}"`    // simple query
    connection.query( sql, function(err, results, fields) {
        if(err) {
            console.log(err);
            res.json({message: 'End Fail'});
        } else {
            console.log(results); // results contains rows returned by server
            res.json({message: 'End OK'});
        }
        
    });
});
router.post('/updateOrder', urlencodedParser, function(req, res) {
    let body = req.body;
    console.log(body)
    // create the connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: '藍錢包伺服器'
    });
    if(body.command == "接受訂單") {
        // simple query
        let sql = `UPDATE 訂單 SET 訂單付款lnd="${body.訂單付款lnd}", 訂單狀態="待付款" WHERE 訂單GUID="${body.訂單GUID}"`
        connection.query( sql, function(err, results, fields) {
            if(err) {
                console.log(err);
                res.json({message: 'Fail'});
            } else {
                console.log(results); // results contains rows returned by server
                res.json({message: 'OK'});
            }
        });
    }
    if(body.command == "付款成功") {
        // 將IPFS hash寫入資料庫
        let sql = `UPDATE 訂單 SET 訂單IPFSHash="${body.訂單IPFSHash}", 訂單狀態="已付款" WHERE 訂單GUID="${body.訂單GUID}"`

        connection.query( sql, function(err, results, fields) {
            if(err) {
                console.log(err);
                res.json({message: 'Fail'});
            } else {
                console.log(results); // results contains rows returned by server
                
                res.json({message: 'OK'});
            }
        });
        //將IPFS hash寫入以太坊
        deployContract(body.訂單IPFSHash, body.訂單GUID);
    }
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