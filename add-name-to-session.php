<?php include 'conn.php';?>
<?php include 'functions.php';?>
<?php

session_start(); //Start the session

if ($_SERVER['HTTP_REFERER'] == "https://pqnetwork.web.illinois.edu/add-name.php") {

	$v = $_GET['v'];

	$setthename = $v;

	$sql = "INSERT INTO names (user_name) VALUES (:user_name)";
	$sth = $conn->prepare($sql);
	$sth->execute(array(':user_name' => $setthename));

	$data = $conn->query("SELECT id FROM names ORDER BY id DESC LIMIT 1")->fetchAll();
	// and somewhere later:
	foreach ($data as $row) {
		$_SESSION["id"] = $row["id"];
	}

	$_SESSION["name"] = $setthename;

	$conn = null;

	redirect("page2.php");
} else {
	$_SESSION["name"] = "";
	$conn = null;

	redirect("index.php");
}


?> 