-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 19, 2020 lúc 08:53 AM
-- Phiên bản máy phục vụ: 10.4.8-MariaDB
-- Phiên bản PHP: 7.3.10

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
  `Password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `DateRegister` datetime NOT NULL,
  `DateExpired` datetime NOT NULL,
  `TypeAccount` int(4) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Ngôn Ngữ Lập Trình', 0),
(2, 'Web Fontend', 0),
(3, 'Web Backend', 0),
(4, 'Mobile Web', 0),
(5, 'Database', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories_sub`
--

CREATE TABLE `categories_sub` (
  `Id` int(11) NOT NULL,
  `IdCategoriesMain` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Đang đổ dữ liệu cho bảng `categories_sub`
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
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `Id` int(11) NOT NULL,
  `Content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `DatetimeComment` datetime NOT NULL,
  `IdReader` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `editoraccount`
--

CREATE TABLE `editoraccount` (
  `Id` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdCategoríe` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  `Date` date NOT NULL,
  `Email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Phone` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IdAccount` int(11) NOT NULL,
  `Sex` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `postdetails`
--

CREATE TABLE `postdetails` (
  `Id` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `Content_Full` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `Title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `Content_Summary` text COLLATE utf8_unicode_ci NOT NULL,
  `DatePost` date NOT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Views` int(11) NOT NULL,
  `DatetimePost` datetime NOT NULL,
  `IdCategoriesSub` int(11) NOT NULL,
  `IdStatus` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tag_posts`
--

CREATE TABLE `tag_posts` (
  `Id` int(11) NOT NULL,
  `IdTag` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  ADD KEY `Comment_Informations` (`IdReader`),
  ADD KEY `Comment_Posts` (`IdPost`);

--
-- Chỉ mục cho bảng `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD PRIMARY KEY (`Id`) USING BTREE,
  ADD KEY `EditorAccount_Accounts` (`IdAccount`);

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
  ADD KEY `IdPost` (`IdPost`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Posts_StatusPosts` (`IdStatus`);

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `editoraccount`
--
ALTER TABLE `editoraccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `information`
--
ALTER TABLE `information`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `postdetails`
--
ALTER TABLE `postdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `status_posts`
--
ALTER TABLE `status_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `tags`
--
ALTER TABLE `tags`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tag_posts`
--
ALTER TABLE `tag_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `typeaccount`
--
ALTER TABLE `typeaccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `Accounts_TypeAccount` FOREIGN KEY (`TypeAccount`) REFERENCES `typeaccount` (`Id`);

--
-- Các ràng buộc cho bảng `categories_sub`
--
ALTER TABLE `categories_sub`
  ADD CONSTRAINT `categories_sub_ibfk_1` FOREIGN KEY (`IdCategoriesMain`) REFERENCES `categories` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
