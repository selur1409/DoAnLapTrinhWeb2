-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 18, 2020 lúc 04:24 PM
-- Phiên bản máy phục vụ: 10.4.8-MariaDB
-- Phiên bản PHP: 7.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `news`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `accounts`
--

CREATE TABLE `accounts` (
  `Id` int(11) NOT NULL,
  `Username` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Password_hash` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DateRegister` datetime NOT NULL,
  `DateExpired` datetime NOT NULL,
  `TypeAccount` int(4) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `accounts`
--

INSERT INTO `accounts` (`Id`, `Username`, `Password_hash`, `DateRegister`, `DateExpired`, `TypeAccount`, `IsDelete`) VALUES
(1, 'writer1', '$2a$08$GkmYMgW5ix6jXx4OLKK6MOEpcGFq9yVjHIaT113wGxl3PybFowvj.', '2020-06-22 00:00:00', '2020-06-22 00:00:00', 2, 0),
(5, 'admin123', '$2a$08$GkmYMgW5ix6jXx4OLKK6MOEpcGFq9yVjHIaT113wGxl3PybFowvj.', '2020-06-23 20:14:59', '2020-06-30 20:14:59', 4, 0),
(6, 'editor01', '$2a$08$Gd4Sp2TYsSi1XDavQ5Y9WOnUmTApbSGmqKA/VJAbSR8puGLzk2uJ2', '2020-07-10 10:37:14', '2020-07-17 10:37:14', 3, 0),
(7, 'editor02', '$2a$08$G0lPrHTTA1zRbfnCOQvG8OH2gr5NleYsOcMrtbqqkLP.JYuQUW1AC', '2020-07-10 10:44:40', '2020-07-17 10:44:40', 3, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `IsDelete` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`Id`, `Name`, `Url`, `Description`, `IsDelete`) VALUES
(1, 'Ngôn Ngữ Lập Trình', 'ngon-ngu-lap-trinh', NULL, 0),
(2, 'Web Fontend', 'web-font-end', NULL, 0),
(3, 'Web Backend', 'web-back-end', NULL, 0),
(4, 'Mobile Web', 'mobile-web', NULL, 0),
(5, 'Database', 'database', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories_sub`
--

CREATE TABLE `categories_sub` (
  `Id` int(11) NOT NULL,
  `IdCategoriesMain` int(11) NOT NULL,
  `Name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories_sub`
--

INSERT INTO `categories_sub` (`Id`, `IdCategoriesMain`, `Name`, `Url`, `Description`, `IsDelete`) VALUES
(1, 1, 'C++', 'c-plus-plus', NULL, 0),
(2, 1, 'Java', 'java', NULL, 0),
(3, 1, 'C#', 'c-sharp', NULL, 0),
(4, 1, 'C', 'c-language', NULL, 0),
(5, 1, 'Ruby', 'ruby', NULL, 0),
(6, 1, 'Golang', 'go-lang', NULL, 0),
(7, 2, 'Javascript', 'javascript', NULL, 0),
(8, 2, 'AngularJS', 'angular-js', NULL, 0),
(9, 2, 'jQuery', 'jquery', NULL, 0),
(10, 2, 'HTML & CSS', 'html-css', NULL, 0),
(11, 3, 'PHP', 'php', NULL, 0),
(12, 3, 'Laravel', 'laravel', NULL, 0),
(13, 3, 'Học WordPress', 'hoc-wordpress', NULL, 0),
(14, 3, 'NodeJS', 'node-js', NULL, 0),
(15, 4, 'React Native', 'react-native', NULL, 0),
(16, 4, 'IOS', 'ios', NULL, 0),
(17, 4, 'Android', 'android', NULL, 0),
(18, 5, 'MySQL', 'my-sql', NULL, 0),
(19, 5, 'SQL Server', 'sql-server', NULL, 0),
(20, 5, 'Oracle', 'oracle', NULL, 0),
(21, 5, 'MongoDB', 'mongo-db', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `Id` int(11) NOT NULL,
  `Content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `DatetimeComment` datetime NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `comments`
--

INSERT INTO `comments` (`Id`, `Content`, `DatetimeComment`, `IdAccount`, `IdPost`, `IsDelete`) VALUES
(1, 'Hello! This is a generator for text fonts of the \"cool\" variety. I noticed people were trying to find a generator like fancy letters', '2020-07-15 00:00:00', 1, 7, 0),
(2, 'If you\'re wondering how one produces cool text fonts like you see above, it\'s fairly simple (but maybe not what you\'d expect)', '2020-07-23 00:00:00', 1, 7, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `editoraccount`
--

CREATE TABLE `editoraccount` (
  `Id` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdCategories` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `editoraccount`
--

INSERT INTO `editoraccount` (`Id`, `IdAccount`, `IdCategories`, `IsDelete`) VALUES
(1, 6, 5, 0),
(2, 6, 1, 0),
(3, 6, 3, 0),
(4, 7, 4, 0),
(5, 7, 2, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback`
--

CREATE TABLE `feedback` (
  `Id` int(11) NOT NULL,
  `Note` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `Status` tinyint(1) NOT NULL,
  `DatetimeApproval` datetime NOT NULL,
  `IdEditorAccount` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `information`
--

CREATE TABLE `information` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Nickname` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `DOB` date NOT NULL,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Phone` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IdAccount` int(11) NOT NULL,
  `Sex` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `information`
--

INSERT INTO `information` (`Id`, `Name`, `Nickname`, `Avatar`, `DOB`, `Email`, `Phone`, `IdAccount`, `Sex`) VALUES
(1, 'Admin', 'Super Man', 'avatar2.png\r\n', '2020-06-23', 'Admin123@gmail.com', '0987654321', 5, 0),
(2, 'Editor 01', 'Spider Man', 'avatar.png\r\n\r\n', '2010-05-07', 'editor01@gmail.com', '01938333333', 6, 0),
(3, 'Writer 01', 'Batmen', 'comment_author_2.jpg', '2000-03-10', 'anhkhuong001@gmail.com', '01321319749', 1, 0),
(4, 'Nguyễn Thái Học', 'Women men', 'avatar4.png', '1999-02-10', 'nguyenhoc@gmail.com', '01212121212', 7, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `postdetails`
--

CREATE TABLE `postdetails` (
  `Id` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `postdetails`
--

INSERT INTO `postdetails` (`Id`, `IdPost`, `IdAccount`) VALUES
(3, 4, 1),
(4, 5, 1),
(6, 7, 5),
(7, 8, 5),
(8, 9, 5),
(9, 10, 5),
(10, 11, 5),
(11, 12, 5),
(12, 13, 5),
(13, 14, 5),
(14, 15, 5),
(15, 16, 5),
(16, 17, 5),
(17, 18, 5),
(18, 19, 5),
(19, 20, 5),
(20, 21, 5),
(21, 22, 5),
(22, 23, 5),
(23, 24, 5),
(24, 25, 5),
(25, 26, 5),
(26, 27, 5),
(27, 28, 5),
(28, 29, 5),
(29, 30, 5),
(30, 31, 5),
(31, 32, 5),
(32, 33, 5),
(33, 34, 5),
(34, 35, 5),
(35, 36, 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `Title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Content_Summary` text COLLATE utf8_unicode_ci NOT NULL,
  `Content_Full` text COLLATE utf8_unicode_ci NOT NULL,
  `DatePost` date NOT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Views` int(11) NOT NULL,
  `DatetimePost` datetime NOT NULL,
  `IdCategories` int(11) NOT NULL,
  `IdStatus` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`Id`, `Title`, `Url`, `Content_Summary`, `Content_Full`, `DatePost`, `Avatar`, `Views`, `DatetimePost`, `IdCategories`, `IdStatus`, `IsDelete`) VALUES
(1, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-1', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-22', 'post_15.jpg', 0, '2020-07-18 00:00:00', 10, 4, 0),
(2, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-2', 'This is content summary', '<p>Hello</p>', '2020-06-22', 'post_15.jpg', 0, '2020-05-14 00:00:00', 10, 4, 0),
(3, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-3', 'This is content summary', '<p>Hello</p>', '2020-06-22', 'post_15.jpg', 0, '2020-06-18 00:00:00', 10, 4, 0),
(4, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-4', 'This is content summary', '<p>defghi</p>', '2020-06-22', 'post_15.jpg', 0, '2020-07-08 00:00:00', 10, 4, 0),
(5, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-5', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-14 00:00:00', 10, 4, 0),
(6, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-6', 'This is content summary', '<ul>\r\n<li><strong>Hello Kitty</strong></li>\r\n</ul>', '2020-06-23', 'post_15.jpg', 0, '2020-07-26 00:00:00', 10, 4, 0),
(7, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-7', 'This is content summary', '<p><em><strong>Hello World</strong></em></p>', '2020-06-25', 'post_15.jpg', 0, '1899-07-11 00:00:00', 10, 4, 0),
(8, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-8', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-23', 'post_15.jpg', 0, '2020-05-15 00:00:00', 10, 4, 0),
(9, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-9', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-23', 'post_15.jpg', 0, '2020-04-21 00:00:00', 10, 4, 0),
(10, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-10', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-14 00:00:00', 10, 4, 0),
(11, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-11', 'This is content summary', 'Hello Kitty', '2020-06-23', 'post_15.jpg', 0, '2020-05-11 00:00:00', 10, 4, 0),
(12, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-12', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-23', 'post_15.jpg', 0, '2020-04-13 00:00:00', 10, 4, 0),
(13, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-13', 'This is content summary', '<p>demo&nbsp;</p>', '2020-06-23', 'post_15.jpg', 0, '2020-09-04 00:00:00', 10, 4, 0),
(14, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-14', 'This is content summary', '<p>hello</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-09 00:00:00', 6, 4, 0),
(15, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-15', 'This is content summary', '<p><em><strong>hello</strong></em></p>', '2020-06-24', 'post_15.jpg', 0, '2020-06-16 00:00:00', 10, 4, 0),
(16, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-16', 'This is content summary', '<p>sadfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-14 00:00:00', 15, 4, 0),
(17, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-17', 'This is content summary', '<p>sadfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-22 00:00:00', 15, 4, 0),
(18, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-18', 'This is content summary', '<p>sadfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-20 00:00:00', 15, 4, 0),
(19, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-19', 'This is content summary', '<p>sadfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-28 00:00:00', 15, 4, 0),
(20, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-20', 'This is content summary', '', '2020-06-23', 'post_15.jpg', 0, '2020-06-10 00:00:00', 12, 4, 0),
(21, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-21', 'This is content summary', '<p>sadfsdfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-08-07 00:00:00', 12, 4, 0),
(22, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-22', 'This is content summary', '<p>&aacute;dfsdfsdaf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-04-20 00:00:00', 10, 4, 0),
(23, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-23', 'This is content summary', '<p>sdfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-07 00:00:00', 12, 4, 0),
(24, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-24', 'This is content summary', '<p>&aacute;dfsadf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-05-11 00:00:00', 11, 4, 0),
(25, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-25', 'This is content summary', '<p>sadfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-30 00:00:00', 2, 2, 0),
(26, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-26', 'This is content summary', '<p>sdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-14 00:00:00', 1, 4, 0),
(27, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-27', 'This is content summary', '<p>sdafsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-09 00:00:00', 9, 4, 0),
(28, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-28', 'This is content summary', '<p>sadfsadf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-22 00:00:00', 1, 4, 0),
(29, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-29', 'This is content summary', '<p>sdfasdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-06-09 00:00:00', 4, 4, 0),
(30, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-30', 'This is content summary', '<p>sadfsdfsdf</p>', '2020-06-23', 'post_15.jpg', 0, '2020-07-14 00:00:00', 11, 4, 0),
(31, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-31', 'This is content summary', '<p>fsadfsdf</p>', '2020-06-24', 'post_15.jpg', 0, '2020-07-01 00:00:00', 6, 4, 0),
(32, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-32', 'This is content summary', '<p>ấdfsdfsdaf</p>', '2020-06-24', 'post_15.jpg', 0, '2020-07-20 00:00:00', 12, 4, 0),
(33, 'Demo 100', 'thuy-dien-mat-nuoc-33', 'This is content summary', '<p>&aacute;dfsdaghghfg</p>', '2020-06-24', 'post_15.jpg', 0, '2020-07-05 00:00:00', 12, 4, 0),
(34, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-34', 'This is content summary', '<p>Hello Kitty</p>', '2020-06-25', 'post_15.jpg', 0, '1899-11-08 00:00:00', 11, 4, 0),
(35, 'Demo501', 'thuy-dien-mat-nuoc-35', 'This is content summary', '<p><strong>Hello Kitty</strong></p>', '2020-06-25', 'post_15.jpg', 0, '2020-06-04 00:00:00', 11, 4, 0),
(36, 'Thủy điện mất nước', 'thuy-dien-mat-nuoc-36', 'This is content summary', '<p>456</p>', '2020-06-26', 'post_15.jpg', 0, '2020-08-06 00:00:00', 7, 4, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `status_posts`
--

CREATE TABLE `status_posts` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `status_posts`
--

INSERT INTO `status_posts` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Đã được duyệt & chờ xuất bản', 0),
(2, 'Đã xuất bản', 0),
(3, 'Bị từ chối', 0),
(4, 'Chưa được duyệt', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tags`
--

CREATE TABLE `tags` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `TagName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ImgURL` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tags`
--

INSERT INTO `tags` (`Id`, `Name`, `TagName`, `ImgURL`, `IsDelete`) VALUES
(1, 'Web', '#web', 'tagweb.jpg', 0),
(2, 'App', '#app', 'tagapp.jpg', 0),
(3, 'Python', '#python', 'tagpython.jpg', 0),
(4, 'Ruby', '#ruby', 'tagruby.jpg', 0),
(5, 'C/C++', '#c/c++', 'tagc.jpg', 0),
(6, 'Lập trình game', '#laptrinhgame', 'taggame.jpg', 0),
(7, 'Lập trình online', '#laptrinhonline', 'tagonline.jpg', 0),
(8, 'Công nghệ', '#congnghe', 'tagtechnology.jpg', 0),
(9, 'Khoa học', '#khoahoc', 'tagscience.jpg', 0),
(10, 'Cấu trúc dữ liệu và giải thuật', '#ctdl&gt', 'tagctdl.jpg', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tag_posts`
--

CREATE TABLE `tag_posts` (
  `Id` int(11) NOT NULL,
  `IdTag` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tag_posts`
--

INSERT INTO `tag_posts` (`Id`, `IdTag`, `IdPost`) VALUES
(1, 1, 4),
(2, 2, 4),
(3, 3, 4),
(4, 4, 7),
(5, 1, 5),
(6, 2, 5),
(10, 1, 7),
(11, 2, 8),
(12, 3, 8),
(13, 1, 9),
(14, 2, 9),
(15, 4, 9),
(16, 3, 9),
(17, 1, 7),
(18, 2, 10),
(19, 3, 10),
(20, 4, 10),
(21, 1, 13),
(22, 1, 7),
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
-- Cấu trúc bảng cho bảng `typeaccount`
--

CREATE TABLE `typeaccount` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `typeaccount`
--

INSERT INTO `typeaccount` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Subscriber', 0),
(2, 'Writer', 0),
(3, 'Editor', 0),
(4, 'Administrator', 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Accounts_TypeAccount` (`TypeAccount`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `categories_sub`
--
ALTER TABLE `categories_sub`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdCategoriesMain` (`IdCategoriesMain`);

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Comment_Informations` (`IdAccount`),
  ADD KEY `Comment_Posts` (`IdPost`);

--
-- Chỉ mục cho bảng `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD PRIMARY KEY (`Id`,`IdAccount`,`IdCategories`) USING BTREE,
  ADD KEY `EditorAccount_Accounts` (`IdAccount`),
  ADD KEY `EditorAccount_Categories` (`IdCategories`);

--
-- Chỉ mục cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Feedback_EditorAccount` (`IdEditorAccount`),
  ADD KEY `Feedback_Posts` (`IdPost`);

--
-- Chỉ mục cho bảng `information`
--
ALTER TABLE `information`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Information_Accounts` (`IdAccount`);

--
-- Chỉ mục cho bảng `postdetails`
--
ALTER TABLE `postdetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdPost` (`IdPost`),
  ADD KEY `PostDetail_Account` (`IdAccount`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Url` (`Url`),
  ADD KEY `Posts_StatusPosts` (`IdStatus`),
  ADD KEY `Posts_SubCategories` (`IdCategories`);

--
-- Chỉ mục cho bảng `status_posts`
--
ALTER TABLE `status_posts`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`Id`);

--
-- Chỉ mục cho bảng `tag_posts`
--
ALTER TABLE `tag_posts`
  ADD PRIMARY KEY (`Id`,`IdTag`,`IdPost`),
  ADD KEY `TagPosts_Posts` (`IdPost`),
  ADD KEY `TagPosts_Tags` (`IdTag`);

--
-- Chỉ mục cho bảng `typeaccount`
--
ALTER TABLE `typeaccount`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `accounts`
--
ALTER TABLE `accounts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `categories_sub`
--
ALTER TABLE `categories_sub`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `editoraccount`
--
ALTER TABLE `editoraccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `information`
--
ALTER TABLE `information`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `postdetails`
--
ALTER TABLE `postdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `status_posts`
--
ALTER TABLE `status_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `tag_posts`
--
ALTER TABLE `tag_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT cho bảng `typeaccount`
--
ALTER TABLE `typeaccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `Accounts_TypeAccount` FOREIGN KEY (`TypeAccount`) REFERENCES `typeaccount` (`Id`);

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `Comment_Informations` FOREIGN KEY (`IdAccount`) REFERENCES `information` (`Id`),
  ADD CONSTRAINT `Comment_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`);

--
-- Các ràng buộc cho bảng `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD CONSTRAINT `EditorAccount_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`),
  ADD CONSTRAINT `EditorAccount_Categories` FOREIGN KEY (`IdCategories`) REFERENCES `categories` (`Id`);

--
-- Các ràng buộc cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `Feedback_EditorAccount` FOREIGN KEY (`IdEditorAccount`) REFERENCES `editoraccount` (`Id`),
  ADD CONSTRAINT `Feedback_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`);

--
-- Các ràng buộc cho bảng `information`
--
ALTER TABLE `information`
  ADD CONSTRAINT `Information_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`);

--
-- Các ràng buộc cho bảng `postdetails`
--
ALTER TABLE `postdetails`
  ADD CONSTRAINT `PostDetail_Account` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`);

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `Posts_StatusPosts` FOREIGN KEY (`IdStatus`) REFERENCES `status_posts` (`Id`),
  ADD CONSTRAINT `Posts_SubCategories` FOREIGN KEY (`IdCategories`) REFERENCES `categories_sub` (`Id`);

--
-- Các ràng buộc cho bảng `tag_posts`
--
ALTER TABLE `tag_posts`
  ADD CONSTRAINT `TagPosts_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`),
  ADD CONSTRAINT `TagPosts_Tags` FOREIGN KEY (`IdTag`) REFERENCES `tags` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
