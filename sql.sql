use db;
drop table if exists Document;
drop table if exists Job;
drop table if exists Client;
drop table if exists User;

-- 2 == normal user
create table `User` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` varchar(255) UNIQUE NOT NULL,
    `email` varchar(255) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    `salt` varchar(255) NOT NULL,
    `role` INT NOT NULL DEFAULT 2,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL
) ENGINE=INNODB;

create table `Client`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) UNIQUE NOT NULL,
    `description` varchar(255) NOT NULL,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL
) ENGINE=INNODB;

create table `Job` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `clientId` INT NOT NULL,
    `title` varchar(255) DEFAULT "",
    `category` varchar(255) DEFAULT "",
    `description` varchar(800) DEFAULT "",
    `address` varchar(255) DEFAULT "",
    `date` datetime NOT NULL,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL,

    FOREIGN KEY (`userId`) REFERENCES User(`id`),
    FOREIGN KEY (`clientId`) REFERENCES Client(`id`) 
) ENGINE=INNODB;

create table `Document`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `clientId` INT NOT NULL,
    `s3Url` varchar(255) NOT NULL,
    `createdAt` datetime DEFAULT NOW(),
    `updatedAt` datetime DEFAULT NULL
) ENGINE=INNODB;


insert into User VALUES(null, "bcrowthe", 'bcrowthe11@gmail.com', '32bb54f1d248294478ced15ce32a34437f328b3f32db9fa2cd4b9e6b629a5dbd', 'oME/5Y1WpBcwYkmft/NSOw==', 1, NOW(), null);