/*
Uncomment block code below if first time you run
*/

/*
USE  [master];

DROP DATABASE [api_dotnet];

CREATE DATABASE [api_dotnet];

USE  [api_dotnet];
*/

CREATE TABLE UserAdmin (
    [Id] int identity(1,1) primary key,
    [Username] varchar(50) unique not null,
    [Password] varchar(255) not null
);

CREATE TABLE Employees (
    [Id] int identity(1,1) primary key,
    [Username] varchar(50) unique not null,
    [Password] varchar(50) not null,
	[Salary] decimal(12,2),
	Firstname varchar(50),
	Lastname varchar(50),
	Joindate datetime default(GETDATE()), 
	Designation varchar(200),
	[Address] varchar(200),
	Phone varchar(12),
	Country varchar(200),
	City varchar(200),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);


create table InsuranceCompany(
	Id int identity(1,1) primary key,
	Name varchar(200) not null,
	[Address] varchar(200),
	Phone varchar(20),
	[Url] varchar(200),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);


create table InsuranceAdmin(
	Id int identity(1,1) primary key,
	Username varchar(200) not null,
	[Password] varchar(200) not null,
	[Role] varchar(200) not null,
	CompanyId int FOREIGN KEY REFERENCES InsuranceCompany(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table TypePolicy(
	Id int identity(1,1) primary key,
	Name varchar(255) not null,
	[Description] varchar(255) null,
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table Policy(
	Id int identity(1,1) primary key,
	Name varchar(200) not null,
	[Description] varchar(255) null,
	SupportPercent int not null,
	DurationInDays int not null,	
	Price decimal(12,2) not null,
	[TypeId] int  FOREIGN KEY REFERENCES TypePolicy(Id),
	CompanyId int FOREIGN KEY REFERENCES InsuranceCompany(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table [Contract](
	EmployeeId int FOREIGN KEY REFERENCES Employees(Id) primary key,
	Name varchar(200) not null,
	[Description] varchar(255) null,
	TotalAmount decimal(12,2) null,
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table [ContractPolicy](
	Id int identity(1,1) primary key,
	[ContractId] int FOREIGN KEY REFERENCES [Contract](EmployeeId),
	PolicyId int FOREIGN KEY REFERENCES Policy(Id),
	[Description] varchar(255) null,
	StartDate datetime not null,
	EndDate datetime not null,
	Emi decimal(12,2) null, -- so tien tra gop hang thang
	AmountOwing decimal(12,2) null, -- so no can phai tra
	PaymentStatus int not null, -- trang thai da thanh toan hay chua ? 0: not yet, 1: done, 2: emi
	PaymentType int not null, -- kieu thanh toan, tra gop hay 1 lan ?	
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table PolicyOrder(
	Id int identity(1,1) primary key, 
	StartDate datetime not null, 
	PaymentType int not null,
	Emi decimal(12,2) null,
	[Status] int default(0), -- 0: pending, 1: approval, 2: reject
	EmployeeId int FOREIGN KEY REFERENCES Employees(Id),
	PolicyId int FOREIGN KEY REFERENCES Policy(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
); -- chi cho employee yeu cau kieu thanh toan, ngay bat dau

-- thread 2

create table ClaimEmployee(
	Id int identity(1,1) primary key, 
	[Status] int default(0), -- trang thai yeu cau 0: chua duyet, 1: manager duyet, 2: tai chinh duyet 
	Reason varchar(255) not null,
	TotalCost decimal(12,2) not null, -- tong chi phi ma employee phai tra cho hospital
	EmployeeId int FOREIGN KEY REFERENCES Employees(Id),
	PolicyId int FOREIGN KEY REFERENCES Policy(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

create table Bill(
	SupportCost decimal(12,2) not null,
	EmployeeId int FOREIGN KEY REFERENCES Employees(Id),
	ClaimId int FOREIGN KEY REFERENCES ClaimEmployee(Id) primary key,
	PolicyId int FOREIGN KEY REFERENCES Policy(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);
create table ClaimAction(
	Id int identity(1,1) primary key, 
	ActionType int not null,
	Reason varchar(255) null,
	CreatebyEmployeeId int null,
	CreatebyInsuranceAdminId int null,
	ClaimId int FOREIGN KEY REFERENCES ClaimEmployee(Id),
	CreatedAt datetime default(GETDATE()),
	UpdatedAt datetime default(GETDATE()),
	IsDeleted int default(0)
);

-- select * from [Contract]

-- ALTER TABLE PolicyOrder ADD [Status] int default(0);
