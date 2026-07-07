-- QPay payment fields for appointments + AWAITING_PAYMENT status

do $$
begin
  if exists (select 1 from pg_type where typname = 'appointment_status') then
    if not exists (
      select 1
      from pg_enum e
      join pg_type t on e.enumtypid = t.oid
      where t.typname = 'appointment_status'
        and e.enumlabel = 'AWAITING_PAYMENT'
    ) then
      alter type appointment_status add value 'AWAITING_PAYMENT';
    end if;
  end if;
end $$;

alter table public.appointments
  add column if not exists price_mnt integer,
  add column if not exists subtotal_mnt integer,
  add column if not exists discount_mnt integer not null default 0,
  add column if not exists promo_id uuid references public.promo_codes (id) on delete set null,
  add column if not exists qpay_invoice_id text,
  add column if not exists qpay_sender_invoice_no text,
  add column if not exists payment_sms_sent_at timestamptz;

create index if not exists appointments_qpay_invoice_idx
  on public.appointments (qpay_invoice_id)
  where qpay_invoice_id is not null;
