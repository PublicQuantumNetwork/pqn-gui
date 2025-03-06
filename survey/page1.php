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

$sql = "SELECT id, question, option1, option2, option3 FROM survey_questions WHERE question_order = :question_order";
$st = $conn->prepare($sql);
$st->bindValue(':question_order', $strip_page_name);
$st->execute();
foreach ($st as $row) {
	$question_id = $row["id"];
	$question = $row["question"];
	$option1 = $row["option1"];
	$option2 = $row["option2"];
	$option3 = $row["option3"];
}

echo show_survey_questions_answers(1, 3, $question_id, $question, $option1, $option2, $option3, "", "", "", "", "");

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("sign-research.php");

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