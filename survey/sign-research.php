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

$s = "";
if (isset($_GET["s"])) {
	$s = $_GET["s"];
}
if ($s == "") {
	$s = "o";
}

?>
<?php include '../header.php';?>

<?php

$strip_page_name = "Research";


echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:12%;">
		Please read the text and click yes if you would like to take the survey. 
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<?php

	$consentTitle = "";
	$consentBody = "";

	if ($s == "u") {
		$consentTitle = $consentUTitle;
		$consentBody = $consentUBody;
		
		$onClickButton = "onClick='emailConsent()'";
	}elseif ($s == "o") {
		$consentTitle = "PQN Consent Cover Letter";
		$consentBody = "<br>The purpose of this research study is to gauge how well quantum concepts are being conveyed at the PQN table at the library. We are doing this study to make quantum concepts better accessible to young people and the general public.<br><br>" . 
			"We would like you to complete a survey after you have finished the PQN activities, which we will use to see how well we explained concepts.  There are minor loss of confidentiality issues associated with participating in this study, that could arise if the surveys are lost from our staff, but we will make every effort to safeguard your information. You may not experience any direct benefits from your participation, but we hope to learn more about how to teach quantum mechanics.<br><br>" .
			"The survey will only be seen by staff on the Public Quantum Network project. Your name will not be attached to any of the analysis we do on the survey, or be identified in any publications. The information collected in this research will not be used for future research studies. If you do not want to participate, please do not fill out the survey.<br><br>" .
 			"If you have any questions, complaints, or if you feel you have been harmed by this research please contact Virginia Lorenz, Department of Physics, University of Illinois Urbana-Champaign, vlorenz@illinois.edu. <br><br> " .
 			"If you have any questions about your rights as a research subject, including concerns, complaints, or to offer input, you may call the Office for the Protection of Research Subjects (OPRS) at 217-333-2670 or e-mail OPRS at irb@illinois.edu.<br><br>" .
 		 	"It should take 5 minutes to complete the survey. Participation in this study is voluntary. You can choose not to take part. You can choose not to finish the questionnaire or omit any question you prefer not to answer without penalty or loss of benefits. <br><br> " .
 			"By clicking the submit button, you are giving your consent to participate as well as confirming you are over 18 years old.<br><br> " .
			"We greatly value your participation in this survey and hope the experience is beneficial for your education as well.<br><br>";
			
		$onClickButton = "onClick='proceedResearch()'";

	}
?>

<div class="u-clearfix right-side-wrapper" style="margin-left:500px; margin-top:90px;">
	<div class="u-clearfix" style="margin-top:80px; font-size:1.3em;height: 390px;overflow:scroll; width:950px;">
		<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:920px; text-align:center;">
		<strong><?= $consentTitle ?></strong><br> 
		<?= $consentBody ?>
		</div>
	</div>
	<div class="u-clearfix" style="margin-top:20px; margin-left:200px; width:700px;">
		<div class="fleft">

			<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:185px; text-align:center; font-size:1.3em; font-weight:bold;" <?=$onClickButton?> id="Asubmit">Yes, I agree</a>
		</div>
		<div class="fleft">
			<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:275px; text-align:center; font-size:1.3em; font-weight:bold;" onClick="refuseResearch()" id="AsubmitNo">No, I changed my mind</a>
		</div>
	</div>

	
</div>

<?php

echo bottompagecontainer();					
echo leftnav("page1.php");
//echo rightnav("page" . $next_strip_page_name . ".php");

?> 


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
<script src="../keyboard-script.js"></script>

<?php include '../footer.php';?>