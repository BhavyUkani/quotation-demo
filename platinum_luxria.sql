-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 156.67.105.155:3306
-- Generation Time: Jan 23, 2026 at 11:14 AM
-- Server version: 11.8.3-MariaDB-0+deb13u1 from Debian
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `platinum_luxria`
--

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `email`, `phone`, `address`, `manager`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('73f64415-a365-4825-86f7-5cdd160ab872', 'Main Branch', 'main@tattvix.com', '1234567890', '123 Main St, City', NULL, 1, '2026-01-13 11:26:36', '2026-01-13 11:26:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `propertyType` enum('Residential','Commercial') DEFAULT 'Residential',
  `totalArea` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `addedByEmployeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `assignedToEmployeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `name`, `email`, `phone`, `whatsapp`, `company`, `address`, `propertyType`, `totalArea`, `remarks`, `status`, `leadId`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`, `addedByEmployeeId`, `assignedToEmployeeId`) VALUES
('09a31b9f-c72f-4a65-a526-8494da249128', 'Chandreshbhai', 'admin@gmail.com', '9723173321', '9723173321', '', 'RK Trade Tower - 507', 'Residential', '234', '', 'Active', NULL, NULL, '2026-01-21 07:40:26', '2026-01-21 07:40:26', NULL, NULL, NULL),
('4c45612c-a05a-4e62-9d98-abd4b462dfe3', 'Karan', 'demo@tattvix.com', '968527410', '968527410', NULL, 'M-3 ', 'Residential', '800', NULL, 'Active', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 08:46:22', '2026-01-22 06:38:32', '2026-01-22 06:38:32', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('5bf3f39f-06d6-46c7-ae2a-c89d7a4e8b2c', 'Bhavy', 'bhavyukani1@gmail.com', '0987654321', '0987654321', '', 'vf', 'Residential', '12', '', 'Active', NULL, NULL, '2026-01-22 06:43:18', '2026-01-22 06:43:42', '2026-01-22 06:43:42', NULL, NULL),
('775a923b-6854-44eb-b805-091d31c031e5', 'Bhavy', 'bhavy@gmail.com', '123456789', '123456789', '', 'ertyui', 'Residential', '678', '', 'Active', NULL, NULL, '2026-01-22 06:38:04', '2026-01-22 06:43:48', '2026-01-22 06:43:48', NULL, NULL),
('847207c6-5d6a-4549-8c5d-7d164c4609bc', 'Chandreshbhai', 'admin@gmail.com', '9723173321', '9723173321', NULL, 'RK Trade Tower - 507', 'Residential', '234', NULL, 'Active', 'ff66742e-3b85-49b0-9fa0-4fa5d2d2a96a', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:41:21', '2026-01-22 06:43:53', '2026-01-22 06:43:53', NULL, NULL),
('a8f96438-92f1-40c9-911c-0ac542302b0f', 'Bhavy', 'bhavyukani1@gmail.com', '6355577329', '6355577329', NULL, 'M-3 Gujarat Housing Board', 'Residential', '600', NULL, 'Active', '6c9cabac-3e23-48a5-8926-2cb7d267efed', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:12:37', '2026-01-22 06:38:47', '2026-01-22 06:38:47', NULL, NULL),
('ab554179-851a-42a3-be4a-b46cd8af6772', 'Bhavy', 'bhavyukani1@gmail.com', '+91355577329', '+91355577329', NULL, 'poiuytrewq lkjhgfdsazxcvbnm', 'Residential', '1200', NULL, 'Active', 'a58e48f8-126d-4f97-b638-f90314704460', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 13:36:04', '2026-01-22 06:38:23', '2026-01-22 06:38:23', NULL, NULL),
('fd541516-4c37-4ad4-87a8-7903585487f3', 'john', 'john@gmail.com', '789461120', '789461120', NULL, 'mdasd', 'Residential', '800', NULL, 'Active', '275c41df-e66b-4a8a-b8ad-26788bb7b750', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 09:16:37', '2026-01-22 06:38:39', '2026-01-22 06:38:39', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client_notes`
--

CREATE TABLE `client_notes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `clientId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `note` text NOT NULL,
  `isCompleted` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `addedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `updatedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `manager` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `email`, `phone`, `manager`, `description`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('c6da4f9f-8811-463e-ba6e-f4cf03600d1c', 'Sales', 'sales@tattvix.com', NULL, NULL, NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 11:26:36', '2026-01-13 11:26:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT 'Employee',
  `departmentId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `isMaster` tinyint(1) NOT NULL DEFAULT 0,
  `lastSelectedBranchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `phone`, `whatsapp`, `address`, `password`, `role`, `departmentId`, `permissions`, `branchId`, `isMaster`, `lastSelectedBranchId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'luxuria furniturework', 'luxuriafurniturework88@gmail.com', '9876543210', '9876543210', '', '8866370997', 'Admin', 'c6da4f9f-8811-463e-ba6e-f4cf03600d1c', '[\"Leads\",\"Clients\",\"Packages\",\"Quotations\",\"Reports\",\"Sites\",\"Employees\",\"Departments\",\"Notifications\",\"Branches\",\"Settings\"]', '73f64415-a365-4825-86f7-5cdd160ab872', 1, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 11:26:36', '2026-01-23 06:00:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `whatsapp` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `propertyType` enum('Residential','Commercial') DEFAULT 'Residential',
  `totalArea` varchar(255) DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'New',
  `source` varchar(255) DEFAULT NULL,
  `addedByEmployeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `assignedToEmployeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `name`, `email`, `phone`, `whatsapp`, `address`, `propertyType`, `totalArea`, `remarks`, `status`, `source`, `addedByEmployeeId`, `assignedToEmployeeId`, `data`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('275c41df-e66b-4a8a-b8ad-26788bb7b750', 'john', 'john@gmail.com', '789461120', '789461120', 'mdasd', 'Residential', '800', '', 'Closed', 'Insta', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 09:16:26', '2026-01-22 06:38:39', NULL),
('675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'Karan', 'demo@tattvix.com', '968527410', '968527410', 'M-3 ', 'Residential', '800', 'convert', 'Closed', 'Insta', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 08:45:46', '2026-01-22 06:38:32', NULL),
('6c9cabac-3e23-48a5-8926-2cb7d267efed', 'Bhavy', 'bhavyukani1@gmail.com', '6355577329', '6355577329', 'M-3 Gujarat Housing Board', 'Residential', '600', 'Call me later', 'Closed', 'Google', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:12:13', '2026-01-22 06:38:46', NULL),
('8834a496-a03d-4599-bfa1-d4f217e7b82a', 'John Doe', 'john.lead@example.com', '1112223333', '1112223333', 'Lead Address', 'Residential', '1500 sqft', NULL, 'New', 'Website', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 11:26:37', '2026-01-13 11:27:34', '2026-01-13 11:27:34'),
('a531cf2e-68a4-4238-809c-9d7bc896b304', 'Bhavy', 'demo@tattvix.com', '+91355577329', '+91355577329', 'B 302 Ajanta Complex Sadhu vasvano Road', 'Residential', '1200', '', 'Converted', 'Google', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 11:30:39', '2026-01-13 12:10:41', '2026-01-13 12:10:41'),
('a58e48f8-126d-4f97-b638-f90314704460', 'Bhavy', 'bhavyukani1@gmail.com', '+91355577329', '+91355577329', 'poiuytrewq lkjhgfdsazxcvbnm', 'Residential', '1200', '', 'Closed', 'Google', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-13 12:12:07', '2026-01-22 06:38:22', NULL),
('ff66742e-3b85-49b0-9fa0-4fa5d2d2a96a', 'Chandreshbhai', 'admin@gmail.com', '9723173321', '9723173321', 'RK Trade Tower - 507', 'Residential', '234', '', 'Closed', 'Google', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:41:16', '2026-01-22 06:43:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lead_status_history`
--

CREATE TABLE `lead_status_history` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `leadId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fromStatus` varchar(255) DEFAULT NULL,
  `toStatus` varchar(255) NOT NULL,
  `remarks` text DEFAULT NULL,
  `changedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `isCompleted` tinyint(1) DEFAULT 0,
  `addedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lead_status_history`
--

INSERT INTO `lead_status_history` (`id`, `leadId`, `fromStatus`, `toStatus`, `remarks`, `changedAt`, `createdAt`, `updatedAt`, `deletedAt`, `isCompleted`, `addedBy`) VALUES
('0083c0c8-5e74-4897-a9da-c11999618b9a', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'Contacted', 'Converted', 'convert', '2026-01-20 08:46:22', '2026-01-20 08:46:22', '2026-01-20 08:46:22', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('0210dc01-4ade-4a08-b240-21ce3db58134', '6c9cabac-3e23-48a5-8926-2cb7d267efed', NULL, 'New', NULL, '2026-01-21 07:12:13', '2026-01-21 07:12:13', '2026-01-21 07:12:13', NULL, 0, NULL),
('08eefd0d-5c58-409f-ba4d-43e0961643bb', 'a58e48f8-126d-4f97-b638-f90314704460', 'Converted', 'Lost', '', '2026-01-13 13:19:55', '2026-01-13 13:19:55', '2026-01-13 13:19:55', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('1960afe5-81f8-47cd-b840-cd461015c470', 'a58e48f8-126d-4f97-b638-f90314704460', NULL, 'New', NULL, '2026-01-13 12:12:07', '2026-01-13 12:12:07', '2026-01-13 12:12:07', NULL, 0, NULL),
('233203d2-ae04-4f23-bbbb-f35095692127', '275c41df-e66b-4a8a-b8ad-26788bb7b750', NULL, 'New', NULL, '2026-01-20 09:16:26', '2026-01-20 09:16:26', '2026-01-20 09:16:26', NULL, 0, NULL),
('264c18dc-f10b-4716-8db5-28ec50c70145', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'Contacted', 'New', '', '2026-01-13 11:57:59', '2026-01-13 11:57:59', '2026-01-13 11:57:59', NULL, 0, NULL),
('45bae22b-ea14-4fa1-b423-304643d60060', '6c9cabac-3e23-48a5-8926-2cb7d267efed', 'New', 'Contacted', 'Call me later', '2026-01-21 07:12:29', '2026-01-21 07:12:29', '2026-01-21 07:12:29', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('6039fccd-f8af-492a-aaae-37d599a9ebc0', 'a58e48f8-126d-4f97-b638-f90314704460', 'Closed', 'Converted', '', '2026-01-13 13:20:11', '2026-01-13 13:20:11', '2026-01-13 13:20:11', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('adc65548-6318-466c-9443-0aa35832df80', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', NULL, 'New', NULL, '2026-01-20 08:45:46', '2026-01-20 08:45:46', '2026-01-20 08:45:46', NULL, 0, NULL),
('b020d42d-7bb8-418e-a99e-6848faf2743a', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'New', 'Contacted', 'call ', '2026-01-20 08:46:09', '2026-01-20 08:46:09', '2026-01-20 08:46:09', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6'),
('c73151ab-4849-4288-ab06-6d82e8f1fd4c', 'ff66742e-3b85-49b0-9fa0-4fa5d2d2a96a', NULL, 'New', NULL, '2026-01-21 07:41:16', '2026-01-21 07:41:16', '2026-01-21 07:41:16', NULL, 0, NULL),
('dafc0515-3191-4556-bc28-6f15ba647564', 'a58e48f8-126d-4f97-b638-f90314704460', 'Lost', 'Converted', '', '2026-01-13 13:20:00', '2026-01-13 13:20:00', '2026-01-13 13:20:00', NULL, 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` enum('lead_created','lead_updated','lead_converted','client_created','client_updated','employee_created','employee_updated','employee_password_changed') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `relatedId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ID of the related entity (lead, client, employee)',
  `relatedType` enum('lead','client','employee') DEFAULT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Employee who triggered the notification',
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `title`, `message`, `relatedId`, `relatedType`, `isRead`, `createdBy`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0f4ef09c-6789-43dc-ac1e-07c6bd18d3df', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"New\" to \"Qualified\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:52:32', '2026-01-13 12:06:28', '2026-01-13 12:06:28'),
('21adc769-404e-49a9-ad7f-7cd02df217c9', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Contacted\" to \"New\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:57:59', '2026-01-13 12:06:27', '2026-01-13 12:06:27'),
('27f35164-7b92-46da-918a-1bb4c496efe5', 'lead_created', 'New Lead Received', 'A new lead \"Chandreshbhai\" has been added by Demo Admin.', 'ff66742e-3b85-49b0-9fa0-4fa5d2d2a96a', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:41:16', '2026-01-22 06:12:21', '2026-01-22 06:12:21'),
('39a6e003-daeb-475e-b041-c06d20d7a6cc', 'lead_created', 'New Lead Received', 'A new lead \"Bhavy\" has been added by Demo Admin.', 'a58e48f8-126d-4f97-b638-f90314704460', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '2026-01-13 12:12:07', '2026-01-21 07:05:01', '2026-01-21 07:05:01'),
('3c31b5ec-f4c0-4152-af9a-3eeaaa53fad7', 'employee_password_changed', 'Employee Password Changed', 'Password for employee \"Demo Admin\" has been changed.', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'employee', 0, NULL, NULL, '2026-01-22 06:06:23', '2026-01-22 06:12:22', '2026-01-22 06:12:22'),
('3d5dfa7d-0e62-4615-9dd2-b59f7ee96e23', 'lead_created', 'New Lead Received', 'A new lead \"Karan\" has been added by Demo Admin.', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 08:45:46', '2026-01-21 07:05:00', '2026-01-21 07:05:00'),
('4edc8a37-4c5e-455d-879c-0f9978370233', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Lost\" to \"Converted\".', 'a58e48f8-126d-4f97-b638-f90314704460', 'lead', 0, 'Demo Admin', NULL, '2026-01-13 13:20:00', '2026-01-21 07:05:01', '2026-01-21 07:05:01'),
('8d05e731-88ef-4a11-9db6-5ba06073ddd1', 'lead_created', 'New Lead Received', 'A new lead \"Bhavy\" has been added by Demo Admin.', '6c9cabac-3e23-48a5-8926-2cb7d267efed', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:12:13', '2026-01-22 06:12:19', '2026-01-22 06:12:19'),
('96919469-a256-4c84-8053-fe63b30e4103', 'lead_updated', 'Lead Status Updated', 'Lead \"Karan\" status changed from \"New\" to \"Contacted\".', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'lead', 0, 'Demo Admin', NULL, '2026-01-20 08:46:09', '2026-01-21 07:05:00', '2026-01-21 07:05:00'),
('9cf0378e-12b4-4c68-b200-15e90736766a', 'lead_created', 'New Lead Received', 'A new lead \"john\" has been added by Demo Admin.', '275c41df-e66b-4a8a-b8ad-26788bb7b750', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 09:16:26', '2026-01-21 07:04:57', '2026-01-21 07:04:57'),
('a348b2ec-5c22-4481-8dec-fe54478b1921', 'client_created', 'New Client Added', 'A new client \"Chandreshbhai\" has been added to the system.', '09a31b9f-c72f-4a65-a526-8494da249128', 'client', 0, NULL, NULL, '2026-01-21 07:40:26', '2026-01-22 06:12:21', '2026-01-22 06:12:21'),
('a5cd92f2-b42c-4825-be9f-3175721efa37', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Proposal\" to \"New\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:52:41', '2026-01-13 12:06:28', '2026-01-13 12:06:28'),
('a8991397-76eb-47c7-9c66-3a4a05447acd', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Converted\" to \"Contacted\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:57:31', '2026-01-13 12:06:27', '2026-01-13 12:06:27'),
('acce657f-65e4-499d-9d0a-50337118205c', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Converted\" to \"Converted\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:57:25', '2026-01-13 12:06:27', '2026-01-13 12:06:27'),
('aebe3883-d5cd-4ded-b366-27719b7aa03a', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"New\" to \"Contacted\".', '6c9cabac-3e23-48a5-8926-2cb7d267efed', 'lead', 0, 'Demo Admin', NULL, '2026-01-21 07:12:29', '2026-01-22 06:12:20', '2026-01-22 06:12:20'),
('bc2198b5-830c-4f4a-86ee-a732a0140b8d', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"New\" to \"Converted\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:54:20', '2026-01-13 12:06:27', '2026-01-13 12:06:27'),
('c778ef5f-c15e-4a17-9c51-44874fc9cf33', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Qualified\" to \"Proposal\".', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, NULL, NULL, '2026-01-13 11:52:37', '2026-01-13 12:06:28', '2026-01-13 12:06:28'),
('c901f2a6-e18b-4056-ba1a-73054c188e7e', 'client_created', 'New Client Added', 'A new client \"Bhavy\" has been added to the system.', '5bf3f39f-06d6-46c7-ae2a-c89d7a4e8b2c', 'client', 1, NULL, NULL, '2026-01-22 06:43:19', '2026-01-23 06:14:10', NULL),
('d21a8ac7-b535-4f01-847c-368349344cd8', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Converted\" to \"Lost\".', 'a58e48f8-126d-4f97-b638-f90314704460', 'lead', 0, 'Demo Admin', NULL, '2026-01-13 13:19:55', '2026-01-21 07:05:01', '2026-01-21 07:05:01'),
('d3768325-96a0-407f-84bb-947aff70158c', 'lead_updated', 'Lead Status Updated', 'Lead \"Bhavy\" status changed from \"Closed\" to \"Converted\".', 'a58e48f8-126d-4f97-b638-f90314704460', 'lead', 0, 'Demo Admin', NULL, '2026-01-13 13:20:11', '2026-01-21 07:05:00', '2026-01-21 07:05:00'),
('dc70fae1-3f53-4295-90f1-1fc5708b068f', 'client_created', 'New Client Added', 'A new client \"Bhavy\" has been added to the system.', '775a923b-6854-44eb-b805-091d31c031e5', 'client', 1, NULL, NULL, '2026-01-22 06:38:05', '2026-01-23 06:09:26', NULL),
('e2c23229-8896-4dc2-969b-a4f7d60152be', 'lead_created', 'New Lead Received', 'A new lead \"Bhavy\" has been added by Demo Admin.', 'a531cf2e-68a4-4238-809c-9d7bc896b304', 'lead', 0, 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '2026-01-13 11:30:39', '2026-01-13 12:06:29', '2026-01-13 12:06:29'),
('e8e86a5e-d67c-4c90-b2cb-066b7ff1c2d2', 'lead_updated', 'Lead Status Updated', 'Lead \"Karan\" status changed from \"Contacted\" to \"Converted\".', '675dd372-14d9-4712-b6f3-5c8384c3f9a6', 'lead', 0, 'Demo Admin', NULL, '2026-01-20 08:46:22', '2026-01-21 07:04:58', '2026-01-21 07:04:58');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Gold',
  `description` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `employeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `costType` enum('Fixed','Calculated') NOT NULL DEFAULT 'Calculated',
  `fixedCost` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `type`, `category`, `description`, `features`, `notes`, `branchId`, `employeeId`, `createdAt`, `updatedAt`, `deletedAt`, `costType`, `fixedCost`) VALUES
('112fe63b-f251-4a65-976d-17a40a433510', 'undefined undefined', 'Office', 'Gold', '', '', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '2026-01-21 07:18:15', '2026-01-21 07:30:56', NULL, 'Calculated', NULL),
('205b6d01-ee03-4324-8b5c-cae96cd22c65', '2BHK Platinum', '2BHK', 'Platinum', '', '', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '2026-01-20 07:41:59', '2026-01-22 06:37:05', '2026-01-22 06:37:05', 'Calculated', NULL),
('8e33e09f-0be1-44d9-9c00-9c7d15706fff', '2BHK Silver', '2BHK', 'Silver', '', '', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '2026-01-21 07:14:46', '2026-01-22 06:36:54', '2026-01-22 06:36:54', 'Calculated', 10000.00),
('99a2d491-f618-4598-9fdd-659f2ef74c5e', '2BHK Platinum', '2BHK', 'Platinum', '', '', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '2026-01-21 06:50:02', '2026-01-22 06:37:00', '2026-01-22 06:37:00', 'Calculated', NULL),
('fdcdb200-0b08-4315-82fe-9eab0b08e3b7', '2BHK Gold', '2BHK', 'Gold', '', '', NULL, '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '2026-01-17 10:34:50', '2026-01-22 06:37:10', '2026-01-22 06:37:10', 'Calculated', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `package_notes`
--

CREATE TABLE `package_notes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `packageId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `note` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_notes`
--

INSERT INTO `package_notes` (`id`, `packageId`, `note`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('04665f45-17ff-4480-81a2-041630fd4ba6', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('049f2079-4b52-4b72-81f2-ef85e2788a7f', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('08351e13-05fb-436b-b746-8a283ba9d10a', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('0b586d04-1fd8-4951-ad12-b3cd4550db71', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('10a7943d-955e-4f40-9a12-edd678e7acbb', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('15c51852-f32b-46b2-aae8-613bf100cf75', '112fe63b-f251-4a65-976d-17a40a433510', 'FAN Range र2500', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('1611844e-d633-4bb1-9798-6893794f32b4', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('16e249bd-864a-4023-850e-de7d2989e7ec', '112fe63b-f251-4a65-976d-17a40a433510', 'FAN Range र2500', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('1703b0bf-d68b-4ffb-bd5d-0cbdd892927b', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('1cda03c2-1cae-4ebc-a5ff-97f0c1d1ba8c', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('207875f6-e206-4176-a241-3442645a298d', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:33:45', '2026-01-21 07:33:45', '2026-01-21 07:34:00'),
('221245da-9c77-4c94-9fd6-6702ae8ef4f9', '112fe63b-f251-4a65-976d-17a40a433510', 'Client Chair Range र3000', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('23735b82-ea34-460c-878a-799ce2de5461', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('26088b40-66c7-4d0a-a56b-b3db7885970a', '112fe63b-f251-4a65-976d-17a40a433510', 'AC Range र32000', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('2a25a29c-fd69-4afc-8a7b-b1a87364ac88', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:33:45', '2026-01-21 07:33:45', '2026-01-21 07:34:00'),
('2c7a2373-0e0e-4012-89df-6206e314c135', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:33:22', '2026-01-21 07:33:22', '2026-01-21 07:33:34'),
('36709767-c644-4a6f-a4b3-06a1f7f7e65b', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:30:56', '2026-01-21 07:30:56', '2026-01-21 07:32:12'),
('3983334f-95da-4640-8e77-9d6864095252', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('3ddb7f83-b9ac-4e0e-bd81-fe2f799fd4ff', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('40e23112-57c2-481d-95ab-487df88b8b17', '112fe63b-f251-4a65-976d-17a40a433510', 'AC Range र32000', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('42da333d-e58e-4234-bb45-7c196cc391e8', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('4456a7c1-b297-4c9b-8392-d7422bda672f', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'assasa', '2026-01-21 06:44:43', '2026-01-21 06:44:43', NULL),
('44e09f78-8a9d-4ce7-b2a0-2568197571b2', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('494f63ca-dcd7-479b-b0e5-f2932b5e05ec', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:33:22', '2026-01-21 07:33:22', '2026-01-21 07:33:34'),
('4da3df73-6766-4096-a31c-7a9a09814781', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm 70/ft', '2026-01-21 07:32:12', '2026-01-21 07:32:12', '2026-01-21 07:33:07'),
('54f7b8a1-0cab-43c0-8c7b-8bbfdba9ad1d', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('583c65d9-55c1-4576-b687-2f6d95715b5b', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('5a5beab8-4c88-4806-a735-ab97f21183c9', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('5b3e4b16-97d5-451a-97c2-5dc169b391f1', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('5d6bf02d-cdea-4c09-a3be-e97507e257a7', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('5d84dbae-ffed-49d5-815a-1d155176b414', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('5e6a2d12-a815-4ef6-9790-66dc08fc7a9f', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('5fa242db-440f-457f-9b8d-16ee9a4160b0', '112fe63b-f251-4a65-976d-17a40a433510', 'Lighting Range र450', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('60f80c19-0a30-4935-8a01-f0208a876ce4', '112fe63b-f251-4a65-976d-17a40a433510', 'Boss Chair Range र8000', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('63ba1b47-9306-4373-9178-5df046fffc3e', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('65fd5728-2cbd-4985-9fc1-c7ace1bf670c', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:32:12', '2026-01-21 07:32:12', '2026-01-21 07:33:07'),
('6b3221c7-73f0-465a-a521-05df03a43943', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('6c900aa6-3808-4973-b1d0-22ed06ba1a9c', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('6dbd653c-6136-46c6-a32a-c64be3b858b3', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('7016f050-e3b0-4408-9ac6-e58a36d4a2d3', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('74ff1ef0-20da-4d88-b50c-92d0638c53b5', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:33:34', '2026-01-21 07:33:34', '2026-01-21 07:33:45'),
('753fa7e1-f4c1-4c7a-9b07-d909f74ef91f', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('75959633-2c55-47b0-9c85-024c89a61ab7', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('75bb46b5-8658-4402-91a6-0d14f46fb197', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('76ca9911-aa12-46f1-80e9-594aa552a530', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('781397fd-ee23-4eaa-bff4-615174f60692', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('7aa06054-ab44-467b-b4ab-3b4278d4c587', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('830474ca-ffdd-412b-85e3-4cecbf5151eb', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:33:07', '2026-01-21 07:33:07', '2026-01-21 07:33:22'),
('8a1f59a8-8064-48fb-92ba-2a8022f8fd7a', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('8ef8c74d-bee1-4291-a01a-c6581268a567', '112fe63b-f251-4a65-976d-17a40a433510', 'FAN Range र2500', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('95ad6c72-1823-4002-862a-45d59f02fb0b', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('96041301-ea0b-4d97-bb35-9fd88a84769e', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'GST EXTRA', '2026-01-20 09:26:49', '2026-01-20 09:26:49', '2026-01-21 06:44:43'),
('99fbe093-d5e5-4064-88e0-c4b91ea7cddb', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:33:34', '2026-01-21 07:33:34', '2026-01-21 07:33:45'),
('9dfcac73-41ea-48c2-9e5f-a407bec75316', '112fe63b-f251-4a65-976d-17a40a433510', 'AC Range र32000', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('9f5f56cd-0bfb-4025-9ab0-a88757ecf523', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:33:45', '2026-01-21 07:33:45', '2026-01-21 07:34:00'),
('a105e348-cab1-463d-9ecc-0016b7f86872', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'GST EXTRA', '2026-01-21 06:44:43', '2026-01-21 06:44:43', NULL),
('a1e9147c-fdee-4cc5-b329-1001927f320b', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:33:07', '2026-01-21 07:33:07', '2026-01-21 07:33:22'),
('a60c3fe7-d54e-4cb2-a1ed-3a3e0706afc6', '112fe63b-f251-4a65-976d-17a40a433510', 'Boss Chair Range र8000', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('a753dc5f-d11d-4b30-bbf5-4aadb83506aa', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('a8a807ea-9ef4-47e4-8595-c9e10ae6e984', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('ad19d4cf-e8bb-45d5-bf60-cabc00820733', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('adc42b58-7e07-4b3f-adff-41486dc65479', '112fe63b-f251-4a65-976d-17a40a433510', 'FAN Range र2500', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('ade13298-9ed4-45d2-9979-1c68442eef75', '112fe63b-f251-4a65-976d-17a40a433510', 'Lighting Range र450', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('af26ce81-7053-4eee-b2e9-d66a4928975d', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('b1200eb5-79e4-4f48-9774-d0249c5b8be6', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:33:45', '2026-01-21 07:33:45', '2026-01-21 07:34:00'),
('b2d903a6-1993-40d3-9cc7-f6cc975dbb84', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('b3c2f5ee-41bc-42ec-a6ce-7190941dc689', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('b424eeb3-414d-4d73-bc24-1fd895da1ba9', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:33:34', '2026-01-21 07:33:34', '2026-01-21 07:33:45'),
('b5143799-7e51-4d71-bc8f-a0f199370202', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('ba8d0778-0e49-4a44-8739-db4a8013644f', '112fe63b-f251-4a65-976d-17a40a433510', 'Lighting Range र450', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('bac1dbba-6452-42ac-8c41-631d30399d83', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('bbdb97b6-fc7f-4866-9a54-884f7e8ce095', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('beba086d-5797-4f8f-b0e0-e57be0a17876', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('bfdf191b-996c-4fc8-bffb-eb4ec73db939', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('c31ff70a-b5d0-4c2f-9972-368a9ef4b791', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('c943c593-e993-4074-abd7-2bf7e112764c', '112fe63b-f251-4a65-976d-17a40a433510', 'Sofa Range र3000', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('caa3eade-314e-4d88-a133-2a643d42da72', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('cc9e80e7-fd54-40fe-89ba-c6f3043e123a', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('cdb1ca7d-3dbb-4576-95dc-2055eb25f113', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('cf288212-a6cc-4bf0-9eac-cbbbcdd562da', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:34:33', '2026-01-21 07:34:33', '2026-01-21 07:35:11'),
('d2aa9d63-ac34-4f64-8770-5349398fd823', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:33:34', '2026-01-21 07:33:34', '2026-01-21 07:33:45'),
('de2631f1-22d3-4d82-bb25-ecf356d5be09', '112fe63b-f251-4a65-976d-17a40a433510', 'Lighting Range र450', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('e029f046-e8f8-42c1-b81b-47426668cbe0', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('e14d7cb1-2417-47c9-a2aa-437d813c8479', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('e3d6534f-7fd3-4feb-9075-bb4a11f6db85', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:36:06', '2026-01-21 07:36:06', NULL),
('e49625b0-07cb-433e-a13e-94fdcf1c3377', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:33:22', '2026-01-21 07:33:22', '2026-01-21 07:33:34'),
('e5be1d56-f2be-49be-846a-794ab2876456', '112fe63b-f251-4a65-976d-17a40a433510', 'Lighting Range र450', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06'),
('ebc7976b-6aad-4634-adbe-d6056114cda6', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:34:00', '2026-01-21 07:34:00', '2026-01-21 07:34:25'),
('ee8c891b-c930-4608-b610-72d4597fb8f3', '112fe63b-f251-4a65-976d-17a40a433510', 'Hardware ISI Marked', '2026-01-21 07:34:25', '2026-01-21 07:34:25', '2026-01-21 07:34:33'),
('f111bc5a-7886-4743-8525-797f8c999a05', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Laminate र1400', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('f6900534-482e-4753-a869-a9781b7b1ce3', '112fe63b-f251-4a65-976d-17a40a433510', 'Fevicol Marine', '2026-01-21 07:33:45', '2026-01-21 07:33:45', '2026-01-21 07:34:00'),
('f9ae04a6-320b-4703-9886-b59c60bbe9be', '112fe63b-f251-4a65-976d-17a40a433510', 'Wiring RR', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('fde51c52-aa77-4399-b6ed-e5503e78d03e', '112fe63b-f251-4a65-976d-17a40a433510', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:35:11', '2026-01-21 07:35:11', '2026-01-21 07:35:21'),
('fe0d4a96-5828-4fee-a9e7-1b645d70d421', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:35:32', '2026-01-21 07:35:32', '2026-01-21 07:35:53'),
('fe182f91-e2dd-4fc8-9419-e466ec63be70', '112fe63b-f251-4a65-976d-17a40a433510', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:35:21', '2026-01-21 07:35:21', '2026-01-21 07:35:32'),
('ff1cb2d7-a4d3-49b0-a795-56de2bf20050', '112fe63b-f251-4a65-976d-17a40a433510', 'Inner laminate र500', '2026-01-21 07:35:53', '2026-01-21 07:35:53', '2026-01-21 07:36:06');

-- --------------------------------------------------------

--
-- Table structure for table `package_spaces`
--

CREATE TABLE `package_spaces` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `packageId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_spaces`
--

INSERT INTO `package_spaces` (`id`, `packageId`, `name`, `order`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('08e2a76e-82ba-4c33-9e0b-6a30909b6d0f', '99a2d491-f618-4598-9fdd-659f2ef74c5e', 'Space 1', 0, '2026-01-21 06:51:44', '2026-01-21 06:51:44', NULL),
('32d158ba-6aa5-43c9-a80f-7e43ce743884', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Space 1', 0, '2026-01-20 07:42:19', '2026-01-20 07:42:19', NULL),
('4a1d7692-641c-4be9-be1a-afd572774291', '99a2d491-f618-4598-9fdd-659f2ef74c5e', 'Space 2', 1, '2026-01-21 06:52:00', '2026-01-21 06:52:00', NULL),
('6c831f0b-af06-4773-8bcf-5d318acfd7c7', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Space 2', 1, '2026-01-20 07:42:21', '2026-01-20 07:42:21', NULL),
('70da7d02-573a-4d3a-bccc-3ad9bcea49e4', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'Space 2', 1, '2026-01-20 07:42:09', '2026-01-20 07:42:09', NULL),
('8b1de3fc-6f37-4ed0-90d2-e6bce2536f6f', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'Space 3', 2, '2026-01-20 07:42:11', '2026-01-20 07:42:11', NULL),
('a60186a7-f65b-4f46-88c5-f45e64a956a7', '99a2d491-f618-4598-9fdd-659f2ef74c5e', 'Space 3', 2, '2026-01-21 06:52:01', '2026-01-21 06:52:01', NULL),
('a6456cd1-7d7d-4b98-9469-ceefa15e8a78', '8e33e09f-0be1-44d9-9c00-9c7d15706fff', 'Living Room', 0, '2026-01-21 07:14:59', '2026-01-21 07:16:08', '2026-01-21 07:16:08'),
('b7925aa5-3972-4016-b717-1e4c53e31443', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'Space 1', 0, '2026-01-20 07:42:07', '2026-01-20 07:42:07', NULL),
('b8c9782f-e01c-45ca-b191-adf816ca37ad', '112fe63b-f251-4a65-976d-17a40a433510', 'Working Area', 1, '2026-01-21 07:24:56', '2026-01-21 07:24:56', NULL),
('d29f9320-89c7-4257-b7ba-d2ce5315666a', '112fe63b-f251-4a65-976d-17a40a433510', 'Main Chamber', 0, '2026-01-21 07:18:38', '2026-01-21 07:18:38', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `package_space_workitems`
--

CREATE TABLE `package_space_workitems` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `spaceId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `item` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `width` decimal(10,2) DEFAULT 0.00,
  `length` decimal(10,2) DEFAULT 0.00,
  `sqft` decimal(10,2) DEFAULT 0.00,
  `rsPerFt` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `package_space_workitems`
--

INSERT INTO `package_space_workitems` (`id`, `spaceId`, `item`, `quantity`, `width`, `length`, `sqft`, `rsPerFt`, `total`, `order`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('01461b88-f1fa-41da-b210-c7d9910d2c72', '6c831f0b-af06-4773-8bcf-5d318acfd7c7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:21', '2026-01-20 07:42:21', NULL),
('04f3608c-2b09-40c2-834e-93bd07c23957', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Working Area 4 Seating ', 1.00, 0.00, 0.00, 0.00, 14000.00, 14000.00, 0, '2026-01-21 07:24:56', '2026-01-21 07:47:31', NULL),
('060ff20d-c40d-4250-9b4e-a0abf470fd9b', 'a6456cd1-7d7d-4b98-9469-ceefa15e8a78', 'XYZ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 07:15:44', '2026-01-21 07:16:06', NULL),
('06129371-f839-4bc1-95de-84583129f51e', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Boss Table', 1.00, 0.00, 0.00, 0.00, 49000.00, 49000.00, 1, '2026-01-21 07:19:47', '2026-01-21 07:53:05', NULL),
('1076e91f-098f-4403-a3ba-d4d1fdc2cfa1', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Client Chair', 2.00, 0.00, 0.00, 0.00, 2500.00, 5000.00, 6, '2026-01-21 07:23:36', '2026-01-21 07:45:09', NULL),
('13dd72a1-e0ac-4b2a-bec7-f8d6d0b93fbb', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Color Work ', 1.00, 0.00, 0.00, 0.00, 12000.00, 12000.00, 11, '2026-01-21 07:28:03', '2026-01-21 07:50:45', NULL),
('15ab61b7-f719-4720-bd6d-92b150e5de42', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3, '2026-01-21 06:52:05', '2026-01-21 06:55:22', '2026-01-21 06:55:22'),
('1e6d7f77-abaf-469d-b271-aa27e10507f2', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 4, '2026-01-21 06:52:05', '2026-01-21 06:55:23', '2026-01-21 06:55:23'),
('25b0ce59-a4b3-4499-9c91-7863010eaaa1', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-21 06:52:01', '2026-01-21 06:55:21', '2026-01-21 06:55:21'),
('2635bd0a-f40c-4483-bc57-9ebb831bbadc', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10, '2026-01-21 07:24:39', '2026-01-21 07:24:43', '2026-01-21 07:24:43'),
('26e2916f-ff6a-4add-bb85-15f2a0ff9989', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 06:52:04', '2026-01-21 06:55:22', '2026-01-21 06:55:22'),
('298625f8-d946-4b04-b51b-716f1ce0e073', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Moulding Pati', 1.00, 0.00, 0.00, 0.00, 7000.00, 7000.00, 8, '2026-01-21 07:27:30', '2026-01-21 07:53:17', NULL),
('2bb7136d-6251-4c06-acb3-ea888e117eee', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Chamber Glass Partition ', 1.00, 10.00, 9.00, 90.00, 450.00, 40500.00, 0, '2026-01-21 07:18:38', '2026-01-21 07:51:05', NULL),
('2e6960b6-816c-4825-9f22-ad8066a61be9', '8b1de3fc-6f37-4ed0-90d2-e6bce2536f6f', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:11', '2026-01-20 07:42:11', NULL),
('328d1584-e4b1-4595-a8d5-7e1866f7157e', 'a6456cd1-7d7d-4b98-9469-ceefa15e8a78', 'TV Unit', 1.00, 8.00, 8.00, 64.00, 1400.00, 89600.00, 1, '2026-01-21 07:15:11', '2026-01-21 07:15:40', NULL),
('351471ba-9066-4d51-a9c2-3bceec316bd7', '4a1d7692-641c-4be9-be1a-afd572774291', '', 12.00, 12.00, 12.00, 144.00, 12.00, 20736.00, 0, '2026-01-21 06:55:24', '2026-01-21 06:55:31', NULL),
('3d18dcae-98e7-42b7-b58c-23a6f321543c', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Chair ', 4.00, 0.00, 0.00, 0.00, 3000.00, 12000.00, 5, '2026-01-21 07:26:39', '2026-01-21 07:48:54', NULL),
('3d4f0ac6-2f78-4910-a334-100339fde8bc', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Chamber window curtain', 1.00, 0.00, 0.00, 0.00, 10000.00, 10000.00, 3, '2026-01-21 07:22:26', '2026-01-21 07:44:51', NULL),
('3f726c11-d707-42e2-9946-7213a069f994', 'b7925aa5-3972-4016-b717-1e4c53e31443', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:07', '2026-01-20 07:42:07', NULL),
('3fb11e5f-242c-4d34-b494-cac057157ccf', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 9, '2026-01-21 07:24:28', '2026-01-21 07:48:26', NULL),
('4654898e-9b77-4a0f-b070-effcfe2660b9', 'a6456cd1-7d7d-4b98-9469-ceefa15e8a78', 'TV', 1.00, 0.00, 0.00, 0.00, 20000.00, 20000.00, 0, '2026-01-21 07:14:59', '2026-01-21 07:15:11', NULL),
('46ea8b5a-e778-469e-a6ce-471369fbfe79', '08e2a76e-82ba-4c33-9e0b-6a30909b6d0f', '', 10.00, 10.00, 10.00, 100.00, 10.00, 10000.00, 0, '2026-01-21 06:51:44', '2026-01-21 06:51:50', NULL),
('486aa74a-2f25-426c-82c4-52d05e317fe8', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'FAN ', 1.00, 0.00, 0.00, 0.00, 2500.00, 2500.00, 8, '2026-01-21 07:24:21', '2026-01-21 07:45:36', NULL),
('4e5a8138-c28f-4f9a-896a-5655ae07cd3d', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 06:55:26', '2026-01-21 06:55:26', NULL),
('51222c70-67b1-4c41-a239-ce9669378405', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Internet Cable ', 1.00, 0.00, 0.00, 0.00, 11000.00, 11000.00, 7, '2026-01-21 07:27:07', '2026-01-21 07:51:52', NULL),
('53a8b234-ff0b-491d-ba01-2d39d6c47fa6', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Boss Chair', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 5, '2026-01-21 07:22:47', '2026-01-21 07:45:01', NULL),
('593b769e-9fb1-4f64-909d-3ff5572798b0', '4a1d7692-641c-4be9-be1a-afd572774291', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3, '2026-01-21 06:52:03', '2026-01-21 06:55:18', '2026-01-21 06:55:18'),
('5b08f90d-f200-4f1b-9aed-edc6236d1fab', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'POP', 1.00, 0.00, 0.00, 0.00, 9000.00, 9000.00, 9, '2026-01-21 07:27:39', '2026-01-21 07:50:09', NULL),
('5ccf75ed-aeab-47b4-be37-1bbdf2ed4c17', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Chamber Storage with Drawer', 1.00, 3.00, 4.00, 12.00, 1000.00, 12000.00, 2, '2026-01-21 07:20:28', '2026-01-21 07:44:38', NULL),
('68d6df35-0ae2-4b12-a897-b3921e5b3565', 'a6456cd1-7d7d-4b98-9469-ceefa15e8a78', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3, '2026-01-21 07:15:52', '2026-01-21 07:15:52', NULL),
('7009fd6c-4572-4bff-a35f-884070c750ff', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Electric Work ', 0.00, 0.00, 0.00, 0.00, 12000.00, 12000.00, 11, '2026-01-21 07:28:17', '2026-01-21 07:47:02', NULL),
('79831fd3-c439-4e49-9bbe-c0ea767352f3', '32d158ba-6aa5-43c9-a80f-7e43ce743884', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:19', '2026-01-20 07:42:19', NULL),
('7d720720-b316-4002-8b92-21221335cda9', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 11000.00, 11000.00, 3, '2026-01-21 07:26:10', '2026-01-21 07:48:32', NULL),
('80f0d142-2901-4c0c-8782-67e0b4e9bf1c', '4a1d7692-641c-4be9-be1a-afd572774291', '', 10.00, 10.00, 10.00, 100.00, 446556.00, 99999999.99, 0, '2026-01-21 06:52:00', '2026-01-21 06:55:20', '2026-01-21 06:55:20'),
('8808b36c-1b62-4a61-a407-639eb9d49370', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Color Work ', 0.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 12, '2026-01-21 07:28:25', '2026-01-21 07:47:12', NULL),
('8d04cf80-4b0c-46fd-9e5a-035766619c62', '4a1d7692-641c-4be9-be1a-afd572774291', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 06:52:03', '2026-01-21 06:55:19', '2026-01-21 06:55:19'),
('8f111674-b37f-4908-9a81-62fbfd0e6394', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 06:55:26', '2026-01-21 06:55:26', NULL),
('8f68ade7-74a2-464b-82d9-304bbf8d1368', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Working Storage ', 1.00, 0.00, 0.00, 0.00, 48000.00, 48000.00, 1, '2026-01-21 07:25:42', '2026-01-21 07:52:40', NULL),
('98b688f4-32f7-47c0-aa61-da121c8fe285', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'Chamber wallpaper', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 4, '2026-01-21 07:22:38', '2026-01-21 07:44:57', NULL),
('a739de02-80e2-4455-a703-0ab02655c6cf', '4a1d7692-641c-4be9-be1a-afd572774291', '', 64.00, 654.00, 654.00, 427716.00, 654.00, 99999999.99, 1, '2026-01-21 06:52:03', '2026-01-21 06:55:20', '2026-01-21 06:55:20'),
('ae5cea68-ec5e-4004-99c3-421970756584', '70da7d02-573a-4d3a-bccc-3ad9bcea49e4', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:09', '2026-01-20 07:42:09', NULL),
('b185df0a-a6e9-438f-b4c4-836627556775', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Electric Work ', 1.00, 0.00, 0.00, 0.00, 18000.00, 18000.00, 10, '2026-01-21 07:27:55', '2026-01-21 07:50:16', NULL),
('b2939c4a-ca80-4d9e-b77a-36f53d30164c', '4a1d7692-641c-4be9-be1a-afd572774291', '', 12.00, 10.00, 10.00, 100.00, 10.00, 12000.00, 1, '2026-01-21 06:55:24', '2026-01-21 06:55:36', NULL),
('bc807789-a901-436a-b174-8034e3b9c4be', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Sofa 6 Foot', 1.00, 0.00, 0.00, 0.00, 18000.00, 18000.00, 2, '2026-01-21 07:25:58', '2026-01-21 07:48:07', NULL),
('c1c77ab7-0676-47a9-8f02-670844029a6f', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'Main Glass Door', 1.00, 3.25, 7.00, 22.75, 450.00, 10237.50, 6, '2026-01-21 07:26:53', '2026-01-21 07:51:44', NULL),
('e3be9ebb-ebd0-42ac-9602-5a9a5d6072a6', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'POP', 0.00, 0.00, 0.00, 0.00, 10000.00, 10000.00, 10, '2026-01-21 07:28:12', '2026-01-21 07:46:25', NULL),
('e4838673-44c1-4c4d-971a-93c17333fc31', 'd29f9320-89c7-4257-b7ba-d2ce5315666a', 'AC 1.5 TON (Croma)', 1.00, 0.00, 0.00, 0.00, 32000.00, 32000.00, 7, '2026-01-21 07:23:49', '2026-01-21 07:45:14', NULL),
('e6f186cb-cad3-4a9b-805d-ddd164de3c5e', 'b8c9782f-e01c-45ca-b191-adf816ca37ad', 'FAN', 1.00, 0.00, 0.00, 0.00, 2500.00, 2500.00, 4, '2026-01-21 07:26:22', '2026-01-21 07:48:40', NULL),
('f00f8c86-484f-47a8-b626-b230a97c66c7', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-21 06:55:26', '2026-01-21 06:55:26', NULL),
('f4389a89-def6-4309-bdb6-ac0fd149b79d', '4a1d7692-641c-4be9-be1a-afd572774291', '', 1.00, 10.00, 20.00, 200.00, 100.00, 20000.00, 2, '2026-01-21 06:55:24', '2026-01-21 06:55:43', NULL),
('fbd6c2da-b91f-41ab-8b5c-a0d7daba6d4d', 'a60186a7-f65b-4f46-88c5-f45e64a956a7', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 06:52:04', '2026-01-21 06:55:22', '2026-01-21 06:55:22');

-- --------------------------------------------------------

--
-- Table structure for table `quotations`
--

CREATE TABLE `quotations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quotationNumber` varchar(255) NOT NULL COMMENT 'Auto-generated quotation number',
  `clientId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Link to client',
  `packageId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Link to package',
  `projectName` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL COMMENT 'Area in sq.ft',
  `validFrom` datetime NOT NULL,
  `validTo` datetime NOT NULL COMMENT 'Expiry date of quotation',
  `discountPercentage` decimal(5,2) DEFAULT 0.00 COMMENT 'Discount percentage',
  `totalCost` decimal(12,2) NOT NULL COMMENT 'Final cost after discount',
  `salesPersonName` varchar(255) NOT NULL,
  `salesPersonMobile` varchar(255) NOT NULL,
  `status` enum('Draft','Sent','Accepted','Rejected') NOT NULL DEFAULT 'Draft',
  `remarks` text DEFAULT NULL,
  `createdBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL,
  `costType` enum('Fixed','Calculated') NOT NULL DEFAULT 'Calculated' COMMENT 'Type of costing: Fixed or Calculated from items',
  `fixedCost` decimal(12,2) DEFAULT NULL COMMENT 'Manual fixed cost if costType is Fixed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotations`
--

INSERT INTO `quotations` (`id`, `quotationNumber`, `clientId`, `packageId`, `projectName`, `area`, `validFrom`, `validTo`, `discountPercentage`, `totalCost`, `salesPersonName`, `salesPersonMobile`, `status`, `remarks`, `createdBy`, `branchId`, `createdAt`, `updatedAt`, `deletedAt`, `costType`, `fixedCost`) VALUES
('04ca776c-b459-4bb6-893b-593d34acfac0', 'QT-202601-0004_3', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan  (Copy)', '1200', '2026-01-20 07:48:23', '2026-02-19 07:48:23', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:48:23', '2026-01-20 07:48:29', '2026-01-20 07:48:29', 'Calculated', NULL),
('0c54dfed-57d9-47c0-9c99-947446b6fdc4', 'QT-202601-0002', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Alana Monroe', '1200', '2026-01-20 00:00:00', '2026-02-19 00:00:00', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:34:20', '2026-01-20 07:42:31', '2026-01-20 07:42:31', 'Calculated', NULL),
('1120226d-41c6-41fc-bdd8-f5ab952f32f2', 'QT-202601-0006', 'ab554179-851a-42a3-be4a-b46cd8af6772', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'Balaji upvan ', '1200', '2026-01-20 00:00:00', '2026-02-04 00:00:00', 0.00, 1100000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:56:07', '2026-01-21 06:56:01', '2026-01-21 06:56:01', 'Calculated', NULL),
('27e5b518-989b-4a84-a6a1-c711dde7f26c', 'QT-202601-0010', 'a8f96438-92f1-40c9-911c-0ac542302b0f', '99a2d491-f618-4598-9fdd-659f2ef74c5e', 'Balaji upvan ', '600', '2026-01-21 00:00:00', '2026-02-05 00:00:00', 5.00, 59599.20, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:13:29', '2026-01-22 06:08:15', '2026-01-22 06:08:15', 'Calculated', NULL),
('4859307c-3552-437a-89cb-27108262ebeb', 'QT-202601-0001', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan ', '1200', '2026-01-17 00:00:00', '2026-02-01 00:00:00', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Accepted', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-17 10:35:26', '2026-01-20 07:23:41', '2026-01-20 07:23:41', 'Calculated', NULL),
('79a25b80-1f89-4d14-a118-e70e15bb4e79', 'QT-202601-0004', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan  (Copy)', '1200', '2026-01-20 07:45:49', '2026-02-19 07:45:49', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:45:49', '2026-01-20 07:48:43', '2026-01-20 07:48:43', 'Calculated', NULL),
('96322d28-3ddd-4fbf-af48-a627616e7ff6', 'QT-202601-0011', '09a31b9f-c72f-4a65-a526-8494da249128', '112fe63b-f251-4a65-976d-17a40a433510', 'RK Trade Tower', '234', '2026-01-21 00:00:00', '2026-02-05 00:00:00', 0.00, 0.00, 'Veenitbhai', '8866370997', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:42:22', '2026-01-23 05:59:57', NULL, 'Calculated', 0.00),
('9a09665b-1ec2-4521-b32e-505ac9199928', 'QT-202601-0008', 'fd541516-4c37-4ad4-87a8-7903585487f3', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'qwerty', '800', '2025-12-20 00:00:00', '2026-01-04 00:00:00', 5.00, 1045000.00, 'asdf', '79621450', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 09:17:06', '2026-01-21 06:56:07', '2026-01-21 06:56:07', 'Calculated', NULL),
('9b4753d4-43a8-4a63-bd13-ab4a9bb6169a', 'QT-202601-0004_2', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan  (Copy)', '1200', '2026-01-20 07:48:18', '2026-02-19 07:48:18', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:48:18', '2026-01-20 07:48:36', '2026-01-20 07:48:36', 'Calculated', NULL),
('9c8dd54d-bf26-4106-96f0-236d10e534fc', 'QT-202601-0005', 'ab554179-851a-42a3-be4a-b46cd8af6772', '205b6d01-ee03-4324-8b5c-cae96cd22c65', 'Balaji upvan ', '1200', '2026-01-20 00:00:00', '2026-02-04 00:00:00', 10.00, 990000.00, '10000', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:53:37', '2026-01-20 07:53:42', '2026-01-20 07:53:42', 'Calculated', NULL),
('a589d0b0-b59a-4a98-aa53-5cbb23133419', 'QT-202601-0007', '4c45612c-a05a-4e62-9d98-abd4b462dfe3', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'qwerty', '800', '2026-01-20 00:00:00', '2026-02-04 00:00:00', 5.00, 1045000.00, 'asdf', '79621450', 'Accepted', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 08:47:14', '2026-01-21 06:56:04', '2026-01-21 06:56:04', 'Calculated', NULL),
('a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'QT-202601-0012', '09a31b9f-c72f-4a65-a526-8494da249128', '112fe63b-f251-4a65-976d-17a40a433510', 'RK Trade Tower', '234', '2026-01-21 00:00:00', '2026-02-05 00:00:00', 0.00, 377737.50, 'Veenitbhai', '8866370997', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 07:53:51', '2026-01-23 05:54:45', NULL, 'Calculated', 100000.00),
('bc59d7b6-b652-4792-b061-216cfb3745a5', 'QT-202601-0003', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan ', '1200', '2026-01-20 00:00:00', '2026-02-04 00:00:00', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:42:50', '2026-01-20 07:48:46', '2026-01-20 07:48:46', 'Calculated', NULL),
('d80f0f88-e3c7-4f13-8914-4b2289ef0f5c', 'QT-202601-0004_1', 'ab554179-851a-42a3-be4a-b46cd8af6772', 'fdcdb200-0b08-4315-82fe-9eab0b08e3b7', 'Balaji upvan  (Copy)', '1200', '2026-01-20 07:48:12', '2026-02-19 07:48:12', 10.00, 990000.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-20 07:48:12', '2026-01-20 07:48:40', '2026-01-20 07:48:40', 'Calculated', NULL),
('e3b0b049-9312-4763-8a23-62ffcd22c8f9', 'QT-202601-0009', 'ab554179-851a-42a3-be4a-b46cd8af6772', '99a2d491-f618-4598-9fdd-659f2ef74c5e', 'Altosa Utsav', '1200', '2026-01-21 00:00:00', '2026-02-05 00:00:00', 0.00, 69738.00, 'Karan Chaudhary', '+916355577329', 'Draft', '', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', '73f64415-a365-4825-86f7-5cdd160ab872', '2026-01-21 06:56:42', '2026-01-22 06:08:07', '2026-01-22 06:08:07', 'Calculated', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_notes`
--

CREATE TABLE `quotation_notes` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `note` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_notes`
--

INSERT INTO `quotation_notes` (`id`, `quotationId`, `note`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('14970380-3245-4195-9f7d-5d170fc4fadd', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('1a16b370-0020-4e51-8997-5cdacc2d8d59', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Vinour and Korean work will not be included in the Furniture.', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('1fc8d518-0999-48c0-bbf7-cceaf9c23fa5', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'FAN Range र2500', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('2d475129-f7c7-4ad7-906b-15178ee2f558', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('318cbcd5-9258-4c93-9804-a8598b323220', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Sofa Range र3000', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('322e2a11-63dc-46cc-8fa6-4b2b68e39871', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Main Laminate र1400', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('33b73b7e-f4a7-4ffb-bdf4-267437036bc7', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Boss Chair Range र8000', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('3c433167-3702-43be-a918-b2ef453eaf93', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Sofa Range र3000', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('418b7678-f6d5-46a4-9171-90dcea3f7554', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Fevicol Marine', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('44120296-1f46-4f29-8358-0244a817517b', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Hardware ISI Marked', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('47df215b-931b-496e-aa24-25514eb72ce1', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Wiring RR', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('4afffcc5-5c43-4ef2-802b-528b6da6c72d', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Boss Chair Range र8000', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('514c4d0c-8dcb-4382-948e-1af235753a17', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Wiring RR', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('56ba4b84-e2b2-4f35-961e-ed77cb758ed3', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Client Chair Range र3000', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('571cd12c-70b8-42e9-be01-bc85ecab3b68', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'AC Range र32000', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('64e1100c-9c68-47f1-b7a8-f4977c2d290a', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Hardware ISI Marked', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('73cd2211-e668-4811-bcea-39c1b332e198', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Inner laminate र500', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('7799a5a3-d0ef-486a-b025-1569cd77e96b', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'FAN Range र2500', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('7ac69a77-9a6b-4ee6-8b07-a3ba46d6d615', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Client Chair Range र3000', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('af83793d-0033-4135-9bed-ee0d67e683d1', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Lighting Range र450', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('b6413fb3-1398-426b-9a40-b2bb11a69734', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Fevicol Marine', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('c2fb6d82-e457-470d-8aa8-cc2ddcbd6cc2', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Plywood range 18mm र70/ft, 12mm - र52/ft', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('cffde4ee-cb71-4f10-a5e4-9f0dbe18cb6a', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Lighting Range र450', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('d2818682-bc32-49ee-9e25-90eb0d8bfc10', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Main Laminate र1400', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('e53d3ec5-3a68-46ac-a240-ece364a98b70', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'AC Range र32000', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('efb8fa71-0a80-4410-86c0-eaf59e1946fb', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Inner laminate र500', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_spaces`
--

CREATE TABLE `quotation_spaces` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_spaces`
--

INSERT INTO `quotation_spaces` (`id`, `quotationId`, `name`, `order`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('0595db4a-b921-47b4-9660-d3e2b7856a95', '9c8dd54d-bf26-4106-96f0-236d10e534fc', 'Space 2', 1, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('0e804fc2-c779-4878-a24c-ec4d987ea80f', '79a25b80-1f89-4d14-a118-e70e15bb4e79', 'Space 1', 0, '2026-01-20 07:45:49', '2026-01-20 07:45:49', NULL),
('0f3491fe-f34d-4bce-a226-3d1e7223b6f5', 'bc59d7b6-b652-4792-b061-216cfb3745a5', 'Space 1', 0, '2026-01-20 07:45:34', '2026-01-20 07:45:34', NULL),
('1549827e-6f5c-4b72-a909-5be90a1d1848', '1120226d-41c6-41fc-bdd8-f5ab952f32f2', 'Space 3', 2, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('1c140371-7ea4-48a3-a078-9a21cef91f76', '04ca776c-b459-4bb6-893b-593d34acfac0', 'Space 2', 1, '2026-01-20 07:48:23', '2026-01-20 07:48:23', NULL),
('1e8e2c54-fe76-4b24-b59e-15feacba2986', '04ca776c-b459-4bb6-893b-593d34acfac0', 'Space 1', 0, '2026-01-20 07:48:23', '2026-01-20 07:48:23', NULL),
('2050a721-c5eb-4a59-a8b5-434633ea8a52', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Space 1', 0, '2026-01-20 08:53:34', '2026-01-20 08:53:34', NULL),
('301c8c7c-5eaa-4759-9436-045ef6049179', 'd80f0f88-e3c7-4f13-8914-4b2289ef0f5c', 'Space 1', 0, '2026-01-20 07:48:12', '2026-01-20 07:48:12', NULL),
('3bd5e340-d5e7-412d-9267-e891027dc222', '1120226d-41c6-41fc-bdd8-f5ab952f32f2', 'Space 2', 1, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('46705590-dbbd-4084-b7a8-3fe30d2338e1', 'e3b0b049-9312-4763-8a23-62ffcd22c8f9', 'Space 1', 0, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('4bc6d600-7832-4132-82c2-de0bbffe3df3', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Space 3', 2, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('52862bb4-3722-47d3-8b12-4b71e9de4dba', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Space 2', 1, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('57c2a4eb-dc07-471b-98db-7517442eba3d', '9a09665b-1ec2-4521-b32e-505ac9199928', 'Space 1', 0, '2026-01-20 09:17:06', '2026-01-20 09:17:06', NULL),
('60e94b0a-d95a-4dd5-9856-714101d03818', 'e3b0b049-9312-4763-8a23-62ffcd22c8f9', 'Space 2', 1, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('62662e2e-6d5a-489b-9dac-50d825608a9f', 'bc59d7b6-b652-4792-b061-216cfb3745a5', 'Space 3', 2, '2026-01-20 07:42:50', '2026-01-20 07:42:50', '2026-01-20 07:45:34'),
('68305d67-910c-4be6-9617-f61c4a936875', '1120226d-41c6-41fc-bdd8-f5ab952f32f2', 'Space 1', 0, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('6bbb62e3-4596-4514-a810-c08ded14a325', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Main Chamber', 0, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('7c403a10-d31b-4ccc-934e-53e85e927778', '9b4753d4-43a8-4a63-bd13-ab4a9bb6169a', 'Space 1', 0, '2026-01-20 07:48:18', '2026-01-20 07:48:18', NULL),
('81824b31-b6c5-49c8-bc85-24c71fe02dd3', '9a09665b-1ec2-4521-b32e-505ac9199928', 'Space 2', 1, '2026-01-20 09:17:06', '2026-01-20 09:17:06', NULL),
('89d028ff-5aae-4358-9fa4-ba2318e3799b', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Space 2', 1, '2026-01-20 08:53:34', '2026-01-20 08:53:34', NULL),
('a1ea0d59-2034-4bec-90e3-48959a69610c', '27e5b518-989b-4a84-a6a1-c711dde7f26c', 'Space 2', 1, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('b1a06f48-bf55-41b4-8f77-5ac5e2a0ddd1', '27e5b518-989b-4a84-a6a1-c711dde7f26c', 'Space 3', 2, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('bd29c568-695f-40d2-93ae-27beb0e54db8', 'bc59d7b6-b652-4792-b061-216cfb3745a5', 'Space 2', 1, '2026-01-20 07:42:50', '2026-01-20 07:42:50', '2026-01-20 07:45:34'),
('c2c17660-e9b7-419e-8197-06f7175d1323', '79a25b80-1f89-4d14-a118-e70e15bb4e79', 'Space 2', 1, '2026-01-20 07:45:49', '2026-01-20 07:45:49', NULL),
('c2fe871c-8227-4de3-8be2-5f3da276247e', 'e3b0b049-9312-4763-8a23-62ffcd22c8f9', 'Space 3', 2, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('c4aca11a-8786-47e1-ad03-d9aab056d880', 'd80f0f88-e3c7-4f13-8914-4b2289ef0f5c', 'Space 2', 1, '2026-01-20 07:48:12', '2026-01-20 07:48:12', NULL),
('c77ced97-3684-4e44-887c-bb9f417fcb00', '9b4753d4-43a8-4a63-bd13-ab4a9bb6169a', 'Space 2', 1, '2026-01-20 07:48:18', '2026-01-20 07:48:18', NULL),
('d5bcbe84-4736-4986-a210-f5e8353cca5d', '27e5b518-989b-4a84-a6a1-c711dde7f26c', 'Space 1', 0, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('da14c3ce-d925-4a3a-a9bf-61218747f4b3', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Space 1', 0, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('dc6c4c78-948c-4db9-b312-e5535ffde5e3', '96322d28-3ddd-4fbf-af48-a627616e7ff6', 'Working Area', 1, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('dc747e0a-3730-4e2d-a51d-69d8cb8db30a', 'bc59d7b6-b652-4792-b061-216cfb3745a5', 'Space 2', 1, '2026-01-20 07:45:34', '2026-01-20 07:45:34', NULL),
('e1350f75-ab67-4445-b846-877264476d7c', 'bc59d7b6-b652-4792-b061-216cfb3745a5', 'Space 1', 0, '2026-01-20 07:42:50', '2026-01-20 07:42:50', '2026-01-20 07:45:34'),
('e4db031e-1ac4-477f-94f9-67da16f871ac', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Main Chamber', 0, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('e7dd4da8-22f3-4dca-bca5-426d1d4d2bb4', '9c8dd54d-bf26-4106-96f0-236d10e534fc', 'Space 3', 2, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('e967ac27-b2f5-452e-bd35-d122ddd19988', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', 'Working Area', 1, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('eb81bfbb-9831-4750-be66-74fd1f5e517c', '9c8dd54d-bf26-4106-96f0-236d10e534fc', 'Space 1', 0, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_space_workitems`
--

CREATE TABLE `quotation_space_workitems` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `spaceId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `item` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT 0.00,
  `width` decimal(10,2) DEFAULT 0.00,
  `length` decimal(10,2) DEFAULT 0.00,
  `sqft` decimal(10,2) DEFAULT 0.00,
  `rsPerFt` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_space_workitems`
--

INSERT INTO `quotation_space_workitems` (`id`, `spaceId`, `item`, `quantity`, `width`, `length`, `sqft`, `rsPerFt`, `total`, `order`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('005a6b01-ca48-42ad-8a89-38ceac2963ce', '1c140371-7ea4-48a3-a078-9a21cef91f76', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:23', '2026-01-20 07:48:23', NULL),
('07521f87-53b0-47f9-81d5-81bdd8d799a1', '89d028ff-5aae-4358-9fa4-ba2318e3799b', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 08:53:34', '2026-01-20 08:53:34', NULL),
('0803588a-6f6f-4e74-8276-5cd5896f8e11', '6bbb62e3-4596-4514-a810-c08ded14a325', 'FAN ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 8, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('0be09dbc-9dad-4dc9-a1a7-03dfc4a4ec2d', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Boss Chair', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 5, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('11f68377-2745-4c83-8f30-69761da584ca', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Chamber Storage with Drawer', 1.00, 3.00, 4.00, 12.00, 0.00, 0.00, 2, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('16a53839-e979-494d-8ab3-a48e21ab615d', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Client Chair', 2.00, 0.00, 0.00, 0.00, 2500.00, 5000.00, 6, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('174ff3c4-e531-4a01-b82c-cc4ba1ba61f0', '301c8c7c-5eaa-4759-9436-045ef6049179', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:12', '2026-01-20 07:48:12', NULL),
('18e2d8ac-aecd-45d0-ab5b-14f0afbacfe2', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Internet Cable ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 7, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('1afbdd6c-de35-4dd8-936c-ec98057b4c73', 'c2fe871c-8227-4de3-8be2-5f3da276247e', '', 0.00, 10.00, 7.00, 70.00, 100.00, 7000.00, 0, '2026-01-21 06:56:42', '2026-01-21 07:01:11', NULL),
('1c2cf900-0726-4074-ad8f-83554159f1f7', '2050a721-c5eb-4a59-a8b5-434633ea8a52', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 08:53:34', '2026-01-20 08:53:34', NULL),
('1c8d1b77-1723-43cf-9662-4c2d7183c823', 'c4aca11a-8786-47e1-ad03-d9aab056d880', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:12', '2026-01-20 07:48:12', NULL),
('1dc4d75b-c92b-44da-99b1-cfebf220818a', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'POP', 0.00, 0.00, 0.00, 0.00, 10000.00, 10000.00, 10, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('1fc15813-dc6a-4452-bb0d-7a0b4693100b', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 11000.00, 11000.00, 3, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('20a5f94f-0da0-4298-ac72-48cf38dec216', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Color Work ', 1.00, 0.00, 0.00, 0.00, 12000.00, 12000.00, 11, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('2616af1b-5af7-4d80-8db9-d95c5e41c752', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Moulding Pati', 1.00, 0.00, 0.00, 0.00, 7000.00, 7000.00, 8, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('2ac94622-9dff-4441-8e39-469ec75ea6d1', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Working Area 4 Seating ', 1.00, 0.00, 0.00, 0.00, 14000.00, 14000.00, 0, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('304fbc5a-cbba-4068-92e0-9b68d5ccf60d', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Chamber Glass Partition ', 1.00, 10.00, 9.00, 90.00, 450.00, 40500.00, 0, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('30dba97c-5595-4514-8c4b-b455ab0e9661', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Working Storage ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('30fc9b59-37d6-490d-a538-5463dfe111ac', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Electric Work ', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 11, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('31f4e82f-151e-40c6-94f1-c6273d954c99', '4bc6d600-7832-4132-82c2-de0bbffe3df3', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('328e36f9-ea84-4d7f-8479-fce60bd6a646', 'dc747e0a-3730-4e2d-a51d-69d8cb8db30a', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:45:34', '2026-01-20 07:45:34', NULL),
('34443049-8c43-4edd-855f-bf2d57ef46e3', '6bbb62e3-4596-4514-a810-c08ded14a325', 'POP', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('3ed76212-1bcd-4ed1-8136-a17d8f9cb22a', '3bd5e340-d5e7-412d-9267-e891027dc222', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('4072773d-c995-4955-973d-843eb8dca44f', '6bbb62e3-4596-4514-a810-c08ded14a325', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 9, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('4613c92d-f360-4350-91e9-2589fe50ad34', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Boss Table', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('4a244595-23c4-4426-a307-f5c8ad8eb019', '62662e2e-6d5a-489b-9dac-50d825608a9f', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:50', '2026-01-20 07:42:50', '2026-01-20 07:45:34'),
('4bbb290d-e7fe-4582-bc4c-80b24cedf45c', 'bd29c568-695f-40d2-93ae-27beb0e54db8', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:42:50', '2026-01-20 07:42:50', '2026-01-20 07:45:34'),
('4bbb616f-77de-4068-a5ce-fe61a24506ab', '60e94b0a-d95a-4dd5-9856-714101d03818', '', 12.00, 12.00, 12.00, 144.00, 12.00, 20736.00, 0, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('4eaf4fc4-939a-4acf-a3dd-871a25bd4474', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Boss Chair', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 5, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('50a57766-12e2-43ca-b3f1-2569cec62fd6', '57c2a4eb-dc07-471b-98db-7517442eba3d', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-20 09:39:19', '2026-01-20 09:39:25', NULL),
('5133095c-e1d8-409e-8985-fa27662c7f06', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'POP', 1.00, 0.00, 0.00, 0.00, 9000.00, 9000.00, 9, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('5331608c-a68d-470b-99da-319c376c6a98', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Electric Work ', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 10, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('53343a78-3a76-4403-9da2-80e44031a669', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Chamber Storage with Drawer', 1.00, 3.00, 4.00, 12.00, 1000.00, 12000.00, 2, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('56f25780-2d68-44fe-a2aa-2c920316e16c', '81824b31-b6c5-49c8-bc85-24c71fe02dd3', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 09:17:06', '2026-01-20 09:17:06', NULL),
('587312a8-0db6-4698-9de7-3f24f387d6e4', '60e94b0a-d95a-4dd5-9856-714101d03818', '', 12.00, 10.00, 10.00, 100.00, 10.00, 12000.00, 1, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('59e2fb90-860c-4a44-8619-37f52d6d987a', 'e1350f75-ab67-4445-b846-877264476d7c', 'golf', 0.00, 10.00, 0.00, 10.00, 0.00, 10.00, 0, '2026-01-20 07:42:50', '2026-01-20 07:43:30', '2026-01-20 07:45:34'),
('5a5b5b7b-d64c-417b-b133-55c63be2b7de', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Main Glass Door', 1.00, 3.25, 7.00, 22.75, 450.00, 10237.50, 6, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('5befcc3a-78f3-4cbb-8258-f08d134173c2', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Working Area 4 Seating ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('5eb92ca5-8984-4149-b720-17337756c46e', '1e8e2c54-fe76-4b24-b59e-15feacba2986', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:23', '2026-01-20 07:48:23', NULL),
('5f297199-4bd0-4182-b803-299fdb310342', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'AC 1.5 TON (Croma)', 1.00, 0.00, 0.00, 0.00, 32000.00, 32000.00, 7, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('5fbe39d8-382c-4c57-a9a6-5d90ac259b6f', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Sofa 6 Foot', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('65d7126c-8506-4b10-ae2a-1104708b5600', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('66b155e1-0b95-451c-a554-18df3eb21067', 'e7dd4da8-22f3-4dca-bca5-426d1d4d2bb4', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('70cf7399-ceb3-4227-9d52-0262b3f0f694', 'c2fe871c-8227-4de3-8be2-5f3da276247e', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('79e336c0-3f0f-4fc7-8e38-bdf58849fcb8', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Chair ', 4.00, 0.00, 0.00, 0.00, 3000.00, 12000.00, 5, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('7ddc8c2a-ac3b-4e50-928a-b299fcd69825', 'eb81bfbb-9831-4750-be66-74fd1f5e517c', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('833ff806-0c91-4bb7-862a-f98e94ef4696', '68305d67-910c-4be6-9617-f61c4a936875', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('838ccf3a-3794-4345-9307-d500fc4deaa6', 'c77ced97-3684-4e44-887c-bb9f417fcb00', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:18', '2026-01-20 07:48:18', NULL),
('839c4fa1-45c4-465c-95cd-0b6d8dbcccd8', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Electric Work ', 1.00, 0.00, 0.00, 0.00, 18000.00, 18000.00, 10, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('884d2a3c-d655-4685-8472-f1c96799bbb4', '60e94b0a-d95a-4dd5-9856-714101d03818', '', 1.00, 10.00, 20.00, 200.00, 100.00, 20000.00, 2, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('8853a047-209c-43d9-9df4-3ffa930d553f', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Moulding Pati', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 8, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('8aaeed87-dbc7-4d98-a755-300d7e3696b9', '0595db4a-b921-47b4-9660-d3e2b7856a95', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('8cedc763-d3e5-431b-8587-991619114361', 'a1ea0d59-2034-4bec-90e3-48959a69610c', '', 12.00, 10.00, 10.00, 100.00, 10.00, 12000.00, 1, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('8e8b784d-80d3-4aa1-b154-dc9f16f3280a', 'b1a06f48-bf55-41b4-8f77-5ac5e2a0ddd1', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('8f427644-09fd-4321-8a07-c1b00e44b9fe', '0f3491fe-f34d-4bce-a226-3d1e7223b6f5', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:45:34', '2026-01-20 07:45:34', NULL),
('8f78431a-4d55-4527-b2d2-c5357b55bc49', 'b1a06f48-bf55-41b4-8f77-5ac5e2a0ddd1', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('967e94e1-c17d-4862-8db1-98a223cb7644', 'd5bcbe84-4736-4986-a210-f5e8353cca5d', '', 10.00, 10.00, 10.00, 100.00, 10.00, 10000.00, 0, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('9a45f34c-abcd-4930-84cc-58cb3cfa8aee', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'FAN', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 4, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('9a9c1b2c-c834-4ec2-9357-4e013b3f319c', '52862bb4-3722-47d3-8b12-4b71e9de4dba', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('9b6a89d5-1136-46cc-bba1-1b7da79654e3', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'POP', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 9, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('9eb1e539-7de9-4035-bbef-c3f7a19623eb', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'AC Piping ', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 9, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('9eedb377-59cc-4cf5-9173-22be615d163e', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Client Chair', 2.00, 0.00, 0.00, 0.00, 0.00, 0.00, 6, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('a3e78537-ee56-4929-89f8-eaa14e61a38d', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Chamber Glass Partition ', 1.00, 10.00, 9.00, 90.00, 0.00, 0.00, 0, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('a8af9a97-4326-473c-8687-eaa5ef8dffb1', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Chamber wallpaper', 1.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 4, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('abd1c91d-fe68-4822-8955-74d5837b5d02', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Working Storage ', 1.00, 0.00, 0.00, 0.00, 48000.00, 48000.00, 1, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('b0d59afc-cfaf-42b6-94bf-a1072a72376f', '57c2a4eb-dc07-471b-98db-7517442eba3d', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 09:17:06', '2026-01-20 09:17:06', NULL),
('b4095470-6afc-4807-a41f-b93309ec3b22', 'a1ea0d59-2034-4bec-90e3-48959a69610c', '', 1.00, 10.00, 20.00, 200.00, 100.00, 20000.00, 2, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('b94979bf-71c0-442d-8d4f-318f74ce7a94', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Color Work ', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 11, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('b964919e-4d08-4fc0-b39b-5157e1027dfb', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Chamber window curtain', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 3, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('bc5b9e46-e9a0-4692-97af-a12ce277dd3f', 'c2fe871c-8227-4de3-8be2-5f3da276247e', '', 0.00, 0.00, 0.00, 0.00, 2.00, 2.00, 2, '2026-01-21 06:56:42', '2026-01-21 07:04:04', NULL),
('bd1553d0-7957-4766-a69e-3214d233d39e', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Chair ', 4.00, 0.00, 0.00, 0.00, 0.00, 0.00, 5, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('bf49a8dc-acac-433d-a4b5-bcfdb70042a0', '0e804fc2-c779-4878-a24c-ec4d987ea80f', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:45:49', '2026-01-20 07:45:49', NULL),
('c00ec8de-2dfb-4e05-a80b-2be3f905cf71', '46705590-dbbd-4084-b7a8-3fe30d2338e1', '', 10.00, 10.00, 10.00, 100.00, 10.00, 10000.00, 0, '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('c9ac36fa-2ed1-4a98-8054-fbf67dc16643', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Color Work ', 0.00, 0.00, 0.00, 0.00, 8000.00, 8000.00, 12, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('cb5358bb-2bca-4335-8db5-bb68df21b821', 'c2c17660-e9b7-419e-8197-06f7175d1323', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:45:49', '2026-01-20 07:45:49', NULL),
('cd7da359-bf57-49f9-bc0c-a38cea0c0461', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Electric Work ', 0.00, 0.00, 0.00, 0.00, 12000.00, 12000.00, 11, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('d056bc2c-5185-41b9-9c36-9a56da4fbf21', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Internet Cable ', 1.00, 0.00, 0.00, 0.00, 11000.00, 11000.00, 7, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('d227badf-6fa1-4232-9ff1-d3bffe7dc9e3', '7c403a10-d31b-4ccc-934e-53e85e927778', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:48:18', '2026-01-20 07:48:18', NULL),
('d4c32a02-fae7-43a6-9dec-ad61b62c6419', '6bbb62e3-4596-4514-a810-c08ded14a325', 'AC 1.5 TON (Croma)', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 7, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('d7837e3d-1b3f-49de-a4a9-3963065b00bd', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'Sofa 6 Foot', 1.00, 0.00, 0.00, 0.00, 18000.00, 18000.00, 2, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('dae510c2-3fdd-4fd7-a422-0aed8e7b4273', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Color Work ', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 12, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('dd285228-cb4c-4492-a407-ce7aae1767c3', 'a1ea0d59-2034-4bec-90e3-48959a69610c', '', 12.00, 12.00, 12.00, 144.00, 12.00, 20736.00, 0, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('e2131157-7351-403a-ad2b-a0ff4a82a0a7', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Boss Table', 1.00, 0.00, 0.00, 0.00, 49000.00, 49000.00, 1, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('e6ed2b70-edef-4217-a81b-e3f85927c4fd', '1549827e-6f5c-4b72-a909-5be90a1d1848', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('e830d2df-4e6e-4459-b640-25716a6d196a', '6bbb62e3-4596-4514-a810-c08ded14a325', 'Chamber wallpaper', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 4, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('ec8ac70b-63b7-493d-a11b-62b8161da253', 'da14c3ce-d925-4a3a-a9bf-61218747f4b3', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0, '2026-01-20 08:47:14', '2026-01-20 08:47:14', '2026-01-20 08:53:34'),
('eeb5145a-0901-4ad0-ae82-88af1afef90c', 'e967ac27-b2f5-452e-bd35-d122ddd19988', 'FAN', 1.00, 0.00, 0.00, 0.00, 2500.00, 2500.00, 4, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('f4646580-688f-49dd-9f03-5403ca72c69d', 'dc6c4c78-948c-4db9-b312-e5535ffde5e3', 'Main Glass Door', 1.00, 0.00, 0.00, 0.00, 0.00, 0.00, 6, '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('f5880ed2-0dc4-41df-b1c8-7d953f31cf3a', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'Chamber window curtain', 1.00, 0.00, 0.00, 0.00, 10000.00, 10000.00, 3, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('fd2cbff3-0b76-407e-a3c7-40da5efc3392', 'e4db031e-1ac4-477f-94f9-67da16f871ac', 'FAN ', 1.00, 0.00, 0.00, 0.00, 2500.00, 2500.00, 8, '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('fef16619-a58d-4148-b0e9-c55b3ee3033a', 'b1a06f48-bf55-41b4-8f77-5ac5e2a0ddd1', '', 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 2, '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation_status_histories`
--

CREATE TABLE `quotation_status_histories` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `previousStatus` varchar(255) DEFAULT NULL,
  `newStatus` varchar(255) NOT NULL,
  `changedBy` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation_status_histories`
--

INSERT INTO `quotation_status_histories` (`id`, `quotationId`, `previousStatus`, `newStatus`, `changedBy`, `remarks`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('137ec54e-7616-4f85-b04b-32a26a7899d9', 'e3b0b049-9312-4763-8a23-62ffcd22c8f9', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-21 06:56:42', '2026-01-21 06:56:42', NULL),
('18c9eddd-38ec-4348-949a-a7b6f3b11440', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 08:47:14', '2026-01-20 08:47:14', NULL),
('360a6a57-7f5f-4d06-8213-797dd521beca', '9a09665b-1ec2-4521-b32e-505ac9199928', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 09:17:06', '2026-01-20 09:17:06', NULL),
('3c7a21c3-467e-47bd-acae-d2db68fe0f9e', '9c8dd54d-bf26-4106-96f0-236d10e534fc', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 07:53:37', '2026-01-20 07:53:37', NULL),
('40f98299-bcde-4bfb-86ee-127e71112390', 'a589d0b0-b59a-4a98-aa53-5cbb23133419', 'Draft', 'Accepted', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Status updated via API', '2026-01-20 08:48:25', '2026-01-20 08:48:25', NULL),
('45ed59b5-a897-4794-a6dd-bd149688cc86', '04ca776c-b459-4bb6-893b-593d34acfac0', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Created via duplication', '2026-01-20 07:48:23', '2026-01-20 07:48:23', NULL),
('472415ff-1b09-4dba-89f6-463e64af7576', '27e5b518-989b-4a84-a6a1-c711dde7f26c', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-21 07:13:29', '2026-01-21 07:13:29', NULL),
('8cb2c483-fd3c-45d3-8670-e2f859c9874b', '9b4753d4-43a8-4a63-bd13-ab4a9bb6169a', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Created via duplication', '2026-01-20 07:48:18', '2026-01-20 07:48:18', NULL),
('98ce7daa-6a00-42ac-ad2b-fb1b5f594578', 'bc59d7b6-b652-4792-b061-216cfb3745a5', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 07:42:50', '2026-01-20 07:42:50', NULL),
('a7b72629-d89f-4fdf-b098-d355b9841c58', 'd80f0f88-e3c7-4f13-8914-4b2289ef0f5c', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Created via duplication', '2026-01-20 07:48:12', '2026-01-20 07:48:12', NULL),
('aa9212a5-5866-49ac-b2ca-acc728397c69', '4859307c-3552-437a-89cb-27108262ebeb', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-17 10:35:26', '2026-01-17 10:35:26', NULL),
('ba77ffda-82b9-443f-8d4b-f337028575c1', '1120226d-41c6-41fc-bdd8-f5ab952f32f2', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 07:56:07', '2026-01-20 07:56:07', NULL),
('e12eb895-94bb-42d8-8f91-5a8d0a3fa8c7', 'a874f9bc-9c88-4019-a9f7-8b0815c7639d', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-21 07:53:51', '2026-01-21 07:53:51', NULL),
('f7b56ba0-4fe1-41fb-b84e-0b7e856f6439', '96322d28-3ddd-4fbf-af48-a627616e7ff6', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-21 07:42:22', '2026-01-21 07:42:22', NULL),
('f83c1d47-737f-4a4d-be97-d29da7ea95a4', '4859307c-3552-437a-89cb-27108262ebeb', 'Draft', 'Accepted', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Status updated via API', '2026-01-17 10:35:43', '2026-01-17 10:35:43', NULL),
('fab76f22-bc6a-4dd4-9139-ab5a8674d180', '79a25b80-1f89-4d14-a118-e70e15bb4e79', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Created via duplication', '2026-01-20 07:45:49', '2026-01-20 07:45:49', NULL),
('ff5a1d7f-5972-4cb6-89a6-3242686c09ca', '0c54dfed-57d9-47c0-9c99-947446b6fdc4', NULL, 'Draft', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', 'Initial creation', '2026-01-20 07:34:20', '2026-01-20 07:34:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `clientName` varchar(255) NOT NULL,
  `projectName` varchar(255) NOT NULL,
  `supervisorName` varchar(255) DEFAULT NULL,
  `supervisorPhone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` varchar(255) DEFAULT 'Active',
  `branchId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `employeeId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `quotationId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `clientName`, `projectName`, `supervisorName`, `supervisorPhone`, `address`, `status`, `branchId`, `employeeId`, `quotationId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
('05ebdb60-dbe3-45e2-b699-2f64b1519bf6', 'Bhavy', 'Balaji upvan ', 'Hello', NULL, 'poiuytrewq lkjhgfdsazxcvbnm', 'Active', '73f64415-a365-4825-86f7-5cdd160ab872', NULL, NULL, '2026-01-17 10:35:43', '2026-01-17 10:35:43', '2026-01-22 06:36:42'),
('44c6ea3f-5307-45ac-8ae8-55daf357bf69', 'Karan', 'qwerty', 'Demo Admin', '9876543210', 'M-3 ', 'Draft', '73f64415-a365-4825-86f7-5cdd160ab872', 'c89bdd4d-3032-4ce1-88a7-416aad2276e6', NULL, '2026-01-20 08:53:34', '2026-01-20 08:53:34', '2026-01-22 06:36:36'),
('6a8a0f68-675f-4379-bbfc-1e309af76502', 'Karan', 'qwerty', 'vbn', NULL, 'M-3 ', 'Active', '73f64415-a365-4825-86f7-5cdd160ab872', NULL, NULL, '2026-01-20 08:48:25', '2026-01-20 08:48:25', '2026-01-20 09:05:13');

-- --------------------------------------------------------

--
-- Table structure for table `site_materials`
--

CREATE TABLE `site_materials` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `siteId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date` date NOT NULL,
  `materialName` varchar(255) NOT NULL,
  `quantity` float NOT NULL DEFAULT 0,
  `unit` varchar(255) NOT NULL,
  `cost` float NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_branch_name` (`name`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leadId` (`leadId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `addedByEmployeeId` (`addedByEmployeeId`),
  ADD KEY `assignedToEmployeeId` (`assignedToEmployeeId`);

--
-- Indexes for table `client_notes`
--
ALTER TABLE `client_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientId` (`clientId`),
  ADD KEY `addedBy` (`addedBy`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name` (`name`),
  ADD KEY `branchId` (`branchId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_email` (`email`),
  ADD KEY `departmentId` (`departmentId`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `lastSelectedBranchId` (`lastSelectedBranchId`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addedByEmployeeId` (`addedByEmployeeId`),
  ADD KEY `assignedToEmployeeId` (`assignedToEmployeeId`),
  ADD KEY `branchId` (`branchId`);

--
-- Indexes for table `lead_status_history`
--
ALTER TABLE `lead_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leadId` (`leadId`),
  ADD KEY `addedBy` (`addedBy`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branchId` (`branchId`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `employeeId` (`employeeId`);

--
-- Indexes for table `package_notes`
--
ALTER TABLE `package_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `packageId` (`packageId`);

--
-- Indexes for table `package_spaces`
--
ALTER TABLE `package_spaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `packageId` (`packageId`);

--
-- Indexes for table `package_space_workitems`
--
ALTER TABLE `package_space_workitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spaceId` (`spaceId`);

--
-- Indexes for table `quotations`
--
ALTER TABLE `quotations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `quotationNumber` (`quotationNumber`),
  ADD KEY `clientId` (`clientId`),
  ADD KEY `packageId` (`packageId`),
  ADD KEY `createdBy` (`createdBy`),
  ADD KEY `branchId` (`branchId`);

--
-- Indexes for table `quotation_notes`
--
ALTER TABLE `quotation_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotationId` (`quotationId`);

--
-- Indexes for table `quotation_spaces`
--
ALTER TABLE `quotation_spaces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotationId` (`quotationId`);

--
-- Indexes for table `quotation_space_workitems`
--
ALTER TABLE `quotation_space_workitems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spaceId` (`spaceId`);

--
-- Indexes for table `quotation_status_histories`
--
ALTER TABLE `quotation_status_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quotationId` (`quotationId`),
  ADD KEY `changedBy` (`changedBy`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `branchId` (`branchId`),
  ADD KEY `employeeId` (`employeeId`),
  ADD KEY `quotationId` (`quotationId`);

--
-- Indexes for table `site_materials`
--
ALTER TABLE `site_materials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siteId` (`siteId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_ibfk_436` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `clients_ibfk_437` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `clients_ibfk_438` FOREIGN KEY (`addedByEmployeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `clients_ibfk_439` FOREIGN KEY (`assignedToEmployeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `client_notes`
--
ALTER TABLE `client_notes`
  ADD CONSTRAINT `client_notes_ibfk_258` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `client_notes_ibfk_259` FOREIGN KEY (`addedBy`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `client_notes_ibfk_260` FOREIGN KEY (`updatedBy`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_364` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_365` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_ibfk_366` FOREIGN KEY (`lastSelectedBranchId`) REFERENCES `branches` (`id`);

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_346` FOREIGN KEY (`addedByEmployeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_347` FOREIGN KEY (`assignedToEmployeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `leads_ibfk_348` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `lead_status_history`
--
ALTER TABLE `lead_status_history`
  ADD CONSTRAINT `lead_status_history_ibfk_199` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `lead_status_history_ibfk_200` FOREIGN KEY (`addedBy`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`);

--
-- Constraints for table `packages`
--
ALTER TABLE `packages`
  ADD CONSTRAINT `packages_ibfk_209` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `packages_ibfk_210` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`);

--
-- Constraints for table `package_notes`
--
ALTER TABLE `package_notes`
  ADD CONSTRAINT `package_notes_ibfk_1` FOREIGN KEY (`packageId`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `package_spaces`
--
ALTER TABLE `package_spaces`
  ADD CONSTRAINT `package_spaces_ibfk_1` FOREIGN KEY (`packageId`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `package_space_workitems`
--
ALTER TABLE `package_space_workitems`
  ADD CONSTRAINT `package_space_workitems_ibfk_1` FOREIGN KEY (`spaceId`) REFERENCES `package_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotations`
--
ALTER TABLE `quotations`
  ADD CONSTRAINT `quotations_ibfk_410` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_411` FOREIGN KEY (`packageId`) REFERENCES `packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_412` FOREIGN KEY (`createdBy`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `quotations_ibfk_413` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `quotation_notes`
--
ALTER TABLE `quotation_notes`
  ADD CONSTRAINT `quotation_notes_ibfk_1` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotation_spaces`
--
ALTER TABLE `quotation_spaces`
  ADD CONSTRAINT `quotation_spaces_ibfk_1` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotation_space_workitems`
--
ALTER TABLE `quotation_space_workitems`
  ADD CONSTRAINT `quotation_space_workitems_ibfk_1` FOREIGN KEY (`spaceId`) REFERENCES `quotation_spaces` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quotation_status_histories`
--
ALTER TABLE `quotation_status_histories`
  ADD CONSTRAINT `quotation_status_histories_ibfk_195` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quotation_status_histories_ibfk_196` FOREIGN KEY (`changedBy`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `sites`
--
ALTER TABLE `sites`
  ADD CONSTRAINT `sites_ibfk_286` FOREIGN KEY (`branchId`) REFERENCES `branches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sites_ibfk_287` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `sites_ibfk_288` FOREIGN KEY (`quotationId`) REFERENCES `quotations` (`id`);

--
-- Constraints for table `site_materials`
--
ALTER TABLE `site_materials`
  ADD CONSTRAINT `site_materials_ibfk_1` FOREIGN KEY (`siteId`) REFERENCES `sites` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
