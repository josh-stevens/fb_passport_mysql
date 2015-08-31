CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255),
  password VARCHAR(255),
  facebook_id VARCHAR(255),
  facebook_token VARCHAR(255),
  facebook_name VARCHAR(255),
  facebook_email VARCHAR(255),
  PRIMARY KEY (id)
);