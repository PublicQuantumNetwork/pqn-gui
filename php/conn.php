<?php
$servername = "localhost";
$dbname = "pqnetwork_db";
$username = "pqnetwork_dbuser";
$password = "[t{!,H*_9yrz";

try {
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  //echo "Connected successfully";
} catch(PDOException $e) {
  //echo "Connection failed: " . $e->getMessage();
}
?>