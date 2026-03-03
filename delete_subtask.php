<?php
require_once 'connectdb.php';
$id=$_GET['id'];
mysqli_query($connection,"DELETE FROM subtasks WHERE id='$id'");
?>