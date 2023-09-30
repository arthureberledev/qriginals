/** 
* 
* CREATIONS
* 
*/
create table creations (
    -- ID for the creation
    id uuid default uuid_generate_v4() primary key, 
    -- UUID from auth.users 
    user_id uuid references auth.users not null,
    -- Name of the creation
    name text not null,
    -- Amount of likes the creation has
    like_count integer default 0 check (like_count >= 0),
    -- Amount of times the creation has been used
    use_count integer default 0 check (use_count >= 0),
    -- Set of key-value pairs, used to store the parameters of the creation in a structured format
    parameters jsonb not null,
    -- Time at which the creation was created
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table creations enable row level security;
create policy "Can view all creations." on creations for select using (true);
create policy "Can create, update and delete own creation." on creations for all using (auth.uid() = user_id);

/** 
* 
* LIKES TABLE
* 
*/
CREATE TABLE likes (
    id serial primary key,
    user_id uuid references auth.users not null,
    creation_id uuid references creations (id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view all likes." ON likes 
    FOR SELECT 
    USING (true);
CREATE POLICY "Can insert own likes." ON likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can update own likes." ON likes
    FOR UPDATE
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can delete own likes." ON likes
    FOR DELETE
    USING (auth.uid() = user_id);    

-- Trigger function that increments creation likes
CREATE OR REPLACE FUNCTION public.increment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE creations
    SET like_count = (
        SELECT count(*)
        FROM likes
        WHERE likes.creation_id = new.creation_id
    )
    WHERE id = new.creation_id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger the function every time a user adds an entry to the likes table
CREATE TRIGGER on_user_like
AFTER INSERT ON likes
FOR EACH ROW EXECUTE PROCEDURE public.increment_likes_count();

-- Trigger function that decrements the value in the 'like_count' column in the 'creations' table
CREATE OR REPLACE FUNCTION public.decrement_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE creations
    SET like_count = (
        SELECT count(*)
        FROM likes
        WHERE likes.creation_id = old.creation_id
    )
    WHERE id = old.creation_id;
    RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger the function every time a user unliked / deleted a creation in the `likes` table
CREATE TRIGGER on_user_unlike
AFTER DELETE ON likes
FOR EACH ROW EXECUTE PROCEDURE public.decrement_likes_count();


/** 
* 
* USES TABLE
* 
*/
CREATE TABLE uses (
    id serial primary key,
    user_id uuid references auth.users not null,
    creation_id uuid references creations(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE uses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view all uses." ON uses 
    FOR SELECT 
    USING (true);
CREATE POLICY "Can insert own uses." ON uses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can update own uses." ON uses
    FOR UPDATE
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Can delete own uses." ON uses
    FOR DELETE
    USING (auth.uid() = user_id);    

-- Trigger function that increments creation uses
CREATE OR REPLACE FUNCTION public.increment_uses_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE creations
    SET use_count = (
        SELECT count(*)
        FROM uses
        WHERE uses.creation_id = new.creation_id
    )
    WHERE id = new.creation_id;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

-- Trigger the function every time a user adds an entry to the uses table
CREATE TRIGGER on_user_use
AFTER INSERT ON uses
FOR EACH ROW EXECUTE PROCEDURE public.increment_uses_count();
