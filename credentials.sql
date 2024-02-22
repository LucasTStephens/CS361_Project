SET FOREIGN_KEY_CHECKS=0;

CREATE OR REPLACE TABLE users (
    id int(11) AUTO_INCREMENT,
    email varchar(255),
    password varchar(255),
    PRIMARY KEY (id)
);

CREATE OR REPLACE TABLE profiles (
    uid int(11) AUTO_INCREMENT,
    email varchar(255),
    name varchar(255),
    description varchar(999),
    favoriteGenre int,
    PRIMARY KEY (email),
    FOREIGN KEY (uid) REFERENCES users(id),
    FOREIGN KEY (favoriteGenre) REFERENCES genres(gid)
);

CREATE OR REPLACE TABLE genres (
    gid int AUTO_INCREMENT,
    gname varchar(255) NOT NULL,
    PRIMARY KEY (gid)
);

CREATE OR REPLACE TABLE shows (
    sid int(11) AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    gid int NOT NULL,
    PRIMARY KEY (sid),
    FOREIGN KEY (gid) REFERENCES genres (gid)
);

CREATE OR REPLACE TABLE profiles_shows (
    id int AUTO_INCREMENT,
    uid int(11) NOT NULL,
    sid int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (uid) REFERENCES profiles (uid),
    FOREIGN KEY (sid) REFERENCES shows (sid)
);

INSERT INTO genres (name)
VALUES ('Action'),
('Comedy'),
('Romance'),
('Horror')
('Sci-Fi');

INSERT INTO shows (name, gid)
VALUES ('Avengers: Endgame', (SELECT gid FROM genres WHERE genres.name = 'Action')),
('10 Things I Hate About You', (SELECT gid FROM genres WHERE genres.name = 'Romance'));

INSERT INTO profiles_shows (uid, sid)
VALUES (1, 1),
(2, 2);

SET FOREIGN_KEY_CHECKS=1;