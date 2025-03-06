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
$_SESSION["recalibrate_needed"] = 1;

$strip_page_name = str_replace('/survey','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);

$sql = "SELECT id, question, option1, option2, option3, option4, option5 FROM survey_questions WHERE question_order = :question_order";
$st = $conn->prepare($sql);
$st->bindValue(':question_order', $strip_page_name);
$st->execute();
foreach ($st as $row) {
	$question_id = $row["id"];
	$question = $row["question"];
	$option1 = $row["option1"];
	$option2 = $row["option2"];
	$option3 = $row["option3"];
	$option4 = $row["option4"];
	$option5 = $row["option5"];
}

?>
<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:5%;">
		<?= $question ?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-top:200px;">
	<div class="fleft" style="padding:0px; font-size:1.3em; width:300px;">
		<div id="divOption1" style="padding: 25px 20px; border:2px solid #000; height:125px; vertical-align:middle; background-color:#FFFFFF;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-align-center" href="#" onclick="selectedOptionSave('divOption1', '<?= $option1 ?>', 'txtSelectedOptions');return false;"><?= $option1 ?></a>
		</div>
		<br>
		<br>
		<div id="divOption2" style="padding: 25px 20px; border:2px solid #000; height:125px; vertical-align:middle; background-color:#FFFFFF;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-align-center" href="#" onclick="selectedOptionSave('divOption2', '<?= $option2 ?>', 'txtSelectedOptions');return false;"><?= $option2 ?></a>
		</div>
		<br>
		<br>
		<div id="divOption3" style="padding: 25px 20px; border:2px solid #000; height:125px; vertical-align:middle; background-color:#FFFFFF;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-align-center" href="#" onclick="selectedOptionSave('divOption3', '<?= $option3 ?>', 'txtSelectedOptions');return false;"><?= $option3 ?></a>
		</div>
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-left:1100px; margin-top:200px;">
	<div class="fleft" style="padding:0px; font-size:1.3em; width:300px;">
		<div id="divOption4" style="padding: 25px 20px; border:2px solid #000; height:125px; vertical-align:middle; background-color:#FFFFFF;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-align-center" href="#" onclick="selectedOptionSave('divOption4', '<?= $option4 ?>', 'txtSelectedOptions');return false;"><?= $option4 ?></a>
		</div>
		<br>
		<br>
		<div id="divOption5" style="padding: 25px 20px; border:2px solid #000; height:125px; vertical-align:middle; background-color:#FFFFFF;">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-align-center" href="#" onclick="selectedOptionSave('divOption5', '<?= $option5 ?>', 'txtSelectedOptions');return false;"><?= $option5 ?></a>
		</div>
	</div>
	
	<div style="position:absolute; margin-left:100px; margin-top:360px;">
		<input type="hidden" name="txtNextPage" id="txtNextPage" value="page7.php">
		<input type="hidden" name="txtQuestionOrder" id="txtQuestionOrder" value="6">
		<input type="hidden" name="txtDegree" id="txtDegree" value="90">
		<input type="hidden" name="txtQuestionID" id="txtQuestionID" value="5">
		<input type="hidden" name="txtSelectedOptions" id="txtSelectedOptions">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;" onClick="logSurveyAnswer()" id="Asubmit">SUBMIT</a>
	</div>
</div>
<?php

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

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
<?php include '../footer.php';?>