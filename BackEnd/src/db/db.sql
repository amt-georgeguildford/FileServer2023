-- Create Database
CREATE DATABASE coradineUser;

-- Download uuid for id
CREATE EXTENSION 'uuid-ossp';
-- Create TABLE
CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(150) NOT NULL,
    role TEXT,
    token TEXT 
);


CREATE TABLE files(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id uuid,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    filename TEXT NOT NULL,
    file TEXT NOT NULL,
    CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


CREATE TABLE Resets(
    resetid SERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL,
    token TEXT
);


CREATE TABLE email_sent(
    sent_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id uuid,
    file_id uuid,
    email TEXT,
    ts TIMESTAMP,
    CONSTRAINT fk_file
    FOREIGN KEY(file_id)
    REFERENCES files(id)
    ON DELETE SET NULL,
    CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);


CREATE TABLE downloads(
    download_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    file_id uuid,
    user_id uuid,
    ts TIMESTAMP,
    email TEXT,
    CONSTRAINT dl_file
    FOREIGN KEY(file_id)
    REFERENCES files(id)
    ON DELETE SET NULL,
    CONSTRAINT dl_user
    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);


WITH download_num AS(
    SELECT file_id, COUNT(file_id) AS downloads FROM downloads GROUP BY file_id
),
email_sent_num AS(
    SELECT file_id, COUNT(file_id) AS email_sent FROM email_sent GROUP BY file_id
)
SELECT files.id, 
    files.title, 
    files.description, 
    files.filename, 
    files.file,
    COALESCE(download_num.downloads,0) AS downloads,
    COALESCE(email_sent_num.email_sent,0) AS email_sent
FROM files 
LEFT JOIN download_num 
ON download_num.file_id=files.id
LEFT JOIN email_sent_num
ON email_sent_num.file_id=files.id;

-- Full Text Search
WITH download_num AS(
    SELECT file_id, COUNT(file_id) AS downloads FROM downloads GROUP BY file_id
),
email_sent_num AS(
    SELECT file_id, COUNT(file_id) AS email_sent FROM email_sent GROUP BY file_id
)
SELECT files.id, 
    files.title, 
    files.description, 
    files.filename, 
    files.file,
    COALESCE(download_num.downloads,0) AS downloads,
    COALESCE(email_sent_num.email_sent,0) AS email_sent
FROM files 
LEFT JOIN download_num 
ON download_num.file_id=files.id
LEFT JOIN email_sent_num
ON email_sent_num.file_id=files.id
WHERE to_tsvector(title) @@ to_tsquery('Sec');

-- Character Search
WITH download_num AS(
    SELECT file_id, COUNT(file_id) AS downloads FROM downloads GROUP BY file_id
),
email_sent_num AS(
    SELECT file_id, COUNT(file_id) AS email_sent FROM email_sent GROUP BY file_id
)
SELECT files.id, 
    files.title, 
    files.description, 
    files.filename, 
    files.file,
    COALESCE(download_num.downloads,0) AS downloads,
    COALESCE(email_sent_num.email_sent,0) AS email_sent
FROM files 
LEFT JOIN download_num 
ON download_num.file_id=files.id
LEFT JOIN email_sent_num
ON email_sent_num.file_id=files.id
WHERE title ILIKE '%sec%';

SELECT email FROM email_sent WHERE file_id='aca2cfb0-e868-4724-9f24-ffdcf0496cee';

-- email sent list for a file
SELECT users.firstname,users.lastname, email_sent.email,email_sent.ts FROM email_sent
JOIN users ON users.id=email_sent.user_id
WHERE file_id='93d4f6d7-e3b4-44af-8883-38bc5d9a2e50'; 

SELECT files.file AS link, files.filename FROM email_sent
JOIN files 
ON email_sent.file_id=id
WHERE email_sent.file_id= '05a2c348-6d99-4a8c-8b82-2c592b55ef53'
LIMIT 1;

SELECT id, firstname, lastname FROM users
ORDER BY firstname, lastname, id;



CREATE DATABASE kanban

CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);


CREATE TABLE columns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE
);


CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    description TEXT,
    status VARCHAR(100),
    column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE
);


CREATE TABLE subtasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    isCompleted BOOLEAN,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE
);