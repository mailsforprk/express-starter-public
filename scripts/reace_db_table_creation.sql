-- Create role table
CREATE TABLE `role` (
`role_id`       INT           NOT NULL AUTO_INCREMENT,
`code`          VARCHAR(50)   NOT NULL, 
`description`   VARCHAR(50)   NOT NULL,
 PRIMARY KEY  (`role_id`)
) ENGINE=MyISAM;


-- Create user table
CREATE TABLE `user` (
  `user_id`            INT           NOT NULL AUTO_INCREMENT,
  `first_name`         VARCHAR(50)   NOT NULL,
  `last_name`          VARCHAR(50)   NOT NULL,
  `email`              VARCHAR(100)  NOT NULL,
  `password`           VARCHAR(50)   NOT NULL, 
  `mob_phone`          VARCHAR(100),
  `address_1`          VARCHAR(100),
  `address_2`          VARCHAR(100),
  `city`               VARCHAR(100),
  `postal_code`        VARCHAR(100),
  `country`            VARCHAR(100),
  `role_id`            INT           NOT NULL default '1',
  PRIMARY KEY  (`user_id`),
  UNIQUE KEY `idx_user_email` (`email`)
) ENGINE=MyISAM;
 
INSERT INTO `role`  (`code`,`description` ) VALUES  
                    ('PO', 'Property Owner'),
                    ('TM','Top Management'),
                    ('PM','Property Manager'),
                    ('ADMIN','Admin'),
                    ('GUEST','Guest');

INSERT INTO `user` ( `first_name` , `last_name`,  `email`,  `password`,  `address_1` ,   `address_2` , `city` ,  `postal_code`, `country`,  `role_id`  ) VALUES
                   ('John','Papa','jpapa@msoutlook.com','Jpapapa','South Draw','Col 1','NY','2314','USA',1),
                   ('Sam','Remed','sremed@msoutlook.com','reSame','Noth Block','Welledy','RI','02903','USA',1);



