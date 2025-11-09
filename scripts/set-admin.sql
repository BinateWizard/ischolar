-- Run this SQL query in your MySQL database to set your account as ADMIN
-- Admins, Reviewers, and Approvers are automatically verified and don't need the verification process

UPDATE profiles 
SET role = 'ADMIN', 
    verification_status = 'VERIFIED'
WHERE email = 'aezravito12@gmail.com';

-- Verify the update
SELECT id, email, role, verification_status FROM profiles WHERE email = 'aezravito12@gmail.com';
