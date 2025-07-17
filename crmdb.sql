-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 10, 2025 at 10:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crmdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `address`, `created_at`) VALUES
(1, 'Alice Johnson', 'alice.johnson@example.com', '+1-555-1234', '123 Main St, Springfield', '2025-07-09 11:53:28'),
(2, 'Leo NAF', 'oussamapatron37@gmail.com', '27756775', 'ROUTE GABES KLM 8.5\n', '2025-07-09 11:57:54');

-- --------------------------------------------------------

--
-- Table structure for table `deals`
--

CREATE TABLE `deals` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `value` decimal(15,2) DEFAULT NULL,
  `stage` varchar(100) DEFAULT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deals`
--

INSERT INTO `deals` (`id`, `title`, `value`, `stage`, `owner_id`, `contact_id`, `created_at`, `updated_at`) VALUES
(2, 'New CRM Deal', 10000.00, 'Negotiation', 4, NULL, '2025-07-09 12:32:04', '2025-07-09 12:32:04');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'new',
  `source` varchar(100) DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `name`, `email`, `phone`, `company`, `status`, `source`, `assigned_to`, `created_at`, `updated_at`, `notes`) VALUES
(6, 'Sarah Connor', 'sarah.connor@example.com', '5551234567', 'Skynet Solutions', 'contacted', 'referral', 4, '2025-07-10 07:57:51', '2025-07-10 07:57:51', 'Requested a follow-up call next week.'),
(7, 'Michael Scott', 'michael.scott@dundermifflin.com', '5708675309', 'Dunder Mifflin', 'qualified', 'website', 5, '2025-07-10 07:59:16', '2025-07-10 07:59:16', 'Interested in bulk paper order. Loves to talk!');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`) VALUES
(57, 'create_client'),
(49, 'create_contact'),
(2, 'create_deal'),
(53, 'create_user'),
(59, 'delete_client'),
(51, 'delete_contact'),
(4, 'delete_deal'),
(55, 'delete_user'),
(61, 'export_data'),
(62, 'import_data'),
(63, 'manage_roles'),
(65, 'manage_settings'),
(5, 'manage_users'),
(58, 'update_client'),
(50, 'update_contact'),
(3, 'update_deal'),
(54, 'update_user'),
(56, 'view_clients'),
(48, 'view_contacts'),
(60, 'view_dashboard'),
(1, 'view_deals'),
(64, 'view_reports'),
(52, 'view_users');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'Admin'),
(3, 'Client'),
(2, 'User');

-- --------------------------------------------------------

--
-- Table structure for table `rolepermissions`
--

CREATE TABLE `rolepermissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rolepermissions`
--

INSERT INTO `rolepermissions` (`id`, `role_id`, `permission_id`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 48),
(7, 1, 49),
(8, 1, 50),
(9, 1, 51),
(10, 1, 52),
(11, 1, 53),
(12, 1, 54),
(13, 1, 55),
(14, 1, 56),
(15, 1, 57),
(16, 1, 58),
(17, 1, 59),
(18, 1, 60),
(19, 1, 61),
(20, 1, 62),
(21, 1, 63),
(22, 1, 64),
(23, 1, 65),
(32, 2, 60),
(33, 2, 56),
(34, 2, 48),
(35, 2, 1),
(36, 2, 64),
(37, 2, 52),
(38, 2, 49),
(39, 2, 50),
(40, 2, 51),
(41, 2, 2),
(42, 2, 3),
(43, 2, 4),
(44, 2, 57),
(45, 2, 58),
(57, 2, 4),
(58, 2, 57),
(59, 2, 58),
(60, 3, 60),
(61, 3, 48),
(62, 3, 1),
(63, 3, 50);

-- --------------------------------------------------------

--
-- Table structure for table `roleuser`
--

CREATE TABLE `roleuser` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roleuser`
--

INSERT INTO `roleuser` (`id`, `user_id`, `role_id`) VALUES
(3, 4, 2),
(4, 4, 1),
(5, 5, 2),
(6, 5, 2),
(7, 6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `userauth`
--

CREATE TABLE `userauth` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userauth`
--

INSERT INTO `userauth` (`id`, `user_id`, `email`, `password`, `token`) VALUES
(3, 4, 'admin@example.com', '$2b$10$F8UzQ4in4z8oHrqQMPPccOu81xRo9ZdpDhNF30LsCUkB86muab3mm', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiVXNlciIsIkFkbWluIl0sInBlcm1pc3Npb25zIjpbInZpZXdfZGFzaGJvYXJkIiwidmlld19jbGllbnRzIiwidmlld19jb250YWN0cyIsInZpZXdfZGVhbHMiLCJ2aWV3X3JlcG9ydHMiLCJ2aWV3X3VzZXJzIiwiY3JlYXRlX2NvbnRhY3QiLCJ1cGRhdGVfY29udGFjdCIsImRlbGV0ZV9jb250YWN0IiwiY3JlYXRlX2RlYWwiLCJ1cGRhdGVfZGVhbCIsImRlbGV0ZV9kZWFsIiwiY3JlYXRlX2NsaWVudCIsInVwZGF0ZV9jbGllbnQiLCJtYW5hZ2VfdXNlcnMiLCJjcmVhdGVfdXNlciIsInVwZGF0ZV91c2VyIiwiZGVsZXRlX3VzZXIiLCJkZWxldGVfY2xpZW50IiwiZXhwb3J0X2RhdGEiLCJpbXBvcnRfZGF0YSIsIm1hbmFnZV9yb2xlcyIsIm1hbmFnZV9zZXR0aW5ncyJdLCJpYXQiOjE3NTIxMzY1NDgsImV4cCI6MTc1MjE0MDE0OH0.ytR1Ub4WD6u6SDJhYbMmEv2MsUXFoDqLdvdAbBXJipc'),
(4, 5, 'user@example.com', '$2b$10$mGbynutEOffvT9rDAo1R0.14VmgyYIgYpnKEl7oMm9OuW2vx7lHj.', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJyb2xlcyI6WyJVc2VyIiwiVXNlciJdLCJwZXJtaXNzaW9ucyI6WyJ2aWV3X2Rhc2hib2FyZCIsInZpZXdfY2xpZW50cyIsInZpZXdfY29udGFjdHMiLCJ2aWV3X2RlYWxzIiwidmlld19yZXBvcnRzIiwidmlld191c2VycyIsImNyZWF0ZV9jb250YWN0IiwidXBkYXRlX2NvbnRhY3QiLCJkZWxldGVfY29udGFjdCIsImNyZWF0ZV9kZWFsIiwidXBkYXRlX2RlYWwiLCJkZWxldGVfZGVhbCIsImNyZWF0ZV9jbGllbnQiLCJ1cGRhdGVfY2xpZW50Il0sImlhdCI6MTc1MjEzNjcxMiwiZXhwIjoxNzUyMTQwMzEyfQ.ttfyCbdUEPsk5QaBA2s3Mb3_hYqzIZYq5Se_BRRNY48'),
(5, 6, 'client@example.com', '$2b$10$.wU/w4SlJRLaxMKeQDqyzet8rOSw4F1AkfCWaK6UzKRAEqiayCNvi', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJlbWFpbCI6ImNsaWVudEBleGFtcGxlLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwicGVybWlzc2lvbnMiOlsidmlld19kYXNoYm9hcmQiLCJ2aWV3X2NsaWVudHMiLCJ2aWV3X2NvbnRhY3RzIiwidmlld19kZWFscyIsInZpZXdfcmVwb3J0cyIsInZpZXdfdXNlcnMiLCJjcmVhdGVfY29udGFjdCIsInVwZGF0ZV9jb250YWN0IiwiZGVsZXRlX2NvbnRhY3QiLCJjcmVhdGVfZGVhbCIsInVwZGF0ZV9kZWFsIiwiZGVsZXRlX2RlYWwiLCJjcmVhdGVfY2xpZW50IiwidXBkYXRlX2NsaWVudCJdLCJpYXQiOjE3NTIxMzY3MjEsImV4cCI6MTc1MjE0MDMyMX0.xg0FXb8KM57JGKYi9N9mqR3dr2QcOh-oCq-brqgqJP4');

-- --------------------------------------------------------

--
-- Table structure for table `userdetails`
--

CREATE TABLE `userdetails` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `userdetails`
--

INSERT INTO `userdetails` (`id`, `name`, `phone`, `address`) VALUES
(4, 'admin', '123456789', 'admin address'),
(5, 'user', '27756123', 'user address'),
(6, 'client', '+123456789', 'client address');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deals`
--
ALTER TABLE `deals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `contact_id` (`contact_id`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `roleuser`
--
ALTER TABLE `roleuser`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `userauth`
--
ALTER TABLE `userauth`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `userdetails`
--
ALTER TABLE `userdetails`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `deals`
--
ALTER TABLE `deals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `roleuser`
--
ALTER TABLE `roleuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `userauth`
--
ALTER TABLE `userauth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `userdetails`
--
ALTER TABLE `userdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deals`
--
ALTER TABLE `deals`
  ADD CONSTRAINT `deals_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `userdetails` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `deals_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `userdetails` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `rolepermissions`
--
ALTER TABLE `rolepermissions`
  ADD CONSTRAINT `rolepermissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `rolepermissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `roleuser`
--
ALTER TABLE `roleuser`
  ADD CONSTRAINT `roleuser_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userdetails` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `roleuser_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `userauth`
--
ALTER TABLE `userauth`
  ADD CONSTRAINT `userauth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `userdetails` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
