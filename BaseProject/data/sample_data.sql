-- some stupid data
-- Select @@version

-- Mỗi ng có 1 tk admin. Mk chung: admin
INSERT INTO UserAdmin (Username,Password,) VALUES
	 ('hienanh','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('giaphien','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('huyhoang','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('tienduong','YWRtaW5zZWNyZXRAa2V5QEA=');

INSERT INTO InsuranceCompany (Name,Address,Phone,Url) VALUES
	 ('Bao Viet','8 Le Thai To, Hoan Kiem Dist., Hanoi','1900 55 88 99','https://www.baoviet.com.vn/'),
	 ('Generali','Trieste, Italy','1900 96 96 75','https://generali.vn/'),
	 ('Chubb Life','Floor 21, Sun Wah Building, 115 Nguyen Hue, Dist. 1, HCMC','(028) 3827 8123','https://www.chubb.com'),
	 ('AIA','Floor 2, Bitexco Building, 2 Hai Trieu, Dist. 1, HCMC','(028) 3821 6400','https://www.aia.com.vn/'),
	 ('Dai-ichi Life','366 Nguyen Trong Tuyen, Tan Binh Dist., HCMC','(028) 3810 0888','https://www.dai-ichi-life.com.vn/'),
	 ('Manulife','Floor 2, Manulife Plaza, 75 Hoang Van Thai, Dist. 7, HCMC','1900 1776','https://www.manulife.com.vn'),
	 ('Prudential','Floor 25, Sai Gon Trade Center, 37 Ton Duc Thang, HCMC','1800 1247','https://www.prudential.com.vn'),
	 ('MIC - Military Insurance Company','Floor 5-6, MB Building, 21 Cat Linh, Dong Da Dist., Hanoi','1900 55 88 91','https://mic.vn/');

INSERT INTO TypePolicy (Name, [Description]) VALUES 
('CHECKUP', 'Covers medical checkups at certain locations'),
('MEDICINE', 'Pay for medicines');
('COVID-19', 'Covid-19 related insurance packages');


INSERT INTO Policy (Name, [Description], SupportPercent, DurationInDays, Price, [TypeId], CompanyId) VALUES 
('Dai-ichi COVID-19 Package', 'Covers all your medicine and/or quarantine expenses', 80, 180, 500000, 2, 5);
('COVID-19 Premium', 'Covers all your medicine and/or quarantine expenses', 60, 365, 100000, 2, 1,);
('policy 3', 'chua nghi ra', 70, 140, 100000, 2, 1),
('policy 4', 'chua nghi ra', 60, 200, 100000, 2, 2),
('policy 5', 'chua nghi ra', 20, 185, 100000, 1, 1),
('policy 6', 'chua nghi ra', 40, 130, 100000, 2, 2),
('policy 7', 'chua nghi ra', 90, 120, 100000, 1, 2),
('policy 8', 'chua nghi ra', 85, 110, 100000, 2, 1);


INSERT INTO ClaimEmployee ([Status], Reason, TotalCost, EmployeeId, PolicyId) VALUES 
(0, 'chua nghi ra reason', 500000, 3, 1),
(0, 'chua nghi ra reason', 500000, 3, 2),
(0, 'chua nghi ra reason', 500000, 3, 3),
(0, 'chua nghi ra reason', 500000, 3, 4),
(0, 'chua nghi ra reason', 500000, 3, 5),
(0, 'chua nghi ra reason', 500000, 3, 6),
(0, 'chua nghi ra reason', 500000, 3, 7),
(0, 'chua nghi ra reason', 500000, 3, 8),
(0, 'chua nghi ra reason', 500000, 3, 9),
(0, 'chua nghi ra reason', 500000, 3, 10),
(0, 'chua nghi ra reason', 500000, 3, 1),
(0, 'chua nghi ra reason', 500000, 3, 2),
(0, 'chua nghi ra reason', 500000, 3, 3),
(0, 'chua nghi ra reason', 500000, 3, 4),
(0, 'chua nghi ra reason', 500000, 3, 5);

select * from ClaimAction


select COUNT(id) from ClaimEmployee where EmployeeId=3;


INSERT INTO ClaimAction (ActionType, Reason, CreatebyEmployeeId, ClaimId) VALUES 
(0, 'chua nghi ra', 3, 13);
-- truncate table ClaimAction;

 -- UPDATE ClaimEmployee SET IsDeleted = 0;

