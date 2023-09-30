-- Credits each user has are tracked here. 
-- Credits get incremented by purchase and decremented with each generation
CREATE TABLE credits (
    user_id uuid references users(id) primary key,
    amount integer default 0 check (amount >= 0)
);
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view and update own credits" 
ON credits FOR ALL USING (auth.uid() = user_id);

-- Track purchases as well as the spendings of the credits
CREATE TYPE transaction_type as enum ('initial', 'purchase', 'spend', 'refund');
CREATE TABLE transactions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    type transaction_type not null,
    -- Amount of credits
    amount integer not null check (amount >= 0),
    -- Date of the transaction/spending
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Can view own transactions" 
ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Can insert own transactions" 
ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Replace function from initial schema
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, user_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'user_name');
  INSERT INTO public.credits (user_id, amount)
  VALUES (new.id, 15); -- Assign credits to new user
  INSERT INTO public.transactions (user_id, type, amount) 
  VALUES (new.id, 'initial', 15);
  return new;
END;
$$ LANGUAGE plpgsql security definer;

-- Functions to increment and decrement credits

CREATE OR REPLACE FUNCTION public.increment_credits_by_amount(user_id_input UUID, purchased_amount SMALLINT) 
RETURNS void 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE credits SET amount = amount + purchased_amount WHERE user_id = user_id_input;
    INSERT INTO transactions (user_id, type, amount) VALUES (user_id_input, 'purchase', purchased_amount);
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_credit(user_id_input UUID) 
RETURNS void 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE credits SET amount = amount + 1 WHERE user_id = user_id_input;
    INSERT INTO transactions (user_id, type, amount) VALUES (user_id_input, 'refund', 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_credits_by_one(user_id_input UUID) 
RETURNS void 
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE credits SET amount = amount - 1 WHERE user_id = user_id_input;
    INSERT INTO transactions (user_id, type, amount) VALUES (user_id_input, 'spend', 1);
END;
$$;

