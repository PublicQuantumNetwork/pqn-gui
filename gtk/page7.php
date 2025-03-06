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

$protocol_name = 'gtk';

$protocol_id = 0;
$sql = "SELECT id FROM protocols WHERE protocol_name = 'gtk'";
$data = $conn->query($sql)->fetchAll();
foreach ($data as $row) {
	$protocol_id = $row["id"];
}

$sql = "SELECT id FROM players WHERE protocol_id = :protocol_id AND name_id = :name_id ";
$st = $conn->prepare($sql);
$st->bindValue(':protocol_id', $protocol_id);
$st->bindValue(':name_id', $setid);
$st->execute();
if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$_SESSION["player_id"] = $ck["id"];
}

if (!isset($_SESSION["player_id"])) {
	redirect("page3.php");
}

if (isset($_SESSION["pull_question_number_id"])) {
	unset($_SESSION["pull_question_number_id"]);
}

$list_of_questions = '';


//select total number of questions for protocol
//$sql = "SELECT COUNT(id) question_count FROM questions WHERE protocol_id = :protocol_id";
//$st = $conn->prepare($sql);
//$st->bindValue(':protocol_id', $protocol_id);
//$st->execute();
//if ($st->rowCount() > 0){
//	$ck = $st->fetch(PDO::FETCH_ASSOC);
//	$questionTotalCount = $ck["question_count"];
//}	
//
//if ($questionTotalCount == '') {
	$questionTotalCount = 4;
//}

$sql = "SELECT q.question FROM pqnetwork_db.gtk_parity_correct_answers a INNER JOIN questions q ON a.question_id = q.id WHERE a.name_id = :name_id";
$st = $conn->prepare($sql);
$st->bindValue(':name_id', $setid);
$st->execute();
$number_of_rows = $st->rowCount(); 

while ($row = $st->fetch(PDO::FETCH_ASSOC)) {

	if ($list_of_questions == '') {
		$list_of_questions = "<ul>";
	}
	$list_of_questions = $list_of_questions . "<li>" . $row["question"] . "</li>";
}

if ($list_of_questions != '') {
	$list_of_questions = $list_of_questions . "</ul>";
}

$player_percentage = percent($number_of_rows/$questionTotalCount);

$on_stars = $number_of_rows;

?>
<?php include '../header.php';?>

<?php
$strip_page_name = str_replace('/gtk','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:15%;">
		<?php
			echo "Good job! <br>You agree on " . $player_percentage . " of questions!";
		?>
		<!--Good job!<br>You agree on <div id="divPerc" class="loading"></div> of questions!-->
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-left:430px;">
	<div class="u-clearfix" style="margin-top:200px; font-size:1.3em;height: 490px;overflow:scroll; width:950px;">
		<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:920px;">
		<?php
		for ($i=0;$i<$questionTotalCount;$i++) {
			if ($i<=$on_stars) {
				echo "<img src='/images/star-on.png' style='width:50px;'>";
			}else {
				echo "<img src='/images/star-off.png' style='width:50px;'>";
			}
		}
		?>
		
		<br>These are the questions you agree on: <br><span style="text-align:left;"><?=$list_of_questions?></span>
		</div>
	</div>
</div>

<?php 

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("/survey/page1.php");

?>   

<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="/survey/page1.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>