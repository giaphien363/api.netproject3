-- Mỗi ng có 1 tk admin. Mk chung: admin
INSERT INTO UserAdmin (Username,Password) VALUES
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
('MEDICINE', 'Pay for listed medicines'),
('COVID-19', 'Covid-19 related insurance packages');


INSERT INTO Policy (Name, [Description], SupportPercent, DurationInDays, Price, [TypeId], CompanyId) VALUES 
('Dai-ichi COVID-19 Package', 'Covers all your medicine and/or quarantine expenses', 80, 180, 500000, 3, 5),
('COVID-19 Premium', 'Covers all your medicine and/or quarantine expenses', 60, 365, 100000, 3, 1),
('High School', 'Basic package for highschool students', 100, 365, 250000, 1, 1),
('Diabetes', 'Covers 5 life-saving medicines for Diabetes type I & II patients', 70, 730, 2500000, 2, 4),
('Young Adults', 'Covers basic vaccines & yearly checkups for newly working individuals.', 50, 365, 289000, 1, 7),
('Working person', 'Offers basic vaccines & yearly checkups for those who are working 9-5.', 60, 365, 349000, 1, 2),
('Policy 7', 'Something', 90, 120, 100000, 1, 2),
('Policy 8', 'Some other thing', 85, 110, 100000, 2, 1);

-- INSERT INTO ClaimEmployee ([Status], Reason, TotalCost, EmployeeId, PolicyId) VALUES 
-- (0, 'chua nghi ra reason', 500000, 3, 1),
-- (0, 'chua nghi ra reason', 500000, 3, 2),
-- (0, 'chua nghi ra reason', 500000, 3, 3),
-- (0, 'chua nghi ra reason', 500000, 3, 4),
-- (0, 'chua nghi ra reason', 500000, 3, 5),
-- (0, 'chua nghi ra reason', 500000, 3, 6),
-- (0, 'chua nghi ra reason', 500000, 3, 7),
-- (0, 'chua nghi ra reason', 500000, 3, 8),
-- (0, 'chua nghi ra reason', 500000, 3, 9),
-- (0, 'chua nghi ra reason', 500000, 3, 10),
-- (0, 'chua nghi ra reason', 500000, 3, 1),
-- (0, 'chua nghi ra reason', 500000, 3, 2),
-- (0, 'chua nghi ra reason', 500000, 3, 3),
-- (0, 'chua nghi ra reason', 500000, 3, 4),
-- (0, 'chua nghi ra reason', 500000, 3, 5);

-- INSERT INTO ClaimAction (ActionType, Reason, CreatebyEmployeeId, ClaimId) VALUES 
-- (0, 'chua nghi ra', 3, 13);