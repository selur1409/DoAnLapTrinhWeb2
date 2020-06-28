-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 28, 2020 at 04:14 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `news`
--
CREATE DATABASE IF NOT EXISTS `news` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
USE `news`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Password_hash` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DateRegister` datetime NOT NULL,
  `DateExpired` datetime NOT NULL,
  `TypeAccount` int(4) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Accounts_TypeAccount` (`TypeAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`Id`, `Username`, `Password_hash`, `DateRegister`, `DateExpired`, `TypeAccount`, `IsDelete`) VALUES
(1, 'writer123', '$2a$08$URXr.tpbrXkZHJsg5iPIPecFiCA0O7iAYuLlDeBkK0GDGRU6uBQk2', '2020-06-22 00:00:00', '2020-06-22 00:00:00', 2, 0),
(5, 'admin123', '$2a$08$GkmYMgW5ix6jXx4OLKK6MOEpcGFq9yVjHIaT113wGxl3PybFowvj.', '2020-06-23 20:14:59', '2020-06-30 20:14:59', 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Ngôn Ngữ Lập Trình', 0),
(2, 'Web Fontend', 0),
(3, 'Web Backend', 0),
(4, 'Mobile Web', 0),
(5, 'Database', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories_sub`
--

CREATE TABLE IF NOT EXISTS `categories_sub` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdCategoriesMain` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IdCategoriesMain` (`IdCategoriesMain`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `categories_sub`
--

INSERT INTO `categories_sub` (`Id`, `IdCategoriesMain`, `Name`, `IsDelete`) VALUES
(1, 1, 'C++', 0),
(2, 1, 'Java', 0),
(3, 1, 'C#', 0),
(4, 1, 'C', 0),
(5, 1, 'Ruby', 0),
(6, 1, 'Golang', 0),
(7, 2, 'Javascript', 0),
(8, 2, 'AngularJS', 0),
(9, 2, 'jQuery', 0),
(10, 2, 'HTML & CSS', 0),
(11, 3, 'PHP', 0),
(12, 3, 'Laravel', 0),
(13, 3, 'Học WordPress', 0),
(14, 3, 'NodeJS', 0),
(15, 4, 'React Native', 0),
(16, 4, 'IOS', 0),
(17, 4, 'Android', 0),
(18, 5, 'MySQL', 0),
(19, 5, 'SQL Server', 0),
(20, 5, 'Oracle', 0),
(21, 5, 'MongoDB', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `DatetimeComment` datetime NOT NULL,
  `IdReader` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Comment_Informations` (`IdReader`),
  KEY `Comment_Posts` (`IdPost`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `editoraccount`
--

CREATE TABLE IF NOT EXISTS `editoraccount` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdAccount` int(11) NOT NULL,
  `IdCategoríe` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`,`IdAccount`,`IdCategoríe`) USING BTREE,
  KEY `EditorAccount_Accounts` (`IdAccount`),
  KEY `EditorAccount_Categories` (`IdCategoríe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE IF NOT EXISTS `feedback` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Note` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `DatetimeApproval` datetime NOT NULL,
  `IdEditorAccount` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Feedback_EditorAccount` (`IdEditorAccount`),
  KEY `Feedback_Posts` (`IdPost`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `information`
--

CREATE TABLE IF NOT EXISTS `information` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Nickname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DOB` date NOT NULL,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Phone` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IdAccount` int(11) NOT NULL,
  `Sex` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Information_Accounts` (`IdAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `information`
--

INSERT INTO `information` (`Id`, `Name`, `Nickname`, `Avatar`, `DOB`, `Email`, `Phone`, `IdAccount`, `Sex`) VALUES
(1, 'Admin', NULL, 'avatar2.png\r\n', '2020-06-23', 'Admin123@gmail.com', '0987654321', 5, 0),
(2, 'Writer', NULL, NULL, '2020-06-17', 'anhkhuong1306@gmail.com', '0904567891', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `postdetails`
--

CREATE TABLE IF NOT EXISTS `postdetails` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdPost` int(11) NOT NULL,
  `Content_Full` text NOT NULL,
  `IdAccount` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IdPost` (`IdPost`),
  KEY `PostDetail_Account` (`IdAccount`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `postdetails`
--

INSERT INTO `postdetails` (`Id`, `IdPost`, `Content_Full`, `IdAccount`) VALUES
(3, 4, '<p>defghi</p>', 1),
(4, 5, '<p>Hello Kitty</p>', 1),
(6, 7, '<p><em><strong>Hello World</strong></em></p>', 5),
(7, 8, '<p>Hello Kitty</p>', 5),
(8, 9, '<p>Hello Kitty</p>', 5),
(9, 10, '<p>Hello Kitty</p>', 5),
(10, 11, 'Hello Kitty', 5),
(11, 12, '<p>Hello Kitty</p>', 5),
(12, 13, '<p>demo&nbsp;</p>', 5),
(13, 14, '<p>hello</p>', 5),
(14, 15, '<p><em><strong>hello</strong></em></p>', 5),
(15, 16, '<p>sadfsdf</p>', 5),
(16, 17, '<p>sadfsdf</p>', 5),
(17, 18, '<p>sadfsdf</p>', 5),
(18, 19, '<p>sadfsdf</p>', 5),
(19, 20, '', 5),
(20, 21, '<p>sadfsdfsdf</p>', 5),
(21, 22, '<p>&aacute;dfsdfsdaf</p>', 5),
(22, 23, '<p>sdfsdf</p>', 5),
(23, 24, '<p>&aacute;dfsadf</p>', 5),
(24, 25, '<p>sadfsdf</p>', 5),
(25, 26, '<p>sdf</p>', 5),
(26, 27, '<p>sdafsdf</p>', 5),
(27, 28, '<p>sadfsadf</p>', 5),
(28, 29, '<p>sdfasdf</p>', 5),
(29, 30, '<p>sadfsdfsdf</p>', 5),
(30, 31, '<p>fsadfsdf</p>', 5),
(31, 32, '<p>ấdfsdfsdaf</p>', 5),
(32, 33, '<p>&aacute;dfsdaghghfg</p>', 5),
(33, 34, '<p>Hello Kitty</p>', 5),
(34, 35, '<p><strong>Hello Kitty</strong></p>', 5),
(35, 36, '<p>456</p>', 5);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Content_Summary` text COLLATE utf8_unicode_ci NOT NULL,
  `Content_Full` text COLLATE utf8_unicode_ci NOT NULL,
  `DatePost` date NOT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Views` int(11) NOT NULL,
  `DatetimePost` datetime NOT NULL,
  `IdCategories` int(11) NOT NULL,
  `IdStatus` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `Posts_StatusPosts` (`IdStatus`),
  KEY `Posts_SubCategories` (`IdCategories`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`Id`, `Title`, `Content_Summary`, `Content_Full`, `DatePost`, `Avatar`, `Views`, `DatetimePost`, `IdCategories`, `IdStatus`, `IsDelete`) VALUES
(1, 'Demo', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-22', 'null', 0, '0000-00-00 00:00:00', 18, 4, 0),
(2, 'Demo', '<p>Change account</p>', '<p>Hello</p>', '2020-06-22', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(3, 'Demo', '<p>Change account</p>', '<p>Hello</p>', '2020-06-22', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(4, 'demo5', '<p>abc</p>', '<p>defghi</p>', '2020-06-22', 'null', 0, '0000-00-00 00:00:00', 21, 4, 0),
(5, 'Demo 6', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 14, 4, 0),
(6, 'Demo 7 ', '<p><span style=\"color: #e03e2d;\">Hello World</span></p>', '<ul>\r\n<li><strong>Hello Kitty</strong></li>\r\n</ul>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 19, 4, 0),
(7, 'Demo 7', '<p style=\"text-align: center;\"><strong><em>Hello Kitty</em></strong></p>', '<p><em><strong>Hello World</strong></em></p>', '2020-06-25', 'null', 0, '0000-00-00 00:00:00', 10, 4, 0),
(8, 'Demo8', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 8, 4, 0),
(9, 'Demo 9', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 10, 4, 0),
(10, 'demo 0', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 6, 4, 0),
(11, 'demo 10', 'Hello World', 'Hello Kitty', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 10, 4, 0),
(12, 'demo 10', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 10, 4, 0),
(13, 'Demo 11', '<p>demo&nbsp;</p>', '<p>demo&nbsp;</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(14, 'hello', '<p>hello</p>', '<p>hello</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 6, 4, 0),
(15, 'hello', '<p><strong>hello</strong></p>', '<p><em><strong>hello</strong></em></p>', '2020-06-24', 'null', 0, '0000-00-00 00:00:00', 2, 4, 0),
(16, 'Demo ty', '<p>g&aacute;df</p>', '<p>sadfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 15, 4, 0),
(17, 'Demo ty', '<p>g&aacute;df</p>', '<p>sadfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 15, 4, 0),
(18, 'Demo ty', '<p>g&aacute;df</p>', '<p>sadfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 15, 4, 0),
(19, 'Demo ty', '<p>g&aacute;df</p>', '<p>sadfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 15, 4, 0),
(20, 'sadfasdf', '', '', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(21, 'sadfasdf', '<p>sadfsdf</p>', '<p>sadfsdfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(22, 'sadfsdf', '<p>sfsdfsdf</p>', '<p>&aacute;dfsdfsdaf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 10, 4, 0),
(23, 'sadfsdf', '<p>sadfsdf</p>', '<p>sdfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(24, 'ádfsdf', '<p>sdfs</p>', '<p>&aacute;dfsadf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 11, 4, 0),
(25, 'ádfsdf', '<p>sdfsdf</p>', '<p>sadfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 2, 2, 0),
(26, 'sadfsdf', '<p>sdf</p>', '<p>sdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 1, 4, 0),
(27, 'sdfsdf', '<p>&aacute;dfsadfadsf</p>', '<p>sdafsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 9, 4, 0),
(28, 'ádfasdf', '<p>sadfsdaf</p>', '<p>sadfsadf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 1, 4, 0),
(29, 'ádfsdf', '<p>sadfasdf</p>', '<p>sdfasdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 4, 4, 0),
(30, 'sadfasdf', '<p>sdfsdafsdf</p>', '<p>sadfsdfsdf</p>', '2020-06-23', 'null', 0, '0000-00-00 00:00:00', 11, 4, 0),
(31, 'demo 19', '<p>&aacute;dfasdf</p>', '<p>fsadfsdf</p>', '2020-06-24', 'null', 0, '0000-00-00 00:00:00', 6, 4, 0),
(32, 'Demo 10', '<p>&agrave;dsfsd</p>', '<p>ấdfsdfsdaf</p>', '2020-06-24', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(33, 'Demo 100', '<p>&agrave;dssdfsadfsdffsd</p>', '<p>&aacute;dfsdaghghfg</p>', '2020-06-24', 'null', 0, '0000-00-00 00:00:00', 12, 4, 0),
(34, 'Demo500', '<p>Hello World</p>', '<p>Hello Kitty</p>', '2020-06-25', 'null', 0, '0000-00-00 00:00:00', 11, 4, 0),
(35, 'Demo501', '<p>Hello World</p>', '<p><strong>Hello Kitty</strong></p>', '2020-06-25', 'null', 0, '0000-00-00 00:00:00', 11, 4, 0),
(36, '<p>Demo 700</p>', '<p>123</p>', '<p>456</p>', '2020-06-26', 'null', 0, '0000-00-00 00:00:00', 7, 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `status_posts`
--

CREATE TABLE IF NOT EXISTS `status_posts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `status_posts`
--

INSERT INTO `status_posts` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Đã được duyệt & chờ xuất bản', 0),
(2, 'Đã xuất bản', 0),
(3, 'Bị từ chối', 0),
(4, 'Chưa được duyệt', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Web', 0),
(2, 'App', 0),
(3, 'Python', 0),
(4, 'Ruby', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tag_posts`
--

CREATE TABLE IF NOT EXISTS `tag_posts` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `IdTag` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  PRIMARY KEY (`Id`,`IdTag`,`IdPost`),
  KEY `TagPosts_Posts` (`IdPost`),
  KEY `TagPosts_Tags` (`IdTag`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tag_posts`
--

INSERT INTO `tag_posts` (`Id`, `IdTag`, `IdPost`) VALUES
(1, 1, 4),
(2, 2, 4),
(3, 3, 4),
(4, 4, 4),
(5, 1, 5),
(6, 2, 5),
(10, 1, 8),
(11, 2, 8),
(12, 3, 8),
(13, 1, 9),
(14, 2, 9),
(15, 4, 9),
(16, 3, 9),
(17, 1, 10),
(18, 2, 10),
(19, 3, 10),
(20, 4, 10),
(21, 1, 13),
(22, 1, 14),
(23, 2, 14),
(24, 3, 14),
(25, 4, 14),
(30, 1, 16),
(31, 3, 16),
(32, 1, 17),
(33, 3, 17),
(34, 1, 18),
(35, 3, 18),
(36, 1, 19),
(37, 3, 19),
(38, 1, 20),
(39, 2, 20),
(40, 3, 20),
(41, 1, 21),
(42, 2, 21),
(43, 3, 21),
(44, 1, 22),
(45, 2, 22),
(46, 1, 23),
(47, 2, 23),
(48, 1, 24),
(49, 2, 24),
(50, 3, 24),
(51, 4, 24),
(52, 1, 25),
(53, 1, 26),
(54, 1, 27),
(55, 1, 28),
(56, 1, 29),
(57, 1, 30),
(58, 1, 31),
(59, 1, 32),
(60, 1, 33),
(61, 2, 33),
(62, 3, 33),
(70, 1, 15),
(86, 1, 7),
(87, 1, 34),
(88, 2, 34),
(89, 1, 35),
(90, 1, 36);

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE IF NOT EXISTS `token` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Token` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `Expiration` datetime NOT NULL,
  `Used` int(11) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`Id`, `Email`, `Token`, `Expiration`, `Used`) VALUES
(6, 'anhkhuong1306@gmail.com', 'fa97797f80b19227', '2020-06-28 21:33:10', 0);

-- --------------------------------------------------------

--
-- Table structure for table `typeaccount`
--

CREATE TABLE IF NOT EXISTS `typeaccount` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `typeaccount`
--

INSERT INTO `typeaccount` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Subscriber', 0),
(2, 'Writer', 0),
(3, 'Editor', 0),
(4, 'Administrator', 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `Accounts_TypeAccount` FOREIGN KEY (`TypeAccount`) REFERENCES `typeaccount` (`Id`);

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `Comment_Informations` FOREIGN KEY (`IdReader`) REFERENCES `information` (`Id`),
  ADD CONSTRAINT `Comment_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`);

--
-- Constraints for table `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD CONSTRAINT `EditorAccount_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`),
  ADD CONSTRAINT `EditorAccount_Categories` FOREIGN KEY (`IdCategoríe`) REFERENCES `categories` (`Id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `Feedback_EditorAccount` FOREIGN KEY (`IdEditorAccount`) REFERENCES `editoraccount` (`Id`),
  ADD CONSTRAINT `Feedback_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`);

--
-- Constraints for table `information`
--
ALTER TABLE `information`
  ADD CONSTRAINT `Information_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`);

--
-- Constraints for table `postdetails`
--
ALTER TABLE `postdetails`
  ADD CONSTRAINT `PostDetail_Account` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`);

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `Posts_StatusPosts` FOREIGN KEY (`IdStatus`) REFERENCES `status_posts` (`Id`),
  ADD CONSTRAINT `Posts_SubCategories` FOREIGN KEY (`IdCategories`) REFERENCES `categories_sub` (`Id`);

--
-- Constraints for table `tag_posts`
--
ALTER TABLE `tag_posts`
  ADD CONSTRAINT `TagPosts_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`),
  ADD CONSTRAINT `TagPosts_Tags` FOREIGN KEY (`IdTag`) REFERENCES `tags` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
