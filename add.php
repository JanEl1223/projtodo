<?php
require_once 'connectdb.php';

if(isset($_POST['title'])){
    $title  = mysqli_real_escape_string($connection,$_POST['title']);
    $desc   = mysqli_real_escape_string($connection,$_POST['description'] ?? '');
    $status = 'Pending';

    mysqli_query($connection,
        "INSERT INTO tasks(title,description,status)
         VALUES('$title','$desc','$status')"
    );

    echo "success";
}
?>