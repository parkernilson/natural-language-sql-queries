pragma foreign_keys = on;

create table users (
id integer primary key autoincrement,
first_name text not null,
last_name text not null,
email text not null
);

create table goals (
id integer primary key autoincrement,
created_at datetime not null,
title text not null,
owner text not null,
foreign key (owner) references users(id)
on delete cascade
);

create table entries (
id integer primary key autoincrement,
created_at datetime not null,
goal_id integer not null,
text_content text,
goal_completed boolean,
foreign key (goal_id) references goals(id)
on delete cascade
);

create table share_records (
created_at datetime not null,
goal_id integer not null,
shared_with integer not null,
accepted boolean not null,
primary key (goal_id, shared_with),
foreign key (goal_id) references goals(id)
on delete cascade,
foreign key (shared_with) references users(id)
on delete cascade
);