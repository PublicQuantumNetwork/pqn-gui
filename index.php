<?php include 'header.php';?>
<?php include 'conn.php';?>
<?php
$_SESSION["name"] = "";

$sql = "INSERT INTO players_history (name_id, protocol_id, player_number, added_on) SELECT name_id, protocol_id, player_number, added_on FROM players ";
$sth2 = $conn->prepare($sql);
$sth2->execute();

$sql = "DELETE FROM players";
$sth2 = $conn->prepare($sql);
$sth2->execute();

//$sql = "INSERT INTO answers_history (protocol_id, name_id, equipment_id, question_asked, answer_given, player_number, added_on, question_id) SELECT protocol_id, name_id, equipment_id, question_asked, answer_given, player_number, added_on, question_id FROM answers ";
//$sth2 = $conn->prepare($sql);
//$sth2->execute();

//$sql = "DELETE FROM answers";
//$sth2 = $conn->prepare($sql);
//$sth2->execute();

if (isset($_SESSION["pull_question_number_id"])) {
	unset($_SESSION["pull_question_number_id"]);
}

if (isset($_SESSION["pull_question_count"])) {
	unset($_SESSION["pull_question_count"]);
}

if(!isset($_SESSION["counting_returned_bits"])) {
	$_SESSION["counting_returned_bits"] = 0;
}

if (isset($_SESSION["total_questions_asked"])) {
	unset($_SESSION["total_questions_asked"]);
}

if (isset($_SESSION["counting_returned_bits"])) {
	unset($_SESSION["counting_returned_bits"]);
}

if (!isset($_SESSION["emoji"])) {
	$_SESSION["emoji"] = "";
	
	$sql = "DELETE FROM emojis_saved";
	$sth2 = $conn->prepare($sql);
	$sth2->execute();

}

if (isset($_SESSION["player_id"])) {
	$_SESSION["player_id"] = "";
}

$_SESSION["fortune_count"] = 0;
$_SESSION["fortune_string"] = "";

$_SESSION["player_number"] = 0;

?>
<?php include 'functions.php';?>
<?= toppagecontainer("1")?>
<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:20%;">
		<?php

		$defaultmsg = "Hi, I'm Whobit!<br>What's your name?";

		if(isset($_GET['m'])) {
			$msg = $_GET['m'];

			if ($msg === "1") {
				echo "<span style='color:#FF0000;'>Please choose a name to continue</span>";
			} else {

				echo $defaultmsg;

			}
		} else {
			echo $defaultmsg;
		}
		?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">								
	<div class="fleft">
		<img src="images/index-whobit.png" class="whobit-pointing-right">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft" style="padding:205px 0px 0px 0px; font-size:1.3em;">
		<a class="u-button-style u-white u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="set-name.php?set=a" style="padding: 25px 20px; border:2px solid #000; width:410px; text-align:center;" id="quantum-adventurer-button">Continue as 'Quantum Adventurer'</a>
		<br>
		<br>
		<a class="u-button-style u-white u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="add-name.php" style="padding: 25px 20px; border:2px solid #000; width:410px; text-align:center;">Add your own name</a>
	</div>
</div>
<?php 

echo bottompagecontainer();				
//echo leftnav("#");
//echo rightnav("what-would-you-like-to-do.php");

?>
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  // Get the <a> element you want to click
	  const link = document.querySelector('a[href="set-name.php?set=a"]'); 

	  // Add an event listener for the Enter key press
	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click(); // Simulate a click on the <a> element
		}
	  });
	});
</script>
<?php include 'footer.php';?>
