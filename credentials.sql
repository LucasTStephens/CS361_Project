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
    PRIMARY KEY (email),
    FOREIGN KEY (uid) REFERENCES users(id)
);