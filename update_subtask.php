<?php
require_once 'connectdb.php';
$id=$_POST['id'];
$checked=$_POST['checked'];
mysqli_query($connection,"UPDATE subtasks SET checked='$checked' WHERE id='$id'");
?>