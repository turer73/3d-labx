ALTER TABLE maker_profiles ADD COLUMN contact_discord TEXT;
ALTER TABLE maker_profiles ADD COLUMN contact_telegram TEXT;
ALTER TABLE maker_profiles ADD COLUMN contact_instagram TEXT;
ALTER TABLE maker_profiles ADD COLUMN contact_email TEXT;

UPDATE maker_profiles SET contact_discord = 'turer#1234' WHERE user_id = 7;
UPDATE maker_profiles SET contact_telegram = '@aloneangel3d' WHERE user_id = 3;
UPDATE maker_profiles SET contact_email = 'fatih@example.com' WHERE user_id = 6;
UPDATE maker_profiles SET contact_instagram = '@sevde_3d' WHERE user_id = 11;
