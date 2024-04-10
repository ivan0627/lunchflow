CREATE DATABASE lunchflow;


--create extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--set extension
CREATE TABLE users (user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_name VARCHAR(255) NOT NULL,  user_email VARCHAR(255) NOT NULL,user_password VARCHAR(255) NOT NULL, role varchar(255) DEFAULT 'employee' );




--- Create menu table

create table menus (
menu_id SERIAL PRIMARY KEY, 
user_id uuid not null,
user_name varchar(255) not null,
user_email varchar(255) not null,

creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
menu_date date not null,
menu_title varchar(255) not null,
menu_description varchar (1000) not null,
menu_drink varchar(255) not null,

	option_1 varchar(50),
	option_2 varchar(50),
	option_3 varchar(50),
	option_4 varchar(50),
	option_5 varchar(50),
	option_6 varchar(50),
	option_7 varchar(50),
	option_8 varchar(50),
	option_9 varchar(50),
	option_10 varchar(50)
);

-- insert menu function and trigger

CREATE OR REPLACE FUNCTION populate_user_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Fetch user_id and user_name based on user_email
    SELECT INTO NEW.user_id, NEW.user_name
    user_id, user_name
    FROM users
    WHERE user_email = NEW.user_email;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- trigger 

CREATE TRIGGER before_insert_menus
BEFORE INSERT ON menus
FOR EACH ROW
EXECUTE FUNCTION populate_user_fields();


---- responses table

create table responses (

	response_id SERIAL PRIMARY KEY,
	user_id uuid not null,
	user_name varchar(255) not null,
	user_email varchar(255) not null,
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	menu_date date not null,
	menu_title varchar(255) not null,
	menu_description varchar (1000) not null,
	menu_drink varchar(255) not null,
	menu_id varchar(255) not null,
	menu_option varchar(255) not null,
	menu_note varchar(500),
	menu_allergy varchar(500)
);


CREATE OR REPLACE FUNCTION populate_user_fields_responses()
RETURNS TRIGGER AS $$
BEGIN
    -- Fetch user_id and user_name based on user_email
    SELECT INTO NEW.user_id, NEW.user_name
    user_id, user_name
    FROM users
    WHERE user_email = NEW.user_email;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_responses
BEFORE INSERT ON responses
FOR EACH ROW
EXECUTE FUNCTION populate_user_fields_responses();