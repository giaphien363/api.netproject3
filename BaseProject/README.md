# run with docker 
### open terminal and cd to working directory
- `docker-compose up -d --build`


### run images sql 
- `docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=root@123456' -e 'MSSQL_PID=Express' --name mssql-eproject -p 1433:1433 -d eproject/mssql:latest`

# run individual to import data
### open bash in container: 
- `docker exec -it eproject_mssql bash`
### import .sql file 
- `/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "root@123456" -i  mssql_data/data/wire_frame_db.sql`