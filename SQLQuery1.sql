CREATE DATABASE api_dotnet;

USE [api_dotnet];

CREATE TABLE userAdmin (
    id int identity(1,1) primary key,
    username varchar(50) unique not null,
    password varchar(255) not null
);

CREATE TABLE employees (
    id int identity(1,1) primary key,

    username varchar(50) unique not null,
    [password] varchar(50) not null,
	salary decimal(12,2),

	firstname varchar(50),
	lastname varchar(50),
	joindate datetime , 

	designation varchar(200),
	[address] varchar(200),
	contact varchar(200),

	[state] varchar(200),
	country varchar(200),
	city varchar(200),
);

-- drop table userAdmin
-- truncate table userAdmin

select * from userAdmin;
select * from employees;

-- insert into userAdmin(username, password) values ('admin', 'admin')