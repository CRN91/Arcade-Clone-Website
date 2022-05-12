<?php
// Initialising session and connecting to database.
session_start();

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "tetris";

$connection = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);


?>

<!DOCTYPE html>
<html>
    <head>
        <title>Signup</title>
        <link rel="stylesheet" href="css/style.css"><link>
    </head>
    <body>
    <div class="navbar">
        <a href="index.php">Home</a>
        <a class="right" href="leaderboard.php">Leaderboard</a>
        <a class="right" href="tetris.php">Play Tetris</a>
    </div>

    <div class="main">
        <div id="box">

            <form method="post" action="index.php">
                <div class="input-title">Signup</div>
                <input class="input" type="text" placeholder="First Name" name="firstName" required><br><br>
                <input class="input" type="text" placeholder="Last name" name="lastName" required><br><br>
                <input class="input" type="text" placeholder="Username" name="username" required><br><br>
                <input class="input" type="password" placeholder="Password" id="password" name="password" required><br><br>
                <input class="input" type="password" placeholder="Confirm Password" id="confirm_password" required><br><br>
                <p><b>Display Scores on leaderboard</b></p>
                <input type="radio" id="html" name="display" value="1" required>
                <label for="display">yes</label>
                <input type="radio" id="html" name="display" value="0" required>
                <label for="display">no</label><br><br>

                <input class="button" type="submit" value="Signup"><br><br>

                <a style="margin-left: 5px;" href="index.php">Click to login</a><br><br>
            </form>
        </div>
    </div>
    <script> // Checks the password and confirm password fields are equal.
        let password = document.getElementById("password"),
            confirm_password = document.getElementById("confirm_password");

        function validatePassword(){
            if(password.value != confirm_password.value) {
                confirm_password.setCustomValidity("Passwords Don't Match");
            } else {
                confirm_password.setCustomValidity('');
            }
        }

        password.onchange = validatePassword;
        confirm_password.onkeyup = validatePassword;
    </script>

    </body>
</html>
