alter table public.shop_orders
  add column if not exists payment_sms_sent_at timestamptz;
