<?php
// Initialising session and connecting to database.
session_start();

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "tetris";

$connection = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);

// Gets registration details from form because specification states to post to index.php.
if($_SERVER['REQUEST_METHOD'] == "POST" && isset($_POST['firstName'])) {
    $username = $_POST['username'];
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $password = $_POST['password'];
    $display = $_POST['display'];

    // Checks if name is unique.
    $select = mysqli_query($connection, "SELECT * FROM users WHERE username = '".$username."'");
    if(mysqli_num_rows($select)) {
        // Redirect to register.php if username not unique.
        header("Location: register.php");
        die;
    }

    // Checks all fields of the form were inputted.
    if(!empty($username) && !empty($firstName) && !empty($lastName) && !empty($password)) {
        $query = "INSERT INTO Users VALUES ('$username', '$firstName', '$lastName', '$password', '$display');";
        mysqli_query($connection, $query);
    }else {
        // Redirect to register.php if bad input.
        header("Location: register.php");
        die;
    }
}

// If the user is not logged in we need to get their login details from the html form.
if(!isset($_SESSION['username'])) {
    if($_SERVER['REQUEST_METHOD'] == "POST") {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Check login details against the database.
        if(!empty($username) && !empty($password)) {
            $query = "SELECT * FROM Users WHERE Username = '$username' limit 1";
            $result = mysqli_query($connection, $query);
            // If a result is received compare the passwords.
            if ($result && mysqli_num_rows($result) > 0) {
                $userData = mysqli_fetch_assoc($result);
                if($userData['Password'] === $password){
                    $_SESSION['username'] = $userData['UserName'];
                }
            }
        }else {
            echo "wrong username or password!";
        }
    }
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Welcome Page</title>
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
            <?php if(isset($_SESSION['username'])):?>
                <h1 id="welcome-message">Welcome to Tetris</h1>
                <a href="tetris.php" class="button" id="welcome-button">Click here to play</a>
            <?php else : ?>
                <form method="post">
                    <div class="input-title">Login</div>
                    <input class="input" placeholder="username" type="text" name="username"><br><br>
                    <input class="input" placeholder="password" type="password" name="password"><br><br>

                    <input class="button" type="submit" value="Login" name="login_button"><br><br>

                    <p style="margin-left: 5px;">Don't have a user account? <a href="register.php">Register now</a>
                    </p><br><br>

                </form>
            <?php endif; ?>
        </div>
    </div>

    </body>
</html>

