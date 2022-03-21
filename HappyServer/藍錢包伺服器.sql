-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2022-03-21 05:23:54
-- 伺服器版本： 10.4.19-MariaDB
-- PHP 版本： 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫: `藍錢包伺服器`
--

-- --------------------------------------------------------

--
-- 資料表結構 `商品`
--

CREATE TABLE `商品` (
  `商品GUID` varchar(64) NOT NULL,
  `商品攤商GUID` varchar(32) NOT NULL,
  `商品名稱` varchar(32) NOT NULL,
  `商品上架日期` date NOT NULL,
  `商品圖片` varchar(100) NOT NULL,
  `商品介紹` varchar(200) NOT NULL,
  `商品數量` int(8) NOT NULL,
  `商品價格` int(8) NOT NULL,
  `商品支票` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `商品`
--

INSERT INTO `商品` (`商品GUID`, `商品攤商GUID`, `商品名稱`, `商品上架日期`, `商品圖片`, `商品介紹`, `商品數量`, `商品價格`, `商品支票`) VALUES
('7955a718-8d26-4c18-b60e-1ddd222c432f', 'a67e46f6-021a-4037-a582-5ad12d05', '洋蔥', '2021-12-14', '洋蔥.jpg', '大大大洋蔥', 100, 20, ''),
('9e0772a2-e7ea-41bf-8163-a0ba191a482c', '9e5fe895-928a-4358-84d9-5b9fbff2', '一大包冰塊', '2022-01-12', '冰塊.jpg', '我們誠摯的希望送到時還沒熔化', 100, 50, ''),
('be4eb9f4-a7b1-4655-a46d-b963e1658f59', 'a67e46f6-021a-4037-a582-5ad12d05', '青江菜', '2021-12-24', '青江菜.jpg', '好吃的青江菜', 60, 25, '');

-- --------------------------------------------------------

--
-- 資料表結構 `外送員`
--

CREATE TABLE `外送員` (
  `外送員GUID` varchar(64) NOT NULL,
  `外送員信箱` varchar(64) NOT NULL,
  `外送員密碼` varchar(64) NOT NULL,
  `外送員名稱` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `外送員`
--

INSERT INTO `外送員` (`外送員GUID`, `外送員信箱`, `外送員密碼`, `外送員名稱`) VALUES
('9583ba21-96d1-426b-8a07-ccc0ebafed9d', 'd1@gmail.com', '1111', '阿格');

-- --------------------------------------------------------

--
-- 資料表結構 `攤商`
--

CREATE TABLE `攤商` (
  `攤商GUID` varchar(32) NOT NULL,
  `攤商信箱` varchar(32) NOT NULL,
  `攤商密碼` varchar(32) NOT NULL,
  `攤商名稱` varchar(32) NOT NULL,
  `攤商介紹` varchar(32) NOT NULL,
  `攤商圖片` varchar(32) NOT NULL,
  `攤商公鑰` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `攤商`
--

INSERT INTO `攤商` (`攤商GUID`, `攤商信箱`, `攤商密碼`, `攤商名稱`, `攤商介紹`, `攤商圖片`, `攤商公鑰`) VALUES
('9e5fe895-928a-4358-84d9-5b9fbff2', 'm2@gmail.com', '2222', '開心菜園', '吃了我們的菜會很開心', 'm2.png', ''),
('a67e46f6-021a-4037-a582-5ad12d05', 'm1@gmail.com', '1111', '資工食材鋪', '各種食材都有賣', 'm1.png', '');

-- --------------------------------------------------------

--
-- 資料表結構 `消費者`
--

CREATE TABLE `消費者` (
  `消費者GUID` varchar(32) NOT NULL,
  `消費者信箱` varchar(32) NOT NULL,
  `消費者密碼` varchar(32) NOT NULL,
  `消費者名稱` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `消費者`
--

INSERT INTO `消費者` (`消費者GUID`, `消費者信箱`, `消費者密碼`, `消費者名稱`) VALUES
('1', 'u1@gmail.com', '1111', '小明'),
('2', 'u2@gmail.com', '2222', '小李');

-- --------------------------------------------------------

--
-- 資料表結構 `訂單`
--

CREATE TABLE `訂單` (
  `訂單GUID` varchar(64) NOT NULL,
  `訂單消費者GUID` varchar(64) NOT NULL,
  `訂單攤商GUID` varchar(64) NOT NULL,
  `訂單內容` varchar(1024) NOT NULL,
  `訂單付款lnd` varchar(512) NOT NULL,
  `訂單狀態` varchar(8) NOT NULL,
  `訂單EthHash` varchar(128) NOT NULL,
  `訂單IPFSHash` varchar(128) NOT NULL,
  `訂單外送員GUID` varchar(64) NOT NULL DEFAULT '店家親送'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `商品`
--
ALTER TABLE `商品`
  ADD PRIMARY KEY (`商品GUID`),
  ADD KEY `商品攤商GUID` (`商品攤商GUID`);

--
-- 資料表索引 `攤商`
--
ALTER TABLE `攤商`
  ADD PRIMARY KEY (`攤商GUID`);

--
-- 資料表索引 `消費者`
--
ALTER TABLE `消費者`
  ADD PRIMARY KEY (`消費者GUID`);

--
-- 資料表索引 `訂單`
--
ALTER TABLE `訂單`
  ADD PRIMARY KEY (`訂單GUID`),
  ADD KEY `訂單消費者GUID` (`訂單消費者GUID`),
  ADD KEY `訂單攤商GUID` (`訂單攤商GUID`);

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `商品`
--
ALTER TABLE `商品`
  ADD CONSTRAINT `商品_ibfk_1` FOREIGN KEY (`商品攤商GUID`) REFERENCES `攤商` (`攤商GUID`);

--
-- 資料表的限制式 `訂單`
--
ALTER TABLE `訂單`
  ADD CONSTRAINT `訂單_ibfk_1` FOREIGN KEY (`訂單攤商GUID`) REFERENCES `攤商` (`攤商GUID`),
  ADD CONSTRAINT `訂單_ibfk_2` FOREIGN KEY (`訂單消費者GUID`) REFERENCES `消費者` (`消費者GUID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
