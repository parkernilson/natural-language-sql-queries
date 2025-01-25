const usersTableHeader = `create table users (
id integer primary key autoincrement,
first_name text not null,
last_name text not null,
email text not null
);`

const usersRowExamples = `/*
3 example rows :
select * from users limit 3;
id first_name last_name email
1 John Doe johndoe@gmail.com
2 Guy Montgommery guy234@hotmail.net
3 Brody Jameson secretman918@mail.com
*/`

const goalsTableHeader = `create table goals (
id integer primary key autoincrement,
created_at datetime not null,
title text not null,
owner text not null,
foreign key (owner) references users(id)
on delete cascade
);`

const goalsRowExamples = `/*
3 example rows :
select * from goals limit 3;
id created_at title owner
1 2022-01-01 12:23:52 'Lose 10 pounds' 1
2 2022-01-02 20:18:12 'Learn to play guitar' 2
3 2022-01-03 03:51:37 'Write a novel' 3
*/`

const entriesTableHeader = `create table entries (
id integer primary key autoincrement,
created_at datetime not null,
goal_id integer not null,
text_content text,
goal_completed boolean,
foreign key (goal_id) references goals(id)
on delete cascade
);`

const entriesRowExamples = `/*
3 example rows :
select * from entries limit 3;
id created_at goal_id text_content goal_completed
1 2022-01-02 14:23:52 1 'Lost 2 pounds this week!' true
2 2022-01-03 08:18:12 2 'Learned to play G chord' true
3 2022-01-04 19:51:37 3 'Didn\'t have time to write today' false
*/`

const shareRecordsTableHeader = `create table share_records (
created_at datetime not null,
goal_id integer not null,
shared_with integer not null,
accepted boolean not null,
primary key (goal_id, shared_with),
foreign key (goal_id) references goals(id)
on delete cascade,
foreign key (shared_with) references users(id)
on delete cascade
);`

const shareRecordsRowExamples = `/*
3 example rows :
select * from share_records limit 3;
created_at goal_id shared_with accepted
2022-01-02 14:23:52 1 2 true
2022-01-03 08:18:12 2 3 true
2022-01-04 19:51:37 3 1 false
*/`

const directions = `-- Using valid SQLite , answer the following
questions for the tables provided above . Include nothing in the answer but a single valid sql query and no comments .`

const nlq_sql_pairs = `Question: What is Kyle Davis' email address?
select email from users where first_name = 'Kyle' and last_name = 'Davis';
Question: Return the first name of each user that has accepted an invitation from user with id 1.
select u.first_name from users as u join share_records as sr on u.id = sr.shared_with where sr.accepted = 1 join goals as g on sr.goal_id = g.id where g.owner = 1;
Question: Show the title of every goal that was created after Feb 1, 2022.
select title from goals where created_at > '2022-02-01';`

const promptHeader = `
${usersTableHeader}
${usersRowExamples}

${goalsTableHeader}
${goalsRowExamples}

${entriesTableHeader}
${entriesRowExamples}

${shareRecordsTableHeader}
${shareRecordsRowExamples}

${directions}

${nlq_sql_pairs}`

export const buildSQLPrompt = (prompt: string): string => {
    return `${promptHeader}\nQuestion: ${prompt}`;
}

export const buildExplainResultsPrompt = (prompt: string, answer: string): string => {
    return `Given the following prompt:
${prompt}

Translate the following JSON result into a human-readable explanation (without referencing the prompt or the answer):
${answer}`
}