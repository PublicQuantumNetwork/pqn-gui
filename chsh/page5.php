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
	<div class="fleft speech-bubble" style="padding:7%;">
		Now, choose <strong>angle #2</strong>! Asking the photons as different a question as possible from the first will make a stronger test!
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

<?php
echo showModal("<div class='clearfix'><div class='fleft' style='width:27%;'><img src='/images/gif_pqn.gif' width='250'></div><div class='fleft' style='width:65%;'><span style='text-align:center;'><strong>What is really happening here?</strong></span><br><span style='text-align:left;'>The entangled photons are being measured at the first angle you chose for one photon and at a slightly offset angle for the other photon. These measurements are repeated for the second angle. By comparing the results, we can tell whether the photons are entangled. 
		<br><img src='/images/pqnbehindthescenesQRcode.png' style='width:150px; margin:20px 0px;'><br>Scan the code for a full explanation.<br>This may take a few minutes.</span></div></div>");
?>

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
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;" data-toggle="modal" data-target="#myModal" onClick="sendCHSHValueToLabAngle2('1','/chsh/page6.php','<?=$setid?>','')" id="Asubmit">SUBMIT</a>
	</div>
</div>

<?php 

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
//echo rightnav("page" . $next_strip_page_name . ".php");

?> 

<script class="u-script" type="text/javascript" src="/footer.js" defer=""></script>
<!-- Add Bootstrap JS dependencies -->
<script>
	window.addEventListener('load', () => {
	  const targetElement = document.getElementById('Asubmit'); 

	  if (targetElement) {
		  targetElement.addEventListener('click', (event) => {
			if (event.key === 'Enter') {
			  targetElement.click(); 
			}
		  });

		  document.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
			  targetElement.click(); 
			}
		  });
	   }
	});
</script>
<?php include '../footer.php';?>
