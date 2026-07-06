-- QPay columns for shop_orders

alter table public.shop_orders
  add column if not exists qpay_invoice_id text,
  add column if not exists qpay_sender_invoice_no text;

create unique index if not exists shop_orders_qpay_sender_idx
  on public.shop_orders (qpay_sender_invoice_no)
  where qpay_sender_invoice_no is not null;

create index if not exists shop_orders_qpay_invoice_idx
  on public.shop_orders (qpay_invoice_id)
  where qpay_invoice_id is not null;
