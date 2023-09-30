ALTER TABLE users
ADD COLUMN user_name TEXT;

ALTER TABLE users
ADD CONSTRAINT user_name_unique UNIQUE (user_name);

ALTER TABLE users
ADD CONSTRAINT username_length CHECK (char_length(user_name) >= 3);

CREATE VIEW public_user_data AS
SELECT id, full_name, avatar_url, user_name
FROM users;