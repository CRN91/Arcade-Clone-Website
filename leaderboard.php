<?php
// Initialising session and connecting to database.
session_start();

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "tetris";

$connection = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);

// Gets the top 10 scores from the database.
//$query = "SELECT Username, Score FROM Scores ORDER BY Score DESC LIMIT 10";
$query = "SELECT Scores.Username, Users.Display, Scores.Score
FROM Scores
INNER JOIN Users ON Scores.Username=Users.Username
ORDER BY Score DESC";
$result = mysqli_query($connection,$query);
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Leaderboard</title>
        <link rel="stylesheet" type="text/css" href="css/style.css"/>
    </head>
    <body>
    <div class="navbar">
        <a href="index.php">Home</a>
        <a class="right" href="leaderboard.php">Leaderboard</a>
        <a class="right" href="tetris.php">Play Tetris</a>
    </div>

    <div class="main">
        <div class="leaderboard">
            <table>
                <tr>
                    <th>Username</th>
                    <th>Score</th>
                </tr>
                <?php // Iterates through each row in the database.
                    while($row = mysqli_fetch_array($result)){
                        if ($row['Display'] == 1) {
                            // Creates a new row in the html table with the username and score.
                            echo "<tr><td>" . $row['Username'] . "</td><td>" . $row['Score'] . "</td></tr>";
                        }
                    }
                ?>
            </table>
        </div>
    </div>
    </body>
</html>
