-- ============================================================
-- 考研复习网站 · Supabase 云同步建表脚本
-- 在 Supabase 控制台 → SQL Editor 中粘贴并运行一次即可
-- 两张表：today_status（今日状态/计划）+ study_data（学习记录）
-- ============================================================

-- 1) 今日状态 / 每日计划表
create table if not exists today_status (
  user_id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);
alter table today_status enable row level security;
drop policy if exists "anyone" on today_status;
create policy "anyone" on today_status for all using (true) with check (true);

-- 2) 学习记录表
create table if not exists study_data (
  user_id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);
alter table study_data enable row level security;
drop policy if exists "anyone" on study_data;
create policy "anyone" on study_data for all using (true) with check (true);

-- 完成！接下来到 Settings → API 复制 Project URL 和 anon public key，填入前端 .env
