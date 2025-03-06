<?php include '../conn.php';?>
<?php include '../functions.php';?>
<?php

session_start(); //Start the session

$emoji = $_GET["e"];
//echo $emoji;


if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("/index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}

//if (!isset($_SESSION["emoji"])) {
	$_SESSION["emoji"] = $emoji;
	
	$sql = "INSERT INTO emojis_saved (name_id, emoji) VALUES (:name_id, :emoji)";
    //echo $sql;
	$sth = $conn->prepare($sql);
    $sth->execute([
        ':name_id' => $setid,
        ':emoji' => $emoji,
    ]);
//}

//die();
redirect("/sam/page6.php");



?> 