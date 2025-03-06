<?php include '../conn.php';?>
<?php include '../functions.php';?>
<?php

session_start(); //Start the session

$questionID = $_POST['questionID']; 
$degree = $_POST['degree']; 

$questionOrder = $_POST['questionOrder']; 
$selectedOptions = $_POST['selectedOptions']; 

$answerGiven = '';

$sql = "SELECT question, option1, option2, option3, option4, option5, option6, option7, option8 FROM survey_questions WHERE id = :question_id";
$st = $conn->prepare($sql);
$st->bindValue(':question_id', $questionID);
$st->execute();

if ($st->rowCount() > 0) {
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$question = $ck["question"];
	$option1 = $ck["option1"];
	$option2 = $ck["option2"];
	$option3 = $ck["option3"];
	$option4 = $ck["option4"];
	$option5 = $ck["option5"];
	$option6 = $ck["option6"];
	$option7 = $ck["option7"];
	$option8 = $ck["option8"];
	
	$total_number_options = 3;
	
	if ($option4 != null) {
		$total_number_options = 4;
	}
	
	if ($option5 != null) {
		$total_number_options = 5;
	}
	
	if ($option6 != null) {
		$total_number_options = 6;
	}
	
	if ($option7 != null) {
		$total_number_options = 7;
	} 
	
	if ($option8 != null) {
		$total_number_options = 8;
	}
	
	switch ($total_number_options) {
		case 3:
			$degree = getSection($degree,3);
			
			if ($degree == 1) {
				$answerGiven = $option1;
			}elseif ($degree == 2){
				$answerGiven = $option4;
			}elseif ($degree == 3) {
				$answerGiven = $option3;
			}

			break;
		
		case 4:
			$degree = getSection($degree,4);
			
			if ($degree == 1) {
				$answerGiven = $option1;
			}elseif ($degree == 2){
				$answerGiven = $option4;
			}elseif ($degree == 3) {
				$answerGiven = $option3;
			}elseif ($degree == 4) {
				$answerGiven = $option2;
			}

			break;
		case 5:
			$degree = getSection($degree,5);
			
			if ($degree == 1) {
				$answerGiven = $option1;
			}elseif ($degree == 2){
				$answerGiven = $option2;
			}elseif ($degree == 3) {
				$answerGiven = $option3;
			}elseif ($degree == 4) {
				$answerGiven = $option4;
			}elseif ($degree == 5) {
				$answerGiven = $option5;
			}

			break;
		case 6:
			$degree = getSection($degree,6);
		
			if ($degree == 1) {
				$answerGiven = $option1;
			}elseif ($degree == 2){
				$answerGiven = $option2;
			}elseif ($degree == 3) {
				$answerGiven = $option3;
			}elseif ($degree == 4) {
				$answerGiven = $option4;
			}elseif ($degree == 5) {
				$answerGiven = $option5;
			}elseif ($degree == 6) {
				$answerGiven = $option6;
			}
			break;
	}
}

if ($selectedOptions != "") {
	$answerGiven = $selectedOptions;
}

$answer_to_be_saved = strip_tags($answerGiven);


$sql = "INSERT INTO pqnetwork_db.survey_answers (question_id, question, answer_given, name_id) VALUES (:question_id, :question, :answer_given, :name_id)";
$sth = $conn->prepare($sql);
$sth->execute([
	':question_id' => $questionID,
	':question' => $question,
	':answer_given' => $answer_to_be_saved,
	':name_id' => $_SESSION["id"]
]);

$conn = null;


?> 
