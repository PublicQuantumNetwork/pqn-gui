<?php include '../functions.php';?>
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
<?php include '../conn.php';?>

<?php
$strip_page_name = str_replace('/chsh','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:10%;">
		<a href="#" class="tooltip-local" onclick="toggleLayer('ttentangled'); return false;">Entangled photons</a> are flying through the library. We're going to check that they're entangled using a Bell Test.
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="u-clearfix" style="min-height:270px; margin-top:250px; font-size:1.5em;">
		<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="display:none;">
			Entangled photons are light particles that act as if they're connected, even if they are very far apart.<br />
		</div>
	</div>
</div>

<?php 

echo bottompagecontainer();					
echo leftnav("../page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?>  
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="page4.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>