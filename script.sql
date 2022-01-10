-- *** MEMBER STUFF *** --

DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS organisations;
DROP TABLE IF EXISTS documents;

-- not called user, because user is reserved(???)
CREATE TABLE members (
    member_id   INTEGER     PRIMARY KEY,
    first_name  VARCHAR(64) NOT NULL,
    last_name   VARCHAR(32) NOT NULL,
    email       VARCHAR(64) NOT NULL,
    username    VARCHAR(16) NOT NULL, -- may be ommitted
    --password. Looking for necessary specs for SHA3-256
    --salt? -||-
    
    --link to character table for character settings per member

    CONSTRAINT fk_organisation
        FOREIGN KEY(organisation_id)
        REFERENCES organisation(organisation_id)
        ON DELETE SET NULL
);

CREATE TABLE organisations (
    organisation_id     INTEGER     PRIMARY KEY,
    organisation_name   VARCHAR(64) NOT NULL,

    CONSTRAINT fk_leader
        FOREIGN KEY(member_id)
        REFERENCES member(member_id)
        NOT NULL
);


-- *** FILE STUFF *** --

CREATE TABLE documents(
    document_id             INTEGER         PRIMARY,
    document_url            VARCHAR(256)    NOT NULL,
    document_name           VARCHAR(128)    NOT NULL,
    document_description    TEXT,
    --categorisation! IMPORTANT, hear with users.

    CONSTRAINT fk_publisher
        FOREIGN KEY(member_id)
        NOT NULL,

    --constraint for organisation??? Guessing it breaks the normalization, however, it may significantly increase query performance.
);