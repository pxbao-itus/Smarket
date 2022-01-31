# SMARKET
### System to go to the market and support online essential purchases in the context of the covid epidemic
1. This project using for Information System Development subject 


## Views using NodeJS
1. Configuration
- Framework: __ExpressJS__
- View engine: __PUG__

2. Launch
- Install module: 
    `cd Views_NodeJS`
    `npm install`
- Start server with dev mode:
    `npm run dev`
- Start server: 
    `npm start`

## API using .NET Core Framwork
1. Configuration
- .NET Core Framework 2.1
- Entity Framework Core 2.1.14 (Nuget Microsoft.EntityFrameworkCore)
- Entity Framework Core with SQL Server 2.1.14 (Nuget Microsoft.EntityFrameworkCore.SqlServer)
- Entity Framework Core Tool 2.1.14 (Nuget Microsoft.EntityFrameworkCore.Tools)
- DotNetEnv Package
- Visual Studio 2017 || VS Code
2. Launch
- Using file .env:
    `dotnet add package DotNetEnv`
    ```
    DotNetEnv.Env.Load();
    var username = Environment.GetEnvironmentVariable("USERNAME");
    var password = Environment.GetEnvironmentVariable("PASSWORD");
    ```
- Using Bcrypt
    `dotnet add package BCrypt.Net-Next`
    ```
    string PasswordHashed = BCrypt.Net.BCrypt.HashPassword("Pa$$w0rd", SaltRounds);
    bool verified = BCrypt.Net.BCrypt.Verify("Pa$$w0rd", PasswordHashed);
    ```

## API using Java Spring Boot
1. Configuration
- JAVA 17
- Java Spring Boot 4
- Eclipse 2021/9 || VS Code using Maven
- Hibernate

2. Launch
- Open eclipse set /API_JAVASpringBoot is workspace
- Do: import project --> Maven --> Existing Maven Projects --> choose browser folder: API_JAVA --> Finish
- Access this link to know obvious : [ A way to import project to eclipse workspace](https://qaautomation.expert/2019/10/07/maven-how-to-import-maven-project-into-eclipse/)

## Database
1. Configuration
- Using Microsoft SQL Server Developer
- Using SQL Server Authentication for connection between backend and database

2. Launch
- Create database Smarket
- Execute file CreateTable.sql & ForeignKey.sql
- Editing file .env in folder DOTNET is suitable for each one include username, password
- Editing file application.properties is suitable for connecting MS SQL Server