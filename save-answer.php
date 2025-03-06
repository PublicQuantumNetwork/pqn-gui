<?php
include 'conn.php';
include 'functions.php';

session_start(); //Start the session

$qi = $_GET['qi'];
$pi = $_GET['pi'];
$deg = 0;
if (isset($_GET['deg'])) {
	$deg = $_GET['deg'];
}

$rp = $_GET['rp'];
$ni = $_GET['ni'];
if (isset($_GET['play'])) {
	$player_id = $_GET['play'];
}

$returndata = '';
if (isset($_GET['returndata'])){
	$returndata = $_GET['returndata'];
	if ($returndata == '') {
		$returndata = 1;
	}
}

$returnerror = '';
if (isset($_GET['returnerror'])) {
	$returnerror = $_GET['returnerror'];
}

if (!isset($_SESSION["counting_returned_bits"])) {
	$_SESSION["counting_returned_bits"] = 1;
}

if (($pi == 2) && ($pi == 3)) {
	$_SESSION["counting_returned_bits"] = $_SESSION["counting_returned_bits"] + $returndata;
}

//echo $ni;
//insert into the table only if they agree
//if ($pi == 2) {
	$sql = "INSERT INTO gtk_parity_correct_answers (name_id, question_id) VALUES (:name_id, :question_id)";
    //echo $sql;
	$sth = $conn->prepare($sql);
    $sth->execute([
        ':name_id' => $ni,
        ':question_id' => $qi,
    ]);
//}

//die();

$question = '';
$answer_given = '';

if ($deg == '') {
    $deg = 0;
}

if ($rp == '') {
    $rp = ($_SERVER['HTTP_REFERER'] != '') ? $_SERVER['HTTP_REFERER'] : '../index.php';
}

//$pi = 2 get to know/parity
//$pi = 3 send a secret message/qkd
if (($pi = 2) && ($_SESSION["counting_returned_bits"] == 4)) {
	$rp = "/gtk/page7.php";
}

if (($pi = 3) && ($_SESSION["counting_returned_bits"] == 4)) {
	$rp = "/sam/page7.php";
}

if ($pi = 1) {
	$rp = $rp . "?v=" . $returndata . "&e=" . $returnerror;
}

try {
    $sql = "SELECT question, option1, option2 FROM questions WHERE id = :question_id";
    $st = $conn->prepare($sql);
    $st->bindValue(':question_id', $qi);
    $st->execute();

    if ($st->rowCount() > 0) {
        $ck = $st->fetch(PDO::FETCH_ASSOC);
        $question = $ck["question"];
        $leftoption = $ck["option1"];
        $rightoption = $ck["option2"];
		
		$eval_answer_given = getSection($deg,2);
		
		$answer_given = ($eval_answer_given == 1) ? $rightoption : $leftoption;
    }

    $sql = "INSERT INTO answers (protocol_id, name_id, equipment_id, question_asked, answer_given, player_number, question_id, degree_captured) VALUES (:protocol_id, :name_id, :equipment_id, :question_asked, :answer_given, :player_number, :question_id, :degree)";
    $sth = $conn->prepare($sql);
    $sth->execute([
        ':protocol_id' => $pi,
        ':name_id' => $ni,
        ':equipment_id' => '0',
        ':question_asked' => $question,
        ':answer_given' => $answer_given,
        ':player_number' => $player_id,
        ':question_id' => $qi,
        ':degree' => $deg,
    ]);
} catch (PDOException $e) {
    // Handle the exception, e.g., log the error or display a user-friendly message
    error_log('Database error: ' . $e->getMessage());
    redirect($rp);
    exit;
}

$conn = null;
redirect($rp);
?>