# LAMP Stack Arcade Game

<img src="rmimg/ECM1417.svg" height="28"> <img src="rmimg/Solo.svg" height="28">

> Development has ended

This was a clone of Tetris made using the LAMP stack for the continuous assessment of the first year Web Development module taught by Dr Matt Collison. The game is made in JavaScript and the website includes a login system with database integration.

<p align="center"\p> <img src="rmimg/example.png" height="500">

## Installation

Follows standard LAMP stack deployment, on a Linux server with Apache httpd web server, MySQL and PHP installed.

The database host is localhost with user root and no password but this can be edited on the first lines of `index.php`.
The name of the database should be 'tetris' with two tables. The first table 'users' has the columns 'UserName', 'FirstName', 'LastName', 'Password' and 'Display'.
The second table 'scores' has the columns 'Scoreid', 'Username' and 'Score'.

### Database Creation:

```sql
    CREATE DATABASE tetris;
    USE tetris;
```

### Create 'users' Table:

```sql
    CREATE TABLE users (
        UserName VARCHAR(50) PRIMARY KEY,
        FirstName VARCHAR(50),
        LastName VARCHAR(50),
        Password VARCHAR(255),
        Display VARCHAR(50)
    );
```

### Create 'scores' Table

```sql
    CREATE TABLE scores (
        Scoreid INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        Score INT,
        FOREIGN KEY (Username) REFERENCES users(UserName)
    );
```

### Directory

Place all the files in the Linux servers Apache web root directory, usually `/var/www/html`. 

### Alternative Local Installation with XAMMP

The LAMP stack can be deployed on a localhost with the program [XAMPP](https://www.apachefriends.org/) and by placing the files in its directory `../xampp/htdocs`. Previous instructions to install PHP, MySQL and the scripts to setup the database are applicable to XAMPP.

## Usage

Navigate to `index.php` where you must sign up and login. From there you can play the game and take a look at the leaderboard.

## License

[MIT](https://choosealicense.com/licenses/mit/)
