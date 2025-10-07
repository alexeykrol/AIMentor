-- Create chats table for AI Mentor
create table "public"."chats" (
    "id" text not null,
    "user_id" text null,
    "payload" jsonb
);

CREATE UNIQUE INDEX chats_pkey ON public.chats USING btree (id);

alter table "public"."chats" add constraint "chats_pkey" PRIMARY KEY using index "chats_pkey";

-- Enable RLS (Row Level Security)
alter table "public"."chats" enable row level security;

-- Create policy to allow all operations for anonymous users
create policy "Allow all operations for all users"
on "public"."chats"
as permissive
for all
to public
using (true)
with check (true);