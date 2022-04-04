DROP TABLE IF EXISTS members_organisations;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS organisations;
DROP TABLE IF EXISTS password_reset;
DROP TABLE IF EXISTS members;
DROP TYPE IF EXISTS member_permission;

-- *** MEMBER STUFF *** --
CREATE TYPE member_permission AS ENUM ('admin', 'verified', 'unverified');
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(32) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    username VARCHAR(16) NOT NULL, -- may be ommitted
    password TEXT NOT NULL,
    permission member_permission NOT NULL

    --password. Looking for necessary specs for SHA3-256
    --salt? -||-
    --link to character table for character settings per member
);

CREATE TABLE organisations (
    organisation_id SERIAL PRIMARY KEY,
    organisation_name VARCHAR(64) NOT NULL,
	fk_leader SERIAL REFERENCES members(member_id)
);

CREATE TABLE members_organisations (
    member_id SERIAL REFERENCES members(member_id),
    organisation_id SERIAL REFERENCES organisations(organisation_id),
    PRIMARY KEY (member_id, organisation_id)
);

-- *** FILE STUFF *** --
CREATE TABLE documents(
    document_id SERIAL PRIMARY KEY,
    document_name VARCHAR(128) NOT NULL,
    document_description TEXT,
    public BOOLEAN NOT NULL,
    owner INTEGER,
    filepath VARCHAR,
    FOREIGN KEY(owner) REFERENCES members(member_id)

	-- SERIAL REFERENCES members(member_id)
	
    --categorisation! IMPORTANT, hear with users.
    --constraint for organisation??? Guessing it breaks the normalization, however, it may significantly increase query performance.
);

CREATE TABLE password_reset
(
	timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
	reset_key CHAR(20) PRIMARY KEY, -- Must match passwordResetKeyLength in app.config
	email VARCHAR(64) REFERENCES members(email) NOT NULL UNIQUE
);

-- *** GENERATING EXAMPLE ENTRIES *** --
INSERT INTO members (first_name, last_name, email, username, password, permission)
VALUES ('Test', 'Testy', 'test@test.test', 'tester', '$2b$10$6ODjd7kCmvzZ0tmoOr.hk.QOR13zTFcXdFMtOP4P40IDkrAX0D2Iu', 'admin'),
    ('Tronny', 'Hilly', 'member@member.member', 'Tdog', '$2b$10$6ODjd7kCmvzZ0tmoOr.hk.QOR13zTFcXdFMtOP4P40IDkrAX0D2Iu', 'verified'),
    ('John', 'Smith', 'name@domain', 'Johnny', '$2b$10$6ODjd7kCmvzZ0tmoOr.hk.QOR13zTFcXdFMtOP4P40IDkrAX0D2Iu', 'unverified'),
	('Olli', 'Bolli', 'oliveroloughlin@hotmail.com', 'olli', '$2b$10$6ODjd7kCmvzZ0tmoOr.hk.QOR13zTFcXdFMtOP4P40IDkrAX0D2Iu', 'admin');

INSERT INTO organisations(organisation_name, fk_leader)
VALUES ('University Institution', 1),
    ('Science And Research Center', 2);

INSERT INTO members_organisations (member_id, organisation_id)
VALUES (1, 1),
    (2,2),
    (3,2),
	(4,1);

INSERT INTO documents (document_name, document_description, public, filepath, owner)
VALUES ('Document 1', 'Hocus, pocus. Avada kadavra.', true, 'public/Document.pdf', 1),
    ('Document 2', 'Blablabla, testign testing, another test, hello there yes you hi', true, 'public/Document.pdf', 2),
    ('Doc Oc', 'This doc is verry oc. Simple description, not too long', false, 'public/Document.pdf', 1),
    ('A Document Of Great Importance', 'Should be first in sorted list. This is a test document, and this is the description. A document description may be quite long, perhaps over 100 characters. Therefore it might be desireable to cut the contents when displayed on the website in a card. Maybe this limit should be at about 200 characters, but that is why we have this test', false, 'public/Document.pdf', 2),
    ('File copy 1', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', false, 'public/Document.pdf', 1),
    ('File copy 2', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 3),
    ('File copy 3', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 1),
    ('File copy 4', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 4),
    ('File copy 5', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', false, 'public/Document.pdf', 2),
    ('File copy 6', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', false, 'public/Document.pdf', 3),
    ('File copy 7', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 2),
    ('File copy 8', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', false, 'public/Document.pdf', 1),
    ('File copy 9', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 1),
    ('File copy 10', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', true, 'public/Document.pdf', 3),
    ('File copy 11', 'This is a copy of a file. There are many files like this indeed. I need it to do some testing. Help me test my html and css styling. May we have grade A for our work please?', false, 'public/Document.pdf', 4);