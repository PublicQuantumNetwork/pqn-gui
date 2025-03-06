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

?>
<?php include '../header.php';?>

<?php

$strip_page_name = str_replace('/survey','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);

?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:5.8%;" id="divAddName">
		Thank you! <br>We welcome your feedback on the Public Quantum Network and this survey!
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">								
	<div class="fleft">
		<img src="/images/index-whobit.png" class="whobit-pointing-right">
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-left:800px; margin-top:200px;">
	<div class="u-clearfix" style="margin-top:80px; font-size:1.3em;height: 390px;overflow:scroll; width:450px;">
		<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:420px; text-align:center;">
		Please send us a message on the PQN website at pqnetwork.org.<br><br>
		<img src="/images/qrcode.png">
		</div>
	</div>
</div>

<?php

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("/index.php");

?> 
<script src="../keyboard-email-script.js"></script>
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="/index.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>