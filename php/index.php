<?php include 'header.php';?>
<?php
$_SESSION["name"] = ""
?>
<?php include 'functions.php';?>
<?= toppagecontainer("1")?>
<div class="u-clearfix" style="max-width:100%; margin-left:250px; position:absolute;">
	<div class="fleft" style="background-image:url('images/speech-bubble-color-left-down.png'); width:400px; height:300px; padding:30px 0px 0px 30px;font-size:1.5em; line-height:1.8em;">
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

<div class="u-clearfix" style="max-width:100%; margin-top:350px; margin-left:-80px; position:absolute;">							
	<div class="fleft">
		<img src="images/index-whobit.png" style="width:350px;">
	</div>
</div>

<div class="u-clearfix" style="max-width:100%; position:absolute;margin-left:765px;">
	<div class="fleft" style="padding:45px 0px 0px 0px; font-size:1.3em;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="set-name.php?set=a" style="padding: 25px 20px; border:4px solid #000;">Continue as Quantum Adventurer</a>
		<br>
		<br>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="set-name.php?set=e" style="padding: 25px 20px; border:4px solid #000;">Continue as Quantum Explorer</a>
		<br>
		<br>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base" href="set-name.php?set=x" style="padding: 25px 20px; border:4px solid #000;">Add your own name</a>
	</div>
</div>
<?php 

echo bottompagecontainer();				
//echo leftnav("#");
//echo rightnav("what-would-you-like-to-do.php");

?>  
<?php include 'footer.php';?>