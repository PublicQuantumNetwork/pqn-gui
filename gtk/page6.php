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

if (!isset($_SESSION["pull_question_number_id"])) {
	$_SESSION["pull_question_number_id"] = 1;
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

//$previous_question_id = '';
$total_question_count = 0;
$question_count = 0;
$question = '';
$option1 = '';
$option2 = '';

//if (isset($_SESSION["previous_question_id"])) {
	//$previous_question_id = $_SESSION["previous_question_id"];
//}

if (isset($_SESSION["total_questions_asked"])) {
	$total_question_count  = $_SESSION["total_questions_asked"];
}

$sql = "SELECT COUNT(id) question_count FROM questions WHERE protocol_id = :protocol_id";
//echo $sql . $protocol_id;
$st = $conn->prepare($sql);
$st->bindValue(':protocol_id', $protocol_id);
$st->execute();

if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$question_count = $ck["question_count"];
}

//do not set to $total_question_count > $question_count - will error!!!
if ($total_question_count >= 4) {
	$_SESSION["total_questions_asked"] = 0;
	unset($_SESSION["pull_question_number_id"]);
	redirect("page7.php");
} else {
	$sql = "SELECT id, question, option1, option2 FROM questions WHERE id = :pull_question_id AND protocol_id = :protocol_id";
	//echo "protocol_id: " . $protocol_id . "<br>";
	//echo "name_id: " . $setid . "<br>";
	//echo "question_id: " . $previous_question_id . "<br>";
	//echo $sql;
	$st = $conn->prepare($sql);
	$st->bindValue(':protocol_id', $protocol_id);
	//$st->bindValue(':name_id', $setid);
	$st->bindValue(':pull_question_id', $_SESSION["pull_question_number_id"]);
	//if ($previous_question_id != '') {
		//$st->bindValue(':question_id', $previous_question_id);
		if (!isset($_SESSION["total_questions_asked"])) {
			$_SESSION["total_questions_asked"] = 1;
		} else {
			$_SESSION["total_questions_asked"] = $_SESSION["total_questions_asked"] + 1;
		}
	//}
	//echo $sql . "<BR>";
	$st->execute();

	if ($st->rowCount() > 0){
		$ck = $st->fetch(PDO::FETCH_ASSOC);
		$question_id = $ck["id"];
		$_SESSION["previous_question_id"] = $question_id;
		$question = $ck["question"];
		$option1 = $ck["option1"];
		$option2 = $ck["option2"];
		$_SESSION["pull_question_number_id"] = $_SESSION["pull_question_number_id"] + 1;
	}
}

if ($question == '') {
	$_SESSION["total_questions_asked"] = 0;
	redirect("page7.php");
}

//echo $total_question_count . "<BR>";
//echo $question_count . "<BR>";
?>
<?php include '../header.php';?>

<?php
$_SESSION["recalibrate_needed"] = 1;

$strip_page_name = str_replace('/gtk','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);

if (strlen($question) < 70) {
	$perc = 15;
} else if (strlen($question) >= 70 && strlen($question) < 90) {
	$perc = 10;
} else if (strlen($question) >= 90 && strlen($question) < 110) {
	$perc = 7;
} else if (strlen($question) >= 110 && strlen($question) < 210) {
	$perc = 6;
} else {
	$perc = 10;
}
?>

<div class="u-clearfix speech-bubble-wrapper" style="margin-top:-200px;">
	<div class="speech-bubble" style="padding:<?=$perc?>%;">
		<?php
		echo $question;
		?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper" style="margin-top:200px;">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft" style="height:550px;">
		<div id="dial_container" style="height:550px; width:550px;">
			<div style="position:absolute; z-index:0;width:100%; height:225px;margin-top:110px;margin-left:85px;">
				<div class="fleft" style="border:0px solid #000; width:48%; height:100%; font-size:1.5em; text-align:center; margin-top:110px;">
				<?php
				echo $option1;
				?>
				</div>
				<div class="fleft" style="border:0px solid #000; width:48%; height:100%;font-size:1.5em; text-align:center; margin-top:110px; margin-left:10px;">
				<?php
				echo $option2;
				?>
				</div>
			</div>
			
			<div style="position:absolute; z-index:30; margin: 60px 0px 0px 265px;">
				<img src="/images/arrow.png" class="circle-arrow">
			</div>
		</div>
	</div>
</div>

<?php
$makeModal = '';


echo showModal("<div class='clearfix'><div class='fleft' style='width:27%;'><img src='/images/gif_pqn.gif' width='250'></div><div class='fleft' style='width:65%;'><span style='text-align:center;'><strong>What is really happening here?</strong></span><br><span style='text-align:left;'>The entangled photons are being measured at the first angle you chose for one photon and at a slightly offset angle for the other photon. These measurements are repeated for the second angle. By comparing the results, we can tell whether the photons are entangled. 
		<br><img src='/images/pqnbehindthescenesQRcode.png' style='width:150px; margin:20px 0px;'><br>Scan the code for a full explanation.<br>This may take a few minutes.</span></div></div>");

//if (($total_question_count-1) === $_SESSION["pull_question_number_id"]) {
	$makeModal = 'data-toggle="modal" data-target="#myModal"';
	
	$onClick = "sendValueToLabParity('" . $protocol_id . "', '/gtk/page6.php', '" . $setid . "', '" . $_SESSION['player_id'] . "', '" . $_SESSION['player_number'] . "');";
	
	
//} else {
//	$makeModal = 'data-toggle="modal" data-target="#myModal"';
	
//	$onClick = "sendValueToLabParityNoReturn('" . $protocol_id . "', '/gtk/page6.php', '" . $setid . "', '" . $_SESSION['player_id'] . "', '" . $_SESSION['player_number'] . "');";
//}
?>

<div class="u-clearfix" style="margin-top:400px; margin-left:630px;">
	<div style="position:absolute; margin-top:25px; margin-left:-70px; width:300px;">
		<div class="slidecontainer" style="width:100%;">
		  <input type="range" min="0" max="360" value="0" style="width:100%; display:none;" id="circle-range" onChange="setCircle(this.value)" list="values">
		  	<datalist id="values" style="display:none;">
			  <option value="0" label="0&deg;"></option>
			  <option value="90" label="90&deg;" style="padding: 10px 110px 0px 0px"></option>
			  <option value="270" label="270&deg;"></option>
			</datalist>
		</div>
	</div>
	
	<?php
		
	?>

	<div style="position:absolute; margin-left:570px; margin-top:25px;">
	<input type="hidden" name="txtQuestionID" id="txtQuestionID" value="<?=$question_id?>">
	<input type="hidden" name="txtDegree" id="txtDegree" value="90">
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;" <?=$makeModal?> onClick="<?=$onClick?>" id="Asubmit">SUBMIT</a>
	</div>
</div>


<?php 

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