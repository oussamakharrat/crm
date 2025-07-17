-- SQL Script to add profile picture column to userdetails table
-- This script adds an 'avatar' column to store user profile picture URLs

-- Add the avatar column to the userdetails table
ALTER TABLE `userdetails` 
ADD COLUMN `avatar` VARCHAR(500) DEFAULT NULL COMMENT 'URL or path to user profile picture' 
AFTER `address`;

-- Optional: Add an index for better performance when querying by avatar
-- CREATE INDEX `idx_userdetails_avatar` ON `userdetails` (`avatar`);

-- Optional: Update existing users with default avatar paths (uncomment if needed)
-- UPDATE `userdetails` SET `avatar` = '/phoenix/v1.20.1/assets/img/team/72x72/guest.webp' WHERE `avatar` IS NULL;

-- Verify the column was added successfully
DESCRIBE `userdetails`; 