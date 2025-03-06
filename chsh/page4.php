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
$_SESSION["recalibrate_needed"] = 1;

$strip_page_name = str_replace('/chsh','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper" style="margin-top:-220px;">
	<div class="fleft speech-bubble">
		By turning the wheel, you choose which <a href="#" class="tooltip-local" onclick="toggleLayer('ttpolarization'); return false;">polarization</a> to offer the <a href="#" class="tooltip-local" onclick="toggleLayer('ttphoton');return false;">photons</a>. Turn the wheel and press the button to choose <strong>angle #1</strong>!

		<div id="ttpolarization" class="tooltiptext u-white fleft pqntooltip" style="display:none; margin-left: 395px; margin-top:-212px;">
			Polarization is the direction light wiggles. The wheel has a polarizer that asks the photons if they are wiggling a certain direction or not. Because the photons are entangled, their answers should be connected.<br />
		</div>

		<div id="ttphoton" class="tooltiptext u-white pqntooltipnarrow" style="display:none; margin-left: -255px; margin-top:-150px;">
			Photons are the faintest possible specks of light.<br />
		</div>
	</div>
</div>


<div class="u-clearfix whobit-straight-wrapper" style="margin-top:180px;">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>


<div class="u-clearfix right-side-wrapper" style="margin-top:10px;">
	<div class="fleft" style="height:550px;">
		<!--<iframe id="turnwheel" frameborder="1" style="width:100%; height:100%;"></iframe>-->
		<div id="dial_container" style="height:550px; width:550px;">
			<div style="position:absolute; z-index:0;width:100%;">
				<div class="fleft" style="border:0px solid #000; width:100%; height:100%; font-size:2em; margin: 100px 0px 0px 40px;">
				A
				</div>
				<div class="fleft" style="border:0px solid #000; width:100%; height:100%;font-size:2em; margin: -165px 0px 0px 245px;">
				V
				</div>

				<div class="fleft" style="border:0px solid #000; width:100%; height:100%; font-size:2em; margin: -65px 0px 0px 460px;">
				D
				</div>
				<div class="fleft" style="border:0px solid #000; width:100%; height:100%;font-size:2em; margin: 68px 0px 0px 520px;">
				H
				</div>
			</div>
			<div style="position:absolute; z-index:30; margin: 60px 0px 0px 265px;">
				<img src="/images/arrow.png" class="circle-arrow">
			</div>
		</div>
	</div>
</div>

<div class="u-clearfix" style="margin-top:400px; margin-left:630px;">
	<div style="position:absolute; margin-top:25px; margin-left:-70px; width:300px;">
		<div class="slidecontainer" style="width:100%;">
		  <input type="range" min="0" max="360" value="0" style="width:100%; display:none;" id="circle-range" onChange="setCircle(this.value)" list="values">
		  	<datalist id="values" style="display:none;">
			  <option value="0" label="0&deg;"></option>
			  <option value="90" label="90&deg;"></option>
			  <option value="180" label="180&deg;"></option>
			  <option value="270" label="270&deg;"></option>
			  <option value="360" label="360&deg;"></option>
			</datalist>
		</div>
	</div>

	<div style="position:absolute; margin-left:570px; margin-top:25px;">
		<input type="hidden" name="txtDegree" id="txtDegree" value="90">
		<input type="hidden" name="txtQuestionID" id="txtQuestionID" value="0">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;"  onClick="sendCHSHValueToLab('1','/chsh/page5.php','<?=$setid?>','')" id="Asubmit">SUBMIT</a>
	</div>
</div>

<?php 

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
//echo rightnav("page" . $next_strip_page_name . ".php");

?> 

<script class="u-script" type="text/javascript" src="/footer.js" defer=""></script>
<script>
	// Wait for the page to fully load
	window.addEventListener('load', () => {
	  // Get the element you want to trigger the click event on
	  const targetElement = document.getElementById('Asubmit'); 

	  // Add a click event listener to the target element
	  targetElement.addEventListener('click', (event) => {
		// Code to execute when the element is clicked
		if (event.key === 'Enter') {
		  // Trigger the click event on the target element
		  targetElement.click(); 
		}
	  });

	  // Add a keypress event listener to the document
	  document.addEventListener('keypress', (event) => {
		// Check if the pressed key is Enter
		if (event.key === 'Enter') {
		  // Trigger the click event on the target element
		  targetElement.click(); 
		}
	  });
	});
</script>
<?php include '../footer.php';?>