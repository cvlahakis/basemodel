DROP TABLE IF EXISTS part;

CREATE TABLE part (
	_id int UNSIGNED NOT NULL AUTO_INCREMENT,
	number varchar(10) NOT NULL,
	name varchar(50) NOT NULL,
	createdAt DATETIME NOT NULL,
	updatedAt DATETIME NOT NULL,
	_state TINYINT NOT NULL,
	PRIMARY KEY (`_id`),
	UNIQUE (`number`)
);
