CREATE OR REPLACE TABLE users (
    id int(11) AUTO_INCREMENT,
    email varchar(255),
    password varchar(255),
    PRIMARY KEY (id)
);

CREATE OR REPLACE TABLE profiles (
    uid int,
    email varchar(255),
    name varchar(255),
    description varchar(999),
    favoriteGenre int,
    PRIMARY KEY (email),
    FOREIGN KEY (uid) REFERENCES users(id),
    FOREIGN KEY (favoriteGenre) REFERENCES genres(gid)
);

CREATE OR REPLACE TABLE genres (
    gid int,
    name varchar(255) NOT NULL,
    PRIMARY KEY (gid)
);

CREATE OR REPLACE TABLE shows (
    sid int,
    name varchar(255) NOT NULL,
    gid int NOT NULL,
    PRIMARY KEY (sid),
    FOREIGN KEY (gid) REFERENCES genres (gid)
);