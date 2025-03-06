<?php include 'conn.php';?>
<?php include 'functions.php';?>
<?php

session_start(); //Start the session

$set_name = $_GET['set'];

if ($set_name === "a") {
	$setthename = "Quantum Adventurer";

	$sql = "INSERT INTO names (user_name) VALUES (:user_name)";
	$sth = $conn->prepare($sql);
	$sth->execute(array(':user_name' => $setthename));
	
	$data = $conn->query("SELECT id FROM names ORDER BY id DESC LIMIT 1")->fetchAll();
	// and somewhere later:
	foreach ($data as $row) {
		$_SESSION["id"] = $row["id"];
	}

	$_SESSION["name"] = $setthename;
	
	//echo $_SESSION["name"];
	//echo $_SESSION["id"];
	//die();
	
	$conn = null;
	
	redirect("page2.php");
} else {
	redirect("index.php");
}

?> 