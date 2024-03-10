CREATE DATABASE lunchflow;


--set extension
CREATE TABLE users (user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), user_name VARCHAR(255) NOT NULL,  user_email VARCHAR(255) NOT NULL,user_password VARCHAR(255) NOT NULL );

---insert users

INSERT INTO USERS (user_name, user_email, user_password) VALUES ('test', 'test@test.com', 'test');