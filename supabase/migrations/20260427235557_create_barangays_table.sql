-- Create barangays table
create table barangays (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  coordinates jsonb not null,
  cases_2015 int,
  cases_2016 int,
  cases_2017 int,
  cases_2018 int,
  cases_2019 int,
  cases_2020 int,
  cases_2021 int,
  cases_2022 int,
  cases_2023 int,
  cases_2024 int,
  cases_2025 int,
  created_at timestamp default now()
);

-- Enable RLS
alter table barangays enable row level security;

-- Public read policy
create policy "Public can read barangays"
  on barangays for select
  using (true);

-- Seed data
insert into barangays (name, coordinates, cases_2015, cases_2016, cases_2017, cases_2018, cases_2019, cases_2020, cases_2021, cases_2022, cases_2023, cases_2024, cases_2025) values

('Puntod', '[[124.6600,8.4400],[124.6800,8.4400],[124.6800,8.4600],[124.6600,8.4600],[124.6600,8.4400]]',
  null, null, null, null, null, null, 43, 51, 68, 60, 55),

('Lapasan', '[[124.6100,8.4250],[124.6300,8.4250],[124.6300,8.4450],[124.6100,8.4450],[124.6100,8.4250]]',
  null, null, null, null, 62, 46, 41, 51, 50, 53, 49),

('Brgy 26, 25, 22, 21', '[[124.6270,8.4670],[124.6490,8.4670],[124.6490,8.4850],[124.6270,8.4850],[124.6270,8.4670]]',
  37, 23, 19, 23, 19, 13, 24, 16, 15, 31, 26),

('Iponan', '[[124.6000,8.5100],[124.6200,8.5100],[124.6200,8.5300],[124.6000,8.5300],[124.6000,8.5100]]',
  28, 32, 38, 46, 35, 50, 29, 48, 39, 52, 65),

('Carmen', '[[124.6000,8.4500],[124.6200,8.4500],[124.6200,8.4700],[124.6000,8.4700],[124.6000,8.4500]]',
  null, null, 157, 156, 149, 109, 116, 169, 149, 135, 140),

('Cugman', '[[124.6100,8.5000],[124.6300,8.5000],[124.6300,8.5200],[124.6100,8.5200],[124.6100,8.5000]]',
  null, null, null, null, null, null, 47, 69, 68, 65, 54),

('Gusa', '[[124.6300,8.4900],[124.6500,8.4900],[124.6500,8.5100],[124.6300,8.5100],[124.6300,8.4900]]',
  68, 67, 63, 71, 61, 51, 28, 51, 52, 43, 88),

('Kauswagan and NHA', '[[124.6300,8.4300],[124.6550,8.4300],[124.6550,8.4550],[124.6300,8.4550],[124.6300,8.4300]]',
  null, null, null, null, null, null, null, 63, 94, 79, 75),

('Bulua', '[[124.6400,8.4700],[124.6600,8.4700],[124.6600,8.4900],[124.6400,8.4900],[124.6400,8.4700]]',
  57, 53, 84, 85, 79, 57, 65, 83, 59, 56, 61),

('Macabalan', '[[124.6500,8.4800],[124.6700,8.4800],[124.6700,8.5000],[124.6500,8.5000],[124.6500,8.4800]]',
  34, 31, 32, 37, 35, 27, 42, 38, 39, 45, 38);
