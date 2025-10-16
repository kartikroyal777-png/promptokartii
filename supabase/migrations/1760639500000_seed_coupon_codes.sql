/*
# [Data] Seed Coupon Codes
This operation inserts a predefined set of coupon codes into the `coupon_codes` table. These codes can be redeemed by users to gain credits.

## Query Description:
This is a safe data insertion operation. It adds new rows to the `coupon_codes` table. It will not affect any existing data. If any of these coupon codes already exist, the `ON CONFLICT (code) DO NOTHING` clause will prevent errors and simply skip the insertion for that specific code.

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (can be deleted manually)

## Structure Details:
- Table: `public.coupon_codes`
- Columns affected: `code`, `credits`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: No
- Auth Requirements: None for this script.

## Performance Impact:
- Indexes: Uses primary key index for conflict resolution.
- Triggers: None
- Estimated Impact: Negligible.
*/
INSERT INTO public.coupon_codes (code, credits) VALUES
('KARTIKIQ100', 100),
('KARTIKIQ110', 110),
('KARTIKIQ120', 120),
('KARTIKIQ130', 130),
('KARTIKIQ140', 140),
('KARTIKIQ150', 150),
('KARTIKIQ160', 160),
('KARTIKIQ170', 170),
('KARTIKIQ180', 180),
('KARTIKIQ190', 190),
('KARTIKIQ200', 200)
ON CONFLICT (code) DO NOTHING;
