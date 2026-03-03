<?php
$connection = mysqli_connect("localhost", "root", "", "todo_db");

if (!$connection) {
    die("Connection failed: " . mysqli_connect_error());
}
?>