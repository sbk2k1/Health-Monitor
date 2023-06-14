<?php
// Check if the form is submitted and process the data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['text']) && !empty($_POST['text'])) {
        $newText = $_POST['text'];

        // Send a POST request to add data to the server
        $postData = http_build_query(['text' => $newText]);
        $options = [
            'http' => [
                'method' => 'POST',
                'header' => 'Content-Type: application/x-www-form-urlencoded',
                'content' => $postData
            ]
        ];
        $context = stream_context_create($options);
        $result = file_get_contents('http://server:80/', false, $context); // Replace 'server' with the actual server hostname or IP address

        // Check the result and display a success or error message
        if ($result === false) {
            echo "Failed to add the text.";
        } else {
            header("Refresh:0");
            exit();
        }
    }
}

echo "The Data is <br/>";

// Perform a GET request to fetch data from the server
$response = file_get_contents('http://server:80/'); // Replace 'server' with the actual server hostname or IP address

// Create a HTML list of the texts from the string response
$html = "<ul>";

if (!empty($response)) {
    $texts = explode("\n", $response);
    foreach ($texts as $text) {
        $html .= "<li>" . $text . "</li>";
    }

    $html .= "</ul>";
    echo $html;
} else {
    echo "No texts found.";
}

// Create an HTML form that submits data to the server
$formHtml = <<<HTML
<form method="post">
    <input type="text" name="text" placeholder="Enter text here" />
    <input type="submit" value="Submit" />
</form>
HTML;

echo $formHtml;
?>
