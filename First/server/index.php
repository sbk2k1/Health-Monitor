<?php
$servername = "remote";
$username = "root";
$password = "password";
$dbname = "your_database";
$setName = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Handle the text insertion request
    $text = $_POST['text'];

    // Check if the text is empty
    if (empty($text)) {
        echo "Text is empty.";
        return;
    }

    try {
        // Create a connection
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $setName);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insert the text into the database with suffix - from server 1 -
        $sql = "INSERT INTO your_table (text) VALUES ('$text - from server 1')";
        $conn->exec($sql);

    } catch (PDOException $e) {
        echo "Error occurred while inserting text: " . $e->getMessage();
    }

    $conn = null;

} else {
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password, $setName);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Fetch texts from the database
        $sql = "SELECT text FROM your_table";
        $stmt = $conn->query($sql);

        // create an HTML list of the texts
        $html = "<ul>";

        if ($stmt->rowCount() > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $html .= "<li>" . $row['text'] . "</li>";
            }

            $html .= "</ul>";
            echo $html;
        } else {
            echo "No texts found.";
        }
    } catch (PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
}

?>