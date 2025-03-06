<?php include '../functions.php';?>
<?php include '../conn.php';?>
<?php
session_start(); //Start the session

if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("/index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}

if (!isset($_SESSION["player_id"]) || ($_SESSION["player_id"] === "")) {
	redirect("page3.php");
} else {
	$sql = "SELECT player_number FROM players WHERE id = :player_id ";
	$st = $conn->prepare($sql);
	$st->bindValue(':player_id', $_SESSION["player_id"]);
	$st->execute();

	if ($st->rowCount() == 0){
		redirect("page3.php");
	}
}

?>
<?php include '../header.php';?>

<?php
$strip_page_name = str_replace('/gtk','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>
<div class="u-clearfix" style="max-width:100%; margin-left:600px; position:absolute;">
	<div class="fleft" style="background-image:url('/images/speech-bubble-color-left-down.png'); width:400px; height:300px; padding:25px 20px 0px 30px;font-size:1.3em; line-height:1.8em;">
		To answer each question, turn the wheel and hit the button.
	</div>
</div>

<div class="u-clearfix" style="max-width:100%; margin-top:400px;margin-left:300px; position:absolute;">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" style="width:350px;">
	</div>
</div>

<?php 

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?>   
<?php include '../footer.php';?>