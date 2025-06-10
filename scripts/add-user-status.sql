-- Add status column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Update existing users to have 'approved' status (assuming they were already approved)
UPDATE users SET status = 'approved' WHERE status IS NULL;

-- Create admin user if it doesn't exist
INSERT INTO users (name, email, password_hash, status, image_url)
VALUES (
  'Admin User',
  'admin@soatransplus.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
  'approved',
  'https://avatar.vercel.sh/admin@soatransplus.com'
)
ON CONFLICT (email) DO NOTHING;

-- Create admin user settings
INSERT INTO user_settings (user_id, email_notifications, sms_notifications, dark_mode)
SELECT id, TRUE, FALSE, FALSE
FROM users 
WHERE email = 'admin@soatransplus.com'
ON CONFLICT (user_id) DO NOTHING;
