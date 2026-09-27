create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  location text default 'Abakaliki',
  avatar_url text,
  is_verified boolean default false,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Profiles are publicly readable"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create table if not exists categories (
  id serial primary key,
  name text not null unique,
  icon text not null
);

alter table categories enable row level security;

create policy "Categories are publicly readable"
  on categories for select
  using (true);

insert into categories (name, icon) values
  ('Electronics','📱'), ('Phones & Accessories','📞'), ('Fashion','👗'),
  ('Beauty','💄'), ('Food','🍲'), ('Agriculture','🌾'), ('Home & Furniture','🛋️'),
  ('Vehicles','🚗'), ('Real Estate','🏠'), ('Services','🛠️'), ('Jobs','💼'),
  ('Sports','⚽'), ('Health & Wellness','🩺'), ('Other','✨')
on conflict (name) do nothing;

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  category_id int references categories(id),
  title text not null,
  description text,
  price numeric not null check (price >= 0),
  location text not null,
  image_url text,
  status text not null default 'active' check (status in ('active','sold','hidden')),
  created_at timestamp with time zone default now()
);

alter table listings enable row level security;

create policy "Active listings are publicly readable"
  on listings for select
  using (status = 'active' or seller_id = auth.uid());

create policy "Users can create their own listings"
  on listings for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own listings"
  on listings for update
  using (auth.uid() = seller_id);

create policy "Users can delete their own listings"
  on listings for delete
  using (auth.uid() = seller_id);

create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade,
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamp with time zone default now(),
  primary key (user_id, listing_id)
);

alter table favorites enable row level security;

create policy "Users can view their own favorites"
  on favorites for select
  using (auth.uid() = user_id);

create policy "Users can add their own favorites"
  on favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
  on favorites for delete
  using (auth.uid() = user_id);
