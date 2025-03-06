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

$sql = "SELECT id, question FROM survey_questions WHERE question_order = :question_order";
$st = $conn->prepare($sql);
$st->bindValue(':question_order', $strip_page_name);
$st->execute();
foreach ($st as $row) {
	$question_id = $row["id"];
	$question = $row["question"];
}

?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:5.8%;" id="divAddName">
		<?=$question?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">								
	<div class="fleft">
		<img src="/images/index-whobit.png" class="whobit-pointing-right">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft">
		<form name="frmSubmitName" id="frmSubmitName" action="#" method="post">
			<div clas="u-clearfix">
				<div class="fleft" style="font-size:1.3em; width:700px;">
					<input type="hidden" name="txtNextPage" id="txtNextPage" value="page<?=$next_strip_page_name?>.php">
					<input type="hidden" name="txtQuestionOrder" id="txtQuestionOrder" value="14">
					<input type="hidden" name="txtDegree" id="txtDegree" value="90">
					<input type="hidden" name="txtQuestionID" id="txtQuestionID" value="14">
					
					<div id='emailError'></div>
					<br><label for="txtName">Enter your email</label><br>
					<input type="text" name="txtSelectedOptions" id="txtSelectedOptions" maxlength="200" class="text-area use-keyboard-input" style="width:385px; border:2px solid #000000;">&nbsp;&nbsp;<br><br><a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 0px 10px; border:2px solid #000; width:125px; text-align:center; font-weight:bold;" onClick="emailSurvey()" id="Asubmit">SUBMIT</a>
				</div>
			</div>
		</form>
	</div>
</div>

<?php

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?> 
<script src="../keyboard-email-script.js"></script>
<script>
	window.addEventListener('load', () => {
	  const targetElement = document.getElementById('Asubmit'); 

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
	});
</script>
<?php include '../footer.php';?>