-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 04, 2020 at 04:22 PM
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
  `DateExpired` datetime DEFAULT NULL,
  `TypeAccount` int(4) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`Id`, `Username`, `Password_hash`, `DateRegister`, `DateExpired`, `TypeAccount`, `IsDelete`) VALUES
(1, 'admin123', '$2a$08$GkmYMgW5ix6jXx4OLKK6MOEpcGFq9yVjHIaT113wGxl3PybFowvj.', '2020-06-23 20:14:59', '2112-12-21 21:12:21', 4, 0),
(2, 'writer001', '$2a$08$..NebGDcFO5Yss31a4StEuABDOJQ0nW5jQseD2knkVm2vOTETNx3W', '2020-08-04 00:00:00', NULL, 2, 0),
(3, 'writer002', '$2a$08$po2EIajcBbv9u.UsQ7cIZeeyTz0Dy97A4IodroF/7Wx.SQB0952.q', '2020-08-04 00:00:00', NULL, 2, 0),
(4, 'editor001', '$2a$08$bYsgif9NR6xNrrOW9MbW1eSLoy3mdK/kYgZeEVh0Wl0K/UhcphFim', '2020-08-04 00:00:00', NULL, 3, 0),
(5, 'vinhquoc001', '$2a$08$srczdbbVmr8gWWiyfpnTJuKviE6eAgofuxcRomMHuu4VqKxG0GB8K', '2020-08-04 00:00:00', '2020-08-11 15:45:00', 1, 0),
(6, 'baoquoc001', '$2a$08$fwFU74pxV1Da/P5M2JzYUexOrdfDYAOXXZXiLXh05DS2NcuioEJda', '2020-08-04 00:00:00', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`Id`, `Name`, `Url`, `Description`, `IsDelete`) VALUES
(1, 'Web Fontend', 'webfontend', 'Dùng cho các bài viết về thiết kế giao diện trên website', 0),
(2, 'Web Backend', 'webbackend', 'Cho Editor Nguyễn Thái Học quản lý chuyên mục web-backend quản lý các bài viết quản lý db hay các xử lý khác', 0),
(3, 'Database', 'database', '', 0),
(4, 'Mobile Dev', 'devmobile', '', 0),
(5, 'db', 'db', '', 1),
(6, 'Programming', 'programming', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `categories_sub`
--

CREATE TABLE `categories_sub` (
  `Id` int(11) NOT NULL,
  `IdCategoriesMain` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Url` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Description` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `categories_sub`
--

INSERT INTO `categories_sub` (`Id`, `IdCategoriesMain`, `Name`, `Url`, `Description`, `IsDelete`) VALUES
(1, 3, 'CSDL căn bản', 'dbbasic', '', 1),
(2, 3, 'Học MySQL', 'mysql', '', 0),
(3, 3, 'SQL Sever', 'sqlsever', '', 0),
(4, 3, 'Oracle', 'oracle', '', 1),
(5, 3, 'MongoDB', 'mongo', '', 0),
(6, 4, 'React Native', 'reactnative', 'React native', 0),
(7, 4, 'IOS', 'ios', 'IOS', 0),
(8, 4, 'Android', 'android', 'android phổ biên hiện nay', 0),
(9, 6, 'C++', 'c-plus-plus', 'C++', 0),
(10, 6, 'python', 'python', 'python', 0),
(11, 6, 'java', 'java', 'java\r\n', 0),
(12, 6, 'C#', 'c-shape', 'c#', 0),
(13, 6, 'golang', 'golang', 'Golang', 0),
(14, 2, 'PHP', 'php', 'PHP\r\n', 0),
(15, 2, 'Nodejs', 'node-js', 'Nodejs', 0),
(16, 2, 'Laravel', 'laravel', '', 0),
(17, 1, 'Javascirpt', 'js', '', 0),
(18, 1, 'jQuery', 'jquery', '', 0),
(19, 1, 'Bootstrap 4', 'bootstrap-4', '', 0),
(20, 6, 'Lập trình web', 'lap-trinh-web', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `Id` int(11) NOT NULL,
  `Content` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `DatetimeComment` datetime NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsCheck` tinyint(1) NOT NULL DEFAULT 0,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `editoraccount`
--

CREATE TABLE `editoraccount` (
  `Id` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IdCategories` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `editoraccount`
--

INSERT INTO `editoraccount` (`Id`, `IdAccount`, `IdCategories`, `IsDelete`) VALUES
(1, 4, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `Id` int(11) NOT NULL,
  `Note` text COLLATE utf8_unicode_ci DEFAULT NULL,
  `DatetimeApproval` datetime NOT NULL,
  `IdEditorAccount` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
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
  `Email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Phone` varchar(11) COLLATE utf8_unicode_ci DEFAULT NULL,
  `IdAccount` int(11) NOT NULL,
  `Sex` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `information`
--

INSERT INTO `information` (`Id`, `Name`, `Nickname`, `Avatar`, `DOB`, `Email`, `Phone`, `IdAccount`, `Sex`) VALUES
(1, 'Administration', 'Super Man', 'avatar2.png\r\n', '2020-06-23', 'Admin123@gmail.com', '0987654321', 1, 0),
(2, 'Lương Thế Vinh', 'Vinh Chém Gió', NULL, '2020-08-01', NULL, NULL, 2, 0),
(3, 'Nguyễn Anh Khương', 'Khương Viết Lách', NULL, '2020-01-03', NULL, NULL, 3, 0),
(4, 'Nguyễn Thái Học', NULL, NULL, '2020-03-06', NULL, NULL, 4, 0),
(5, 'Nguyễn Quốc Vinh', NULL, NULL, '2020-04-02', NULL, NULL, 5, 0),
(6, 'Huỳnh Quốc Bảo', NULL, NULL, '1999-01-01', NULL, NULL, 6, 0);

-- --------------------------------------------------------

--
-- Table structure for table `postdetails`
--

CREATE TABLE `postdetails` (
  `Id` int(11) NOT NULL,
  `IdPost` int(11) NOT NULL,
  `IdAccount` int(11) NOT NULL,
  `IsPremium` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `Id` int(11) NOT NULL,
  `Title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `Url` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Content_Summary` text CHARACTER SET utf8 NOT NULL,
  `Content_Full` text CHARACTER SET utf8 NOT NULL,
  `DatePost` date NOT NULL,
  `Avatar` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `Views` int(11) NOT NULL,
  `DatetimePost` datetime NOT NULL,
  `IdCategories` int(11) NOT NULL,
  `IdStatus` int(11) NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status_posts`
--

CREATE TABLE `status_posts` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
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
  `TagName` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `ImgURL` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`Id`, `Name`, `TagName`, `ImgURL`, `IsDelete`) VALUES
(1, 'Lập trình web cơ bản', 'laptrinhwebcoban', 'lap-trinh-web-co-ban-1596533110451.jpg', 0),
(2, 'Lập trình Fontend', 'laptrinhfontend', 'lap-trinh-fontend-1596533233911.png', 0),
(3, 'Thiết kế web', 'thietkeweb', 'thiet-ke-web-1596533386426.jpg', 0),
(4, 'Fontend Developer', 'fontenddev', 'fontend-developer-1596533503802.png', 0),
(5, 'Backend Developer', 'backenddev', 'backend-developer-1596533567469.png', 0),
(6, 'CodeIgniter', 'codeigniter', 'codeigniter-1596534786986.jpg', 0),
(7, 'Windows', 'windows', 'windows-1596534925231.jpg', 0),
(8, 'Linux', 'linux', 'linux-1596534979509.png', 0),
(9, 'Github', 'github', 'github-1596535135003.png', 0),
(10, 'Zend', 'zend', 'zend-1596535200720.png', 0),
(11, 'MacOS', 'macos', 'macos-1596535317022.jpg', 0),
(12, 'PHP', 'php', 'php-1596535386851.jpg', 0),
(13, 'Oppo A52', 'oppoa52', 'oppo-a52-1596535482643.jpg', 0),
(14, 'Windows XP', 'winxp', 'windows-xp-1596535555260.jpg', 0);

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
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `Id` int(11) NOT NULL,
  `Email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Expiration` datetime NOT NULL,
  `Used` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `token`
--

INSERT INTO `token` (`Id`, `Email`, `Token`, `Expiration`, `Used`) VALUES
(1, 'anhkhuong1306@gmail.com', '59cb8b917dfee0c74808431a10996a17', '2020-07-28 21:47:08', 0);

-- --------------------------------------------------------

--
-- Table structure for table `typeaccount`
--

CREATE TABLE `typeaccount` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `IsDelete` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `typeaccount`
--

INSERT INTO `typeaccount` (`Id`, `Name`, `IsDelete`) VALUES
(1, 'Subscriber', 0),
(2, 'Writer', 0),
(3, 'Editor', 0),
(4, 'Administrator', 0);

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
  ADD KEY `Comment_Accounts` (`IdAccount`),
  ADD KEY `Comment_Posts` (`IdPost`);

--
-- Indexes for table `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD PRIMARY KEY (`Id`,`IdAccount`,`IdCategories`) USING BTREE,
  ADD KEY `EditorAccount_Accounts` (`IdAccount`),
  ADD KEY `EditorAccount_Categories` (`IdCategories`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Feedback_Account` (`IdEditorAccount`),
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
  ADD KEY `IdPost` (`IdPost`),
  ADD KEY `PostDetail_Account` (`IdAccount`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Url` (`Url`),
  ADD KEY `Posts_StatusPosts` (`IdStatus`),
  ADD KEY `Posts_SubCategories` (`IdCategories`);
ALTER TABLE `posts` ADD FULLTEXT KEY `Title` (`Title`);
ALTER TABLE `posts` ADD FULLTEXT KEY `Content_Summary` (`Content_Summary`);
ALTER TABLE `posts` ADD FULLTEXT KEY `Content_Full` (`Content_Full`);
ALTER TABLE `posts` ADD FULLTEXT KEY `Title_2` (`Title`,`Content_Summary`,`Content_Full`);

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
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`Id`);

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories_sub`
--
ALTER TABLE `categories_sub`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `editoraccount`
--
ALTER TABLE `editoraccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `information`
--
ALTER TABLE `information`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `tag_posts`
--
ALTER TABLE `tag_posts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `typeaccount`
--
ALTER TABLE `typeaccount`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  ADD CONSTRAINT `Comment_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`),
  ADD CONSTRAINT `Comment_Posts` FOREIGN KEY (`IdPost`) REFERENCES `posts` (`Id`);

--
-- Constraints for table `editoraccount`
--
ALTER TABLE `editoraccount`
  ADD CONSTRAINT `EditorAccount_Accounts` FOREIGN KEY (`IdAccount`) REFERENCES `accounts` (`Id`),
  ADD CONSTRAINT `EditorAccount_Categories` FOREIGN KEY (`IdCategories`) REFERENCES `categories` (`Id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `Feedback_EditorAccount` FOREIGN KEY (`IdEditorAccount`) REFERENCES `accounts` (`Id`),
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