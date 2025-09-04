-- Contact form submissions table
create table if not exists contact_submissions (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    message text not null,
    support_email text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    status text default 'pending' check (status in ('pending', 'responded', 'archived')),
    response_notes text,
    responded_at timestamp with time zone
);
