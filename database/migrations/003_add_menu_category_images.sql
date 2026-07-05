alter table public.menu_categories
  add column if not exists image_url text;

update public.menu_categories
set image_url = '/uploads/house/menu-board-reference.jpg'
where image_url is null;
