<?php include 'functions.php';?>
<?php
session_start(); //Start the session

if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}
?>
<?php include 'header.php';?>
<?php include 'conn.php';?>

<?php
$strip_page_name = str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME']));

echo toppagecontainer($strip_page_name);
?>
<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:20% 10%;">
		Hi, <?= $setname ?>!<br>
		What would you like to do?
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft" style="padding:205px 0px 0px 0px; font-size:1.3em;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="chsh/page3.php" style="padding: 25px 20px; border:2px solid #000;">Verify Quantum Link (single player)</a>
		<!--<br>
		<br>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="sam/page3.php" style="padding: 25px 20px; border:2px solid #000;">Share a secret message (multi-player)</a>
		<br>
		<br>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="gtk/page3.php" style="padding: 25px 20px; border:2px solid #000;">Get to know someone (multi-player)</a>-->
		<br>
		<br>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="for/page3.php" style="padding: 25px 20px; border:2px solid #000;">Quantum Fortune (single player)</a>
	</div>
</div>
<?php 

echo bottompagecontainer();					
echo leftnav("index.php");
//echo rightnav("#");

?>   
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  // Get the <a> element you want to click
	  const link = document.querySelector('a[href="chsh/page3.php"]'); 

	  // Add an event listener for the Enter key press
	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click(); // Simulate a click on the <a> element
		}
	  });
	});
</script>
<?php include 'footer.php';?>