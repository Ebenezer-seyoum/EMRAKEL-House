insert into public.app_users (email, password_hash, name, role)
values (
  'eyob@gmail.com',
  'scrypt:4cfef057bd94f81007cf250f48199b96:38a21f3d1e3b3ee3ef3b0c01195788c757c99fdaf6877c1019b391931d524f99b963b29bb539a88c2257248bb24e67f6b20a6994c8e1edb64c84c523d823ecd7',
  'Eyob Admin',
  'admin'
)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  name = excluded.name,
  role = excluded.role,
  updated_at = now();
