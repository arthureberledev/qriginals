insert into
storage.buckets (id, name, public, avif_autodetection)
values
('uploads', 'uploads', TRUE, FALSE);

/**
 * DUMMY PRODUCTS:
 */
-- INSERT INTO products (id, active, name, description, image, metadata)
-- VALUES 
-- ('prod_OMhhHdXufiaqxP', true, '15 Credits', '15 Credits to create unique QR Codes', NULL, '{"index": "1"}'),
-- ('prod_OMhixTwS170nWm', true, '50 Credits', '50 Credits to create unique QR Codes', NULL, '{"index": "2"}'),
-- ('prod_OMhjllpAhltcOy', true, '100 Credits', '100 Credits to create unique QR Codes', NULL, '{"index": "3"}');

-- INSERT INTO prices 
-- (id, product_id, active, description, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
-- VALUES 
-- ('price_1NZyIUCbRcXmLvgfjCSabetr', 'prod_OMhhHdXufiaqxP', true, NULL, 500, 'usd', 'one_time', NULL, NULL, NULL, '{}'),
-- ('price_1NZyJFCbRcXmLvgfHiNGZ5x6', 'prod_OMhixTwS170nWm', true, NULL, 1000, 'usd', 'one_time', NULL, NULL, NULL, '{}'),
-- ('price_1NZyK6CbRcXmLvgfQBva0pFO', 'prod_OMhjllpAhltcOy', true, NULL, 1500, 'usd', 'one_time', NULL, NULL, NULL, '{}');

/**
 * DUMMY SUBSCRIPTIONS:
 */
-- INSERT INTO products (id, active, name, description, image, metadata)
-- VALUES 
-- ('prod_OLIvLUK90k1XN5', true, 'Starter', '25 Creations per Week', NULL, '{"index": "1"}'),
-- ('prod_OLIw9TATWLYDIn', true, 'Premium', '50 Creations per Week', NULL, '{"index": "2"}'),
-- ('prod_OLJAFmlBPlCdgK', true, 'Enterprise', 'Unlimited Creations', NULL, '{"index": "3"}');
-- INSERT INTO prices 
-- (id, product_id, active, description, unit_amount, currency, type, interval, interval_count, trial_period_days, metadata)
-- VALUES 
-- ('price_1NYcYACbRcXmLvgfPFSmYEvv', 'prod_OLJAFmlBPlCdgK', true, NULL, 25000, 'usd', 'recurring', 'year', 1, NULL, '{}'),
-- ('price_1NYcYACbRcXmLvgfqum6r3qV', 'prod_OLJAFmlBPlCdgK', true, NULL, 2500, 'usd', 'recurring', 'month', 1, NULL, '{}'),
-- ('price_1NYcKfCbRcXmLvgfvjSLSsKy', 'prod_OLIw9TATWLYDIn', true, NULL, 10000, 'usd', 'recurring', 'year', 1, NULL, '{}'),
-- ('price_1NYcKeCbRcXmLvgfSMuIpEMr', 'prod_OLIw9TATWLYDIn', true, NULL, 1000, 'usd', 'recurring', 'month', 1, NULL, '{}'),
-- ('price_1NYcJtCbRcXmLvgf3PJqzvs8', 'prod_OLIvLUK90k1XN5', true, NULL, 5000, 'usd', 'recurring', 'year', 1, NULL, '{}'),
-- ('price_1NYcJtCbRcXmLvgfK5bONjKM', 'prod_OLIvLUK90k1XN5', true, NULL, 500, 'usd', 'recurring', 'month', 1, NULL, '{}');
