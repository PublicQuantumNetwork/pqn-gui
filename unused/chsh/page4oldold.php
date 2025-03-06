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
	<div class="fleft speech-bubble">
		On the next screen we're going to choose which <a href="#" class="tooltip" onclick="toggleLayer('ttpolarization'); return false;">polarization</a> to measure the <a href="#" class="tooltip" onclick="toggleLayer('ttphoton');return false;">photon</a> in.
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="u-clearfix" style="min-height:270px; margin-top:250px; margin-left:-20px; font-size:1.2em; ">
		<div id="ttpolarization" class="tooltiptext u-white fleft" style="display:none; margin:0px 0px 0px 0px; width:350px; border:2px solid #000000;padding:15px;">
			Polarization is the direction light wiggles. Polarizing sunglasses block light that is wiggling left to right.<br />
		</div>

		<div id="ttphoton" class="tooltiptext u-white" style="display:none; margin:50px 0px 0px 380px; width:350px; border:2px solid #000000; padding:15px;">
			Photons are the smallest possible specks of light. Photons do not weigh anything, so they are the fastest
			particles in the universe. Photons carry information in a quantum network.<br />
		</div>
	</div>
</div>


<?php 

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?>   
<?php include '../footer.php';?>