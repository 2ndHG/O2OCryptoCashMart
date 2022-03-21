const express = require('express');
const app = express();
const port = 3101;
app.use(express.static('public'));

const { v4: uuidv4 } = require('uuid');

var birds = require('./routes/birds');
app.use('/birds', birds);
var login = require('./routes/login');
app.use('/login', login);
var getData = require('./routes/getData');
app.use('/getData', getData);
var uploadData = require('./routes/uploadData');
app.use('/uploadData', uploadData);
var order = require('./routes/order');
app.use('/order', order);

// app.use(express.json({
//  type: ['application/json', 'text/plain']
//}))
//表單解碼 這兩個為fetch post必需
//var bodyParser = require('body-parser');
//app.use(bodyParser.json());

console.log(uuidv4());

app.get('/', (req, res) => {
  res.sendFile(__dirname+ '/index.html')

});

app.listen(port, () => {
  console.log(`正在port: http://localhost:${port}上執行`)
});

