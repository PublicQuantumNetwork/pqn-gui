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

$sql = "SELECT id, question, option1, option2, option3, option4, option5, option6 FROM survey_questions WHERE question_order = :question_order";
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
	$option6 = $row["option6"];
}

echo show_survey_questions_answers($strip_page_name, 6, $question_id, $question, $option1, $option2, $option3, $option4, $option5, $option6,"", "");

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?> 

<script class="u-script" type="text/javascript" src="/footer.js" defer=""></script>
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