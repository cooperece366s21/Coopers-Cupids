create table if not exists users (
    userID varchar(32) primary key not null,
    password varchar(256) not null,
    hasProfile bool not null,
);

create table if not exists profiles (
    userID varchar(32) primary key not null,
    name varchar(256) not null,
    age int,
    photo varchar(256),
    bio text(4096),
    location varchar(256),
    interests varchar(1028),
    foreign key (userID) references users(userID)
);

-- Not sure how to connect conversations and messages databases
create table if not exists conversations (
    user1 varchar(32) not null,
    user2 varchar(32) not null,
    primary key (user1, user2),
    foreign key (user1) references users(userID),
    foreign key (user2) references users(userID)
);

create table if not exists messages (
    from_userID varchar(32) not null,
    to_userID varchar(32) not null,
    messageType enum('TEXT', 'IMAGE', 'GIF') not null,
    messageText text(4096) not null,
    timestamp DATETIME not null,
    foreign key (senderID) references users(userID)
);

create table if not exists likes_dislikes (
    from_userID varchar(32) not null,
    to_userID varchar(32) not null,
    like_dislike enum('NONE', 'LIKE', 'DISLIKE'),
    primary key (from_userID, to_userID),
    foreign key (from_userID) references users(userID),
    foreign key (to_userID) references users(userID)
);

