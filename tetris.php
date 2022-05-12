<?php
// Initialising session and connecting to database.
session_start();

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "tetris";

$connection = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);

if(!isset($_SESSION['username'])) {
    // Redirect to index if not logged in.
    header("Location: index.php");
    die;
}

$username = $_SESSION['username'];
// Gets the score and updates the database if applicable.
if($_SERVER['REQUEST_METHOD'] == "POST") {
    // Gets score from invisible form accessed by javascript.
    $score = $_POST['score-from-form'];
    // Gets the score of the user from the database.
    $query = "SELECT * FROM scores WHERE Username = '$username' limit 1";
    $result = mysqli_query($connection, $query);
    if ($result && mysqli_num_rows($result) > 0) {
        $userData = mysqli_fetch_assoc($result);
        if ($userData['Score'] < $score) { // If its a high score update db.
            $query = "UPDATE Scores SET Score = '$score' WHERE Username = '$username' ";
            mysqli_query($connection, $query);
        }
    } else { // If no username found add them and their score.
        $query = "INSERT INTO Scores (Username, Score) VALUES ('$username', '$score')";
        mysqli_query($connection, $query);
    }
}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="utf-8">
        <script src="app.js" charset="utf-8"></script>
        <link rel="stylesheet" href="css/style.css"><link>
        <title>ECM1417</title>
    </head>
    <body>
    <div class="navbar">
        <a href="index.php">Home</a>
        <a class="right" href="leaderboard.php">Leaderboard</a>
        <a class="right" href="tetris.php">Play Tetris</a>
    </div>

    <div class="main">
        <audio loop id="tetris_theme" preload="auto">
            <source url="tetrisTheme.mp3" type="audio/mpeg" >
        </audio>
        <form id="score-form" name="score-form" action="" method="POST">
            <input id="score-input" name="score-from-form" value="">
        </form>
        <div id="score-div">Score: <span id="score">0</span></div>
        <button class="button" id="start-button">Start the game</button>
        <div class="tetris-bg", id="tetris-bg"></div>
    </div>

    </body>
</html>