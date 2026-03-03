<?php
require_once 'connectdb.php';
$task_id=$_POST['task_id'];
$title=$_POST['title'];
mysqli_query($connection,"INSERT INTO subtasks(task_id,title) VALUES('$task_id','$title')");
?>