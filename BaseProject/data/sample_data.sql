-- Mỗi ng có 1 tk admin. Mk chung: admin
INSERT INTO api_dotnet.dbo.UserAdmin (Username,Password) VALUES
	 ('hienanh','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('giaphien','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('huyhoang','YWRtaW5zZWNyZXRAa2V5QEA='),
	 ('tienduong','YWRtaW5zZWNyZXRAa2V5QEA=');

INSERT INTO api_dotnet.dbo.InsuranceCompany (Name,Address,Phone,Url) VALUES
	 ('Bao Viet','8 Le Thai To, Hoan Kiem Dist., Hanoi','1900 55 88 99','https://www.baoviet.com.vn/'),
	 ('Generali','Trieste, Italy','1900 96 96 75','https://generali.vn/'),
	 ('Chubb Life','Floor 21, Sun Wah Building, 115 Nguyen Hue, Dist. 1, HCMC','(028) 3827 8123','https://www.chubb.com'),
	 ('AIA','Floor 2, Bitexco Building, 2 Hai Trieu, Dist. 1, HCMC','(028) 3821 6400','https://www.aia.com.vn/'),
	 ('Dai-ichi Life','366 Nguyen Trong Tuyen, Tan Binh Dist., HCMC','(028) 3810 0888','https://www.dai-ichi-life.com.vn/'),
	 ('Manulife','Floor 2, Manulife Plaza, 75 Hoang Van Thai, Dist. 7, HCMC','1900 1776','https://www.manulife.com.vn'),
	 ('Prudential','Floor 25, Sai Gon Trade Center, 37 Ton Duc Thang, HCMC','1800 1247','https://www.prudential.com.vn'),
	 ('MIC - Military Insurance Company','Floor 5-6, MB Building, 21 Cat Linh, Dong Da Dist., Hanoi','1900 55 88 91','https://mic.vn/');

INSERT INTO api_dotnet.dbo.TypePolicy (Name, [Description]) VALUES 
('CHECKUP', 'Covers medical checkups at certain locations'),
('MEDICINE', 'Pay for listed medicines'),
('COVID-19', 'Covid-19 related insurance packages');


INSERT INTO api_dotnet.dbo.Policy (Name, [Description], SupportPercent, DurationInDays, Price, Status, [TypeId], CompanyId) VALUES 
('Dai-ichi COVID-19 Package', 'Covers all your medicine and/or quarantine expenses', 80, 180, 5000, 2, 3, 5),
('COVID-19 Premium', 'Covers all your medicine and/or quarantine expenses', 60, 365, 1000, 1, 3, 1),
('High School', 'Basic package for highschool students', 100, 365, 2500, 2, 1, 1),
('Diabetes', 'Covers 5 life-saving medicines for Diabetes type I & II patients', 70, 730, 2500, 2, 2, 4),
('Young Adults', 'Covers basic vaccines & yearly checkups for newly working individuals.', 50, 365, 2890, 2, 1, 7),
('Working person', 'Offers basic vaccines & yearly checkups for those who are working 9-5.', 60, 365, 3490, 2, 1, 2),
('General Denta','Includes check-ups, x-rays, simple extractions, fillings and root canal.',90,180,500,2,1,1),
('Major Dental','Includes crowns and dentures.',80,365,2000,2,1,2),
('Chiropractic','Treatment and prevention of mechanical disorders of the musculoskeletal system, especially of the spine.',80,180,2000,2,1,3),
('Acupuncture','Thin needles are inserted into the body.',95,365,763,2,1,6),
('Pharmacy','Available at any recognised pharmacy',100,365,400,2,2,8),
('School Accident','Any type of personal injury accident.',100,365,300,2,1,3),
('Ambulance','100% covered for emergency transport, clinically required non-emergency transport, and treatment not requiring transport.',100,355,435,2,1,1),
('General hospital costs','Private or shared room accommodation (subject to availability and the hospital 35 day rule).',100,365,2400,2,1,3),
('Drugs supplied','100% covered when related to the reason for admission in hospital and covered under the agreement we have with the hospital. Public hospitals generally supply medication without charge.',100,180,2000,2,1,5),
('Hospital at hone','Police Health has agreements with some hospitals to deliver out-of-hospital care to patients for services such as wound management, intravenous therapy and post-natal care.',80,365,1700,2,1,6),
('Additional health care services','Benefits are available for aids and appliances and Home Nursing.',100,365,1000,2,1,7),
('Orthodontic','Orthodontic benefits work slightly differently to other benefits. Limits apply after completion of anniversary years.',75,730,2000,1,2,3),
('Hospital`s fee','Each hospitalization of a person with COVID-19 ',85,180,600,2,3,1),
('Corona insurance','With a corona insurance policy, you can get coverage for your life at nominal premium rates.',100,365,2000,3,3,8),
('COVID-19 insurance','With a corona insurance policy, you can get coverage for your life at nominal premium rates.',85,365,2000,2,3,8),
('Test - Corona','Testing - Coronavirus COVID-19 Response',100,365,190,3,3,8),
('Test COVID-19','Testing - Coronavirus COVID-19 Response',75,365,100,1,3,8),
('COVID‑19 vaccine','Intended to provide acquired immunity against severe acute respiratory syndrome coronavirus',100,720,100,1,3,8),
('Pregnancy care and childbirth','Pregnancy care and childbirth are both covered under AIA.',100,360,1000,1,1,2),
('Travel and accommodation','Up to $500 per calendar year per policy.',60,180,270,1,1,6),
('Robotic assisted surgery','In most cases robotic assisted systems used in surgery is covered under our contract with the hospital',90,365,340,2,1,3),
('Sleep Studies','For the investigation of sleep patterns and anomalies. For example: sleep apnoea and snoring.',100,720,300,3,1,1),
('Insulin pumps','For the provision and replacement of insulin pumps for treatment of diabetes',80,365,123,1,1,4),
('Weight loss surgery','For surgery that is designed to reduce a person’s weight, remove excess skin due to weight loss and reversal of a bariatric procedure. For example: gastric banding, gastric bypass, sleeve gastrectomy.',75,365,1200,1,1,4),
('Joint replacements','For surgery for joint replacements, including revisions, resurfacing, partial replacements and removal of prostheses.',100,365,600,1,2,2),
('Cataracts','For surgery to remove a cataract and replace with an artificial lens.',100,365,200,2,1,6),
('Dental surgery','For surgery to the teeth and gums. For example: surgery to remove wisdom teeth, and dental implant surgery.',80,365,350,2,2,7),
('Breast surgery','For the investigation and treatment of breast disorders and associated lymph nodes, and reconstruction and/or reduction following breast surgery or a preventative mastectomy.',60,365,100,3,1,3),
('Speech Therapy','Speech Therapy',60,365,540,2,2,1),
('Counselling','Counselling',100,365,100,2,2,5),
('Back, neck and spine','For the investigation and treatment of the back, neck and spinal column, including spinal fusion.',90,365,200,2,1,1),
('Heart and vascular system','For the investigation and treatment of the heart, heart-related conditions and vascular system.',80,365,430,2,1,1),
('Rehabilitation','For physical rehabilitation for a patient related to surgery or illness.',60,365,400,2,2,2),
('Bone, joint and muscle','For the investigation and treatment of diseases, disorders and injuries of the musculoskeletal system.',90,365,200,2,1,4),
('Palliative care','For care where the intent is primarily providing quality of life for a patient with a terminal illness, including treatment to alleviate and manage pain.',100,365,340,2,2,2),
('Male reproductive system','For the investigation and treatment of the male reproductive system including the prostate',90,365,340,2,1,5),
('Pregnancy and birth','For investigation and treatment of conditions associated with pregnancy and child birth. ',100,365,500,2,1,7);
INSERT INTO api_dotnet.dbo.InsuranceAdmin (Username, Password, [Role], CompanyId) VALUES
('manager1', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 1),
('manager2', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 2),
('manager3', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 3),
('manager4', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 4),
('manager5', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 5),
('manager6', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 6),
('manager7', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 7),
('manager8', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IMANAGER', 8),
('finman1', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 1),
('finman2', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 2),
('finman3', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 3),
('finman4', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 4),
('finman5', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 5),
('finman6', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 6),
('finman7', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 7),
('finman8', 'aW5zdXJhbmNlc2VjcmV0QGtleUBA', 'IFINMAN', 8);
INSERT INTO api_dotnet.dbo.Employees(Username,Password,Salary,Firstname,Lastname,Address,Phone,Country,City) values
('employee1','YWRtaW5zZWNyZXRAa2V5QEA=',12000,'Martin','Garrix','Nguyen Trai','0984938271','Viet Nam','Ha Noi'),
('employee2','YWRtaW5zZWNyZXRAa2V5QEA=',20000,'Justin','Bieber','Cau Giay','0938276183','Viet Nam','Ha Noi'),
('employee3','YWRtaW5zZWNyZXRAa2V5QEA=',8000,'Tori','Kelly','Ba Dinh','0938271634','Viet Nam','Ha Noi'),
('employee4','YWRtaW5zZWNyZXRAa2V5QEA=',9740,'Lukas','Graham','Hai Ba Trung','0837261529','Viet Nam','Ha Noi'),
('employee5','YWRtaW5zZWNyZXRAa2V5QEA=',13000,'David','Guetta','Duong Quang Ham','0392738239','Viet Nam','Ha Noi'),
('employee6','YWRtaW5zZWNyZXRAa2V5QEA=',20000,'Sofia','Carson','Thanh Binh','0987584932','Viet Nam','Ha Noi');

--select * from api_dotnet.dbo.Employees
insert into api_dotnet.dbo.Contract(EmployeeId,Name,CreatedAt,UpdatedAt, TotalAmount) values
(1,'HD1','2022-02-27','2022-02-27', 0),
(2,'HD2','2022-02-28','2022-02-28', 0),
(3,'HD3','2022-02-28','2022-02-28', 0),
(4,'HD4','2022-03-01','2022-03-02', 0),
(5,'HD5','2022-03-01','2022-03-02', 0),
(6,'HD6','2022-03-02','2022-03-03', 0);
--select * from Contract
--select * from ContractPolicy
insert into api_dotnet.dbo.ContractPolicy( ContractId,PolicyId,Description,StartDate,EndDate,PaymentStatus,CreatedAt) values
(1,6,'Working person','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(1,7,'General Denta','2022-01-06',DATEADD(day,180,'2022-01-06'),1,'2022-01-06'),
(1,9,'Major Dental','2022-01-06',DATEADD(day,365,'2022-01-06'),1,'2022-01-06'),
(1,2,'COVID-19 Premium','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(1,16,'Hospital at hone','2022-01-03',DATEADD(day,365,'2022-01-03'),1,'2022-01-03'),
(4,6,'Working person','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(4,7,'General Denta','2022-01-06',DATEADD(day,180,'2022-01-06'),1,'2022-01-06'),
(4,9,'Major Dental','2022-01-06',DATEADD(day,365,'2022-01-06'),1,'2022-01-06'),
(4,2,'COVID-19 Premium','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(4,16,'Hospital at hone','2022-01-03',DATEADD(day,365,'2022-01-03'),1,'2022-01-03'),
(5,6,'Working person','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(5,7,'General Denta','2022-01-06',DATEADD(day,180,'2022-01-06'),1,'2022-01-06'),
(5,9,'Major Dental','2022-01-06',DATEADD(day,365,'2022-01-06'),1,'2022-01-06'),
(5,2,'COVID-19 Premium','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(5,16,'Hospital at hone','2022-01-03',DATEADD(day,365,'2022-01-03'),1,'2022-01-03'),
(2,6,'Working person','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(2,7,'General Denta','2022-01-06',DATEADD(day,180,'2022-01-06'),1,'2022-01-06'),
(2,9,'Major Dental','2022-01-06',DATEADD(day,365,'2022-01-06'),1,'2022-01-06'),
(2,2,'COVID-19 Premium','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(2,16,'Hospital at hone','2022-01-03',DATEADD(day,365,'2022-01-03'),1,'2022-01-03'),
(1,42,'Male reproductive system','2022-02-04',DATEADD(day,365,'2022-02-04'),1,'2022-02-04'),
(1,17,'Additional health care services','2022-02-04',DATEADD(day,365,'2022-02-04'),1,'2022-02-04'),
(1,20,'Corona insurance','2022-02-03',DATEADD(day,365,'2022-02-03'),1,'2022-02-03'),
(1,27,'Robotic assisted surgery','2022-02-05',DATEADD(day,365,'2022-02-05'),1,'2022-02-05'),
(1,28,'Sleep Studies','2022-02-11',DATEADD(day,720,'2022-02-11'),1,'2022-02-11'),
(1,35,'Speech Therapy','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(1,37,'Back, neck and spine','2022-01-01',DATEADD(day,365,'2022-01-01'),1,'2022-01-01'),
(1,32,'Cataracts','2022-03-03',DATEADD(day,365,'2022-03-03'),1,'2022-03-03'),
(1,8,'Major Dental','2022-01-01',DATEADD(day,365,'2022-01-01'),1,'2022-01-01'),
(1,15,'Drugs supplied','2022-01-16',DATEADD(day,180,'2022-01-16'),1,'2022-01-16'),
(3,42,'Male reproductive system','2022-02-01',DATEADD(day,365,'2022-02-01'),1,'2022-02-01'),
(3,17,'Additional health care services','2022-01-04',DATEADD(day,365,'2022-01-04'),1,'2022-01-04'),
(4,20,'Corona insurance','2022-02-03',DATEADD(day,365,'2022-02-03'),1,'2022-02-03'),
(3,27,'Robotic assisted surgery','2022-01-05',DATEADD(day,365,'2022-01-05'),1,'2022-01-05'),
(4,28,'Sleep Studies','2022-02-11',DATEADD(day,720,'2022-01-11'),1,'2022-01-11'),
(5,35,'Speech Therapy','2022-03-01',DATEADD(day,365,'2022-03-02'),1,'2022-03-01'),
(6,37,'Back, neck and spine','2022-01-17',DATEADD(day,365,'2022-01-17'),1,'2022-01-17'),
(3,32,'Cataracts','2022-03-03',DATEADD(day,365,'2022-03-03'),1,'2022-03-03'),
(3,8,'Major Dental','2022-01-01',DATEADD(day,365,'2022-01-01'),1,'2022-01-01'),
(3,15,'Drugs supplied','2022-01-16',DATEADD(day,180,'2022-01-16'),1,'2022-01-16'),
(6,1,'Nothing','2022-01-02',DATEADD(day,180,'2022-01-02'),1,'2022-01-02'),
(6,4,'Nothing','2022-01-19',DATEADD(day,730,'2022-01-19'),1,'2022-01-19'),
(6,11,'Nothing','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(6,13,'Nothing','2022-01-30',DATEADD(day,365,'2022-01-30'),1,'2022-01-30'),
(6,15,'Nothing','2022-01-12',DATEADD(day,180,'2022-01-12'),1,'2022-01-12'),
(6,20,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(6,22,'Nothing','2022-02-06',DATEADD(day,365,'2022-02-06'),1,'2022-02-06'),
(6,26,'Nothing','2022-02-06',DATEADD(day,180,'2022-02-06'),1,'2022-02-06'),
(6,29,'Nothing','2022-02-09',DATEADD(day,365,'2022-02-09'),1,'2022-02-09'),
(6,28,'Nothing','2022-02-08',DATEADD(day,720,'2022-01-08'),1,'2022-02-08'),
(6,42,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(6,37,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(6,40,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(3,1,'Nothing','2022-01-30',DATEADD(day,180,'2022-01-30'),1,'2022-01-30'),
(3,5,'Nothing','2022-01-14',DATEADD(day,365,'2022-01-14'),1,'2022-01-14'),
(3,20,'Nothing','2022-01-11',DATEADD(day,365,'2022-01-11'),1,'2022-01-1'),
(3,27,'Nothing','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(3,30,'Nothing','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(3,31,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(3,39,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(3,41,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(3,33,'Nothing','2022-01-02',DATEADD(day,365,'2022-01-02'),1,'2022-01-02'),
(3,19,'Nothing','2022-01-02',DATEADD(day,180,'2022-01-02'),1,'2022-01-02'),
(3,38,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(3,36,'Nothing','2022-03-01',DATEADD(day,365,'2022-03-01'),1,'2022-03-01'),
(3,11,'Nothing','2022-03-01',DATEADD(day,365,'2022-03-01'),1,'2022-03-01'),
(2,1,'Nothing','2022-02-02',DATEADD(day,180,'2022-02-02'),1,'2022-02-02'),
(2,10,'Nothing','2022-02-12',DATEADD(day,365,'2022-02-12'),1,'2022-02-12'),
(2,11,'Nothing','2022-02-03',DATEADD(day,365,'2022-02-03'),1,'2022-02-03'),
(2,19,'Nothing','2022-02-02',DATEADD(day,180,'2022-02-02'),1,'2022-02-02'),
(2,22,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(2,25,'Nothing','2022-03-02',DATEADD(day,360,'2022-03-02'),1,'2022-03-02'),
(4,39,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(4,30,'Nothing','2022-02-11',DATEADD(day,365,'2022-02-11'),1,'2022-02-011'),
(4,27,'Nothing','2022-02-09',DATEADD(day,720,'2022-02-09'),1,'2022-02-09'),
(4,33,'Nothing','2022-02-04',DATEADD(day,365,'2022-02-04'),1,'2022-02-04'),
(4,40,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(4,19,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(5,39,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(5,30,'Nothing','2022-02-11',DATEADD(day,365,'2022-02-11'),1,'2022-02-011'),
(5,27,'Nothing','2022-02-09',DATEADD(day,720,'2022-02-09'),1,'2022-02-09'),
(5,33,'Nothing','2022-02-04',DATEADD(day,365,'2022-02-04'),1,'2022-02-04'),
(5,40,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(5,19,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(5,1,'Nothing','2022-03-01',DATEADD(day,180,'2022-03-01'),1,'2022-03-01'),
(2,31,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(2,35,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02'),
(5,17,'Nothing','2022-03-02',DATEADD(day,365,'2022-03-02'),1,'2022-03-02'),
(5,36,'Nothing','2022-03-01',DATEADD(day,365,'2022-03-01'),1,'2022-03-01'),
(2,38,'Nothing','2022-02-02',DATEADD(day,365,'2022-02-02'),1,'2022-02-02');

--BEGIN: TINH TotalAmount(Contract)
--Proc
create procedure spTotal
	@Id as int
As 
Begin 
	update Contract set TotalAmount = (
	select sum(Price) 
		from Contract
		left join ContractPolicy on Contract.EmployeeId = ContractPolicy.ContractId
		left join Policy on ContractPolicy.PolicyId = Policy.Id
		where EmployeeId =  @Id
	) where EmployeeId = @Id
end;


-- THUC THI TINH TotalAmount
exec spTotal 1;
exec spTotal 2;
exec spTotal 3;
exec spTotal 4;
exec spTotal 5;
exec spTotal 6;
--END: TINH TotalAmount(Contract)

--BEGIN: TAO DB BANG ClaimEmployee - ClaimAction - Bill

declare @cnt int = 0;
while @cnt < 30 /*muon bao nhieu ban ghi thi day vong lap len bay nhieu*/
begin 

	declare 
	@employeeId int = 0,
	@totalCost decimal = 0,
	@policy int = 0,
	@CreateAt datetime = getdate(),
	@claimId int = 0,
	@spCost decimal;

	set @employeeId = (SELECT FLOOR(RAND()*(6-1+1)+1)); 
	set @policy =  (SELECT top (1) PolicyId FROM ContractPolicy
					left join Policy on ContractPolicy.PolicyId = Policy.Id
					where ContractId = @employeeId and PaymentStatus = 1 and Policy.Status = 2 order by newid());
	set @totalCost = (SELECT Price from Policy where Id = @policy) * (1+(SELECT rand()));
	set @CreateAt = DATEADD(day,(select floor(rand()*(30 - 12 + 1)+12)),(select CreatedAt from ContractPolicy where ContractId = @employeeId and PolicyId = @policy));
	
	--create claim
	insert into api_dotnet.dbo.ClaimEmployee (Status, Reason, TotalCost, EmployeeId, PolicyId, CreatedAt) values
	(0,'Feeling unwell',@totalCost,@employeeId,@policy,@CreateAt);
	
	set @claimId = (select MAX(Id) from ClaimEmployee where EmployeeId = @employeeId and PolicyId = @policy)
	--create action - chua duyet
	insert into api_dotnet.dbo.ClaimAction(ActionType, Reason,CreatebyEmployeeId,ClaimId,CreatedAt) values
	(0,'Feeling unwell',@employeeId,@claimId,@CreateAt);
	
	--create action - manager duyet 
	insert into api_dotnet.dbo.ClaimAction(ActionType, Reason,CreatebyEmployeeId,CreatebyInsuranceAdminId,ClaimId,CreatedAt) values
	(1,'Feeling unwell',@employeeId,(select Id from InsuranceAdmin where Role = 'IMANAGER' 
	and CompanyId = (select CompanyId from Policy where id = @policy)),@claimId,DATEADD(day,1,@CreateAt));
	
	--create action - finman duyet 
	insert into api_dotnet.dbo.ClaimAction(ActionType, Reason,CreatebyEmployeeId,CreatebyInsuranceAdminId,ClaimId,CreatedAt) values
	(2,'Feeling unwell',@employeeId,(select Id from InsuranceAdmin where Role = 'IFINMAN' 
	and CompanyId = (select CompanyId from Policy where id = @policy)),@claimId,DATEADD(day,2,@CreateAt));
	
	--create bill
	set @spCost = (@totalCost * (select SupportPercent from Policy where Id = @policy) * 0.01);
	insert into api_dotnet.dbo.Bill(SupportCost,EmployeeId,ClaimId,PolicyId,CreatedAt) values
	(@spCost,@employeeId,@claimId,@policy,DATEADD(day,2,@CreateAt));

	--select @employeeId, @totalCost, @policy, @CreateAt
	set @cnt = @cnt + 1
end;

--END: TAO DB BANG ClaimEmployee - ClaimAction - Bill

select * from InsuranceAdmin

  -- update Policy set CreatedAt = '20220101 10:34:09 AM'  where Id in(1,2,5,7);

select * from InsuranceCompany

select * from ClaimAction

select * from Employees where [Status] = 1

select * from Policy where CompanyId = 1 -- 1,2,3,5,7,10


select * from ContractPolicy

select * from PolicyOrder

select * from Bill

-- ALTER TABLE ContractPolicy DROP COLUMN AmountOwing;
-- ALTER TABLE PolicyOrder DROP COLUMN PaymentType;
-- ALTER TABLE PolicyOrder DROP COLUMN Emi;

