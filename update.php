<?php
require_once 'connectdb.php';

if(isset($_POST['id']) && isset($_POST['title'])){
    $id = $_POST['id'];
    $title = mysqli_real_escape_string($connection, $_POST['title']);
    $description = mysqli_real_escape_string($connection, $_POST['description']);
    $status = mysqli_real_escape_string($connection, $_POST['status']);

    $update = mysqli_query($connection, "UPDATE tasks SET title='$title', description='$description', status='$status' WHERE id='$id'");

    if($update){
        echo "success";
    } else {
        echo "error: ".mysqli_error($connection);
    }
} else {
    echo "Invalid request";
}
?>