alter table public.menu_categories
  add column if not exists menu_side text not null default 'food'
  check (menu_side in ('food', 'drinks'));

update public.menu_categories
set menu_side = 'drinks'
where lower(coalesce(slug, '') || ' ' || coalesce(name, '') || ' ' || coalesce(description, '')) ~
  '(drink|shake|mojito|cocktail|juice|coffee|tea)';

update public.menu_categories
set menu_side = 'food'
where menu_side is null;
