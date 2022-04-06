# O2OCryptoCashMart
本儲存庫用來儲存專案中額外的檔案  
<img src="https://github.com/2ndHG/O2OCryptoCashMart/blob/main/Image4GitHub/Screenshot_1646051386.png" width="250">
<img src="https://github.com/2ndHG/O2OCryptoCashMart/blob/main/Image4GitHub/Screenshot_1646962941.png" width="250">
  

## **安裝這個APP的步驟:**
### 步驟一: 安裝Blue Wallet
請參考Blue Wallet於[Git hub上的文件](https://github.com/BlueWallet/BlueWallet "Blue Wallet Git Hub首頁")安裝Blue Wallet，本專案使用的版本為[6.2.6(6.2.5)](https://github.com/BlueWallet/BlueWallet/releases/tag/v6.2.5 "Blue Wallet6.2.5下載頁面")  
可安裝在任意的路徑，接下來本文稱它為**BW工作路徑**  

### 步驟二: 為Blue Wallet安裝本專案額外元件
1.將本儲存庫中BlueWallet資料夾中的所有檔案複製或覆蓋至對應的**BW工作路徑**的檔案  
2.在**BW工作路徑**下使用`npm install`指令安裝本專案的NodeJS模組(ipfs-mini.js)  

### 步驟三: 安裝模擬電商平台伺服器
1.將本儲存庫中HappyServer資料夾中的所有檔案複製到任意的路徑中  
2.在該路徑下使用 `npm install` 指令來安裝伺服器所需的NodeJS模組  
3.在./routes/order.js中設定infura的金鑰和以太坊的私鑰，這將用來部屬智能合約，詳情請參考[infura官方文件](https://blog.infura.io/zh_tw/zai-ethereum-bu-shu-zhi-hui-xing-he-yue-ji-guan-li-jiao-yi/ "infura官方文件")和各種infura教學  
4.安裝Mysql資料庫系統，並且匯入藍錢包伺服器資料庫，如果已有Mysql資料庫使用者，需要再把./routes各個`mysql.createConnection()`參數改為自己的使用者帳號密碼。  
5.使用node app.js開始執行伺服器  
  
  
## **特別感謝、提及**
錢包內按鈕圖示(icon)的作者:  
[https://www.flaticon.com/authors/gregor-cresnar](https://www.flaticon.com/authors/gregor-cresnar)  
[https://www.flaticon.com/authors/srip](https://www.flaticon.com/authors/srip)  
