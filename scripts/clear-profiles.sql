-- Clear all profiles from MySQL database
-- Run this in MySQL Workbench or via command line

USE ischolar;

-- First, delete dependent records if any exist
DELETE FROM VerificationDocument;
DELETE FROM AuditLog;
DELETE FROM Notification;
DELETE FROM Disbursement;
DELETE FROM ScholarshipAward;
DELETE FROM Review;
DELETE FROM ApplicationFile;
DELETE FROM Application;

-- Finally, delete all profiles
DELETE FROM Profile;

-- Reset auto-increment counters back to 1
ALTER TABLE Profile AUTO_INCREMENT = 1;
ALTER TABLE Application AUTO_INCREMENT = 1;
ALTER TABLE ApplicationFile AUTO_INCREMENT = 1;
ALTER TABLE Review AUTO_INCREMENT = 1;
ALTER TABLE ScholarshipAward AUTO_INCREMENT = 1;
ALTER TABLE Disbursement AUTO_INCREMENT = 1;
ALTER TABLE Notification AUTO_INCREMENT = 1;
ALTER TABLE AuditLog AUTO_INCREMENT = 1;
ALTER TABLE VerificationDocument AUTO_INCREMENT = 1;

-- Verify everything is cleared
SELECT COUNT(*) as remaining_profiles FROM Profile;
SELECT COUNT(*) as remaining_applications FROM Application;
