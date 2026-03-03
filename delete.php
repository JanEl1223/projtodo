<?php
require_once 'connectdb.php';
$id=$_GET['id'];
mysqli_query($connection,"DELETE FROM tasks WHERE id='$id'");
header('Location:index.php');
?>