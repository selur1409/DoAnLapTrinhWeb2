-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2020 at 04:31 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

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

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
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
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`Id`, `Username`, `Password_hash`, `DateRegister`, `DateExpired`, `TypeAccount`, `IsDelete`) VALUES
(1, 'admin00', '$2a$08$ifiEiz8/4B6wSn/5PiyGMe7tSNJoL1wfCPyCkj6yyFCWlvxTd0eae', '2020-06-22 19:27:39', '2020-06-29 19:27:39', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` int(11) NOT NULL
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

CREATE TABLE `categories_sub` (
  `Id` int(11) NOT NULL,
  `IdCategoriesMain` int(11) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
-- Table structure for table `editoraccount`
--

CREATE TABLE `editoraccount` (
  `Id` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdCategoríe` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
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
-- Table structure for table `information`
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
-- Dumping data for table `information`
--

INSERT INTO `information` (`Id`, `Name`, `Nickname`, `Avatar`, `DOB`, `Email`, `Phone`, `IdAccount`, `Sex`) VALUES
(1, 'admin', NULL, NULL, '2020-05-01', 'admin00@gmail.com', '0123456789', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `postdetails`
--

CREATE TABLE `postdetails` (
  `Id` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `Content_Full` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `Title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
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

-- --------------------------------------------------------

--
-- Table structure for table `status_posts`
--

CREATE TABLE `status_posts` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `tags` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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

CREATE TABLE `tag_posts` (
  `Id` int(11) NOT NULL,
  `IdTag` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `typeaccount`
--

CREATE TABLE `typeaccount` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `typeaccount`
--

INSERT INTO `typeaccount` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'User', 0),
(2, 'Admin', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Accounts_TypeAccount` (`TypeAccount`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `categories_sub`
--
ALTER TABLE `categories_sub`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdCategoriesMain` (`IdCategoriesMain`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Comment_Informations` (`IdReader`),
  ADD KEY `Comment_Posts` (`IdPost`);

--
-- Indexes for table `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD PRIMARY KEY (`Id`,`IdAccount`,`IdCategoríe`) USING BTREE,
  ADD KEY `EditorAccount_Accounts` (`IdAccount`),
  ADD KEY `EditorAccount_Categories` (`IdCategoríe`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Feedback_EditorAccount` (`IdEditorAccount`),
  ADD KEY `Feedback_Posts` (`IdPost`);

--
-- Indexes for table `information`
--
ALTER TABLE `information`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Information_Accounts` (`IdAccount`);

--
-- Indexes for table `postdetails`
--
ALTER TABLE `postdetails`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IdPost` (`IdPost`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Posts_StatusPosts` (`IdStatus`),
  ADD KEY `Posts_SubCategories` (`IdCategories`);

--
-- Indexes for table `status_posts`
--
ALTER TABLE `status_posts`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `tag_posts`
--
ALTER TABLE `tag_posts`
  ADD PRIMARY KEY (`Id`,`IdTag`,`IdPost`),
  ADD KEY `TagPosts_Posts` (`IdPost`),
  ADD KEY `TagPosts_Tags` (`IdTag`);

--
-- Indexes for table `typeaccount`
--
ALTER TABLE `typeaccount`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories_sub`
--
ALTER TABLE `categories_sub`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `editoraccount`
--
ALTER TABLE `editoraccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `information`
--
ALTER TABLE `information`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `postdetails`
--
ALTER TABLE `postdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_posts`
--
ALTER TABLE `status_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tag_posts`
--
ALTER TABLE `tag_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typeaccount`
--
ALTER TABLE `typeaccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
