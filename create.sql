PRAGMA foreign_keys = ON;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE TABLE goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME NOT NULL,
    title TEXT NOT NULL,
    owner TEXT NOT NULL,
    FOREIGN KEY (owner) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME NOT NULL,
    goal_id INTEGER NOT NULL,
    text_content TEXT,
    goal_completed BOOLEAN,
    FOREIGN KEY (goal_id) REFERENCES goals(id)
        ON DELETE CASCADE
);

CREATE TABLE share_records (
    created_at DATETIME NOT NULL,
    goal_id INTEGER NOT NULL,
    shared_with INTEGER NOT NULL,
    accepted BOOLEAN NOT NULL,
    PRIMARY KEY (goal_id, shared_with),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
        ON DELETE CASCADE,
    FOREIGN KEY (shared_with) REFERENCES users(id)
        ON DELETE CASCADE
);