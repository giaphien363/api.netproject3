-- some stupid data
-- Select @@version


INSERT INTO InsuranceCompany (Name, [Address], [Url], Phone) VALUES 
('BH Nhan Tho', 'Cau Giay HN', 'http://', '0988765123'),
('Health Care', 'Cau Giay HN', 'http://', '0988765123');


INSERT INTO TypePolicy (Name, [Description]) VALUES 
('Kham Benh', 'Chi cho kham benh'),
('Mua Thuoc', 'Chi cho mua thuoc');


INSERT INTO Policy (Name, [Description], SupportPercent, DurationInDays, Price, [TypeId], CompanyId) VALUES 
('policy 1', 'chua nghi ra', 80, 180, 100000, 1, 1),
('policy 2', 'chua nghi ra', 50, 150, 100000, 1, 2),
('policy 3', 'chua nghi ra', 70, 140, 100000, 2, 1),
('policy 4', 'chua nghi ra', 60, 200, 100000, 2, 2),
('policy 5', 'chua nghi ra', 20, 185, 100000, 1, 1),
('policy 6', 'chua nghi ra', 40, 130, 100000, 2, 2),
('policy 7', 'chua nghi ra', 90, 120, 100000, 1, 2),
('policy 8', 'chua nghi ra', 85, 110, 100000, 2, 1);


INSERT INTO ClaimEmployee ([Status], Reason, TotalCost, EmployeeId, PolicyId) VALUES 
(0, 'chua nghi ra reason', 500000, 1, 1),
(0, 'chua nghi ra reason', 500000, 1, 2),
(0, 'chua nghi ra reason', 500000, 1, 3),
(0, 'chua nghi ra reason', 500000, 1, 4),
(0, 'chua nghi ra reason', 500000, 1, 5),
(0, 'chua nghi ra reason', 500000, 1, 6),
(0, 'chua nghi ra reason', 500000, 1, 7),
(0, 'chua nghi ra reason', 500000, 1, 8),
(0, 'chua nghi ra reason', 500000, 1, 9),
(0, 'chua nghi ra reason', 500000, 1, 10),
(0, 'chua nghi ra reason', 500000, 3, 1),
(0, 'chua nghi ra reason', 500000, 3, 2),
(0, 'chua nghi ra reason', 500000, 3, 3),
(0, 'chua nghi ra reason', 500000, 3, 4),
(0, 'chua nghi ra reason', 500000, 3, 5);

select * from ClaimEmployee