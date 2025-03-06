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
$sql = "SELECT id FROM protocols WHERE protocol_name = 'sam'";
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

//echo '$protocol_id ' . $protocol_id . "<BR>";
//echo '$p ' . $p . "<BR>";
//echo 'eval ' . ($p == 1) . "<BR>";

//first check if the current user has a session
$sql = "SELECT COUNT(id) player_count FROM players WHERE protocol_id = :protocol_id ";
$st = $conn->prepare($sql);
$st->bindValue(':protocol_id', $protocol_id);
$st->execute();

//echo ($st->rowCount());

if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$player_count = $ck["player_count"];

	//echo '$player_count: ' . $player_count . "<BR>";
	//echo 'double check: ' . ($player_count >= 2) . "<BR>";

	if ($player_count == 0) {
		$sql = "INSERT INTO players (name_id, protocol_id, player_number) VALUES (:name_id, :protocol_id, :player_number)";
		$sth2 = $conn->prepare($sql);
		$sth2->execute(array(':protocol_id' => $protocol_id, ':name_id' => $setid, ':player_number' => '1'));

		$data = $conn->query("SELECT id FROM players ORDER BY id DESC LIMIT 1")->fetchAll();
		foreach ($data as $row) {
			$_SESSION["player_id"] = $row["id"];
		}
		$insertplayer_number = 1;
	} elseif ($player_count == 1) {
		//echo 'here<br>';
		if ($_SESSION["player_id"] == "") {
			$sql = "INSERT INTO players (name_id, protocol_id, player_number) VALUES (:name_id, :protocol_id, :player_number)";
			//echo $sql . "<BR>";
			$sth2 = $conn->prepare($sql);
			$sth2->execute(array(':protocol_id' => $protocol_id, ':name_id' => $setid, ':player_number' => '2'));

			$data = $conn->query("SELECT id FROM players ORDER BY id DESC LIMIT 1")->fetchAll();
			foreach ($data as $row) {
				$_SESSION["player_id"] = $row["id"];
			}
			$insertplayer_number = 2;
		} else {
			$sql = "SELECT player_number FROM players WHERE id = :player_id AND name_id = :name_id";
			//echo $sql . "<BR>";
			$st = $conn->prepare($sql);
			$st->bindValue(':player_id', $_SESSION["player_id"]);
			$st->bindValue(':name_id', $setid);
			$st->execute();
			
			//echo ($st->rowCount());

			if ($st->rowCount() > 0){
				$ck = $st->fetch(PDO::FETCH_ASSOC);
				$insertplayer_number = $ck["player_number"];
			} else {
				$sql = "INSERT INTO players (name_id, protocol_id, player_number) VALUES (:name_id, :protocol_id, :player_number)";
				//echo $sql . "<BR>";
				$sth2 = $conn->prepare($sql);
				$sth2->execute(array(':protocol_id' => $protocol_id, ':name_id' => $setid, ':player_number' => '2'));

				$data = $conn->query("SELECT id FROM players ORDER BY id DESC LIMIT 1")->fetchAll();
				foreach ($data as $row) {
					$_SESSION["player_id"] = $row["id"];
				}
				$insertplayer_number = 2;
			}
		}
	} elseif ($player_count >= 2) {
		//echo 'here<BR>';
		$sql = "INSERT INTO players_history (name_id, protocol_id, player_number, added_on) SELECT name_id, protocol_id, player_number, added_on FROM players ";
		$sth2 = $conn->prepare($sql);
		$sth2->execute();
		
		$sql = "DELETE FROM players";
		$sth2 = $conn->prepare($sql);
		$sth2->execute();

		if ($_SESSION["player_id"] == "") {
			$sql = "INSERT INTO players (name_id, protocol_id, player_number) VALUES (:name_id, :protocol_id, :player_number)";
			$sth2 = $conn->prepare($sql);
			$sth2->execute(array(':protocol_id' => $protocol_id, ':name_id' => $setid, ':player_number' => '1'));

			$data = $conn->query("SELECT id FROM players ORDER BY id DESC LIMIT 1")->fetchAll();
			foreach ($data as $row) {
				$_SESSION["player_id"] = $row["id"];
			}
			$insertplayer_number = 1;
		} else {
			$sql = "SELECT player_number FROM players WHERE id = :player_id ";
			$st = $conn->prepare($sql);
			$st->bindValue(':player_id', $_SESSION["player_id"]);
			$st->execute();

			if ($st->rowCount() > 0){
				$ck = $st->fetch(PDO::FETCH_ASSOC);
				$insertplayer_number = $ck["player_number"];
			}
		}
	}
} else {
	//then record player 1 info
	if ($_SESSION["player_id"] == "") {
		$sql = "INSERT INTO players (name_id, protocol_id, player_number) VALUES (:name_id, :protocol_id, :player_number)";
		$sth2 = $conn->prepare($sql);
		$sth2->execute(array(':protocol_id' => $protocol_id, ':name_id' => $setid, ':player_number' => '1'));

		$data = $conn->query("SELECT id FROM players ORDER BY id DESC LIMIT 1")->fetchAll();
		foreach ($data as $row) {
			$_SESSION["player_id"] = $row["id"];
		}

		$insertplayer_number = 1;
	} else {
		$sql = "SELECT player_number FROM players WHERE id = :player_id ";
		$st = $conn->prepare($sql);
		$st->bindValue(':player_id', $_SESSION["player_id"]);
		$st->execute();

		if ($st->rowCount() > 0){
			$ck = $st->fetch(PDO::FETCH_ASSOC);
			$insertplayer_number = $ck["player_number"];
		}
	}
} 

$_SESSION["player_number"] = $insertplayer_number;
//echo '$insertplayer_number: ' . $insertplayer_number;

if (!isset($insertplayer_number)) {
	redirect("page3.php");
}

?>
<?php include '../header.php';?>

<?php
$strip_page_name = str_replace('/sam','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:10%;">
		<?php
			echo "You are playing as player " . $insertplayer_number . ".<br>To answer each question, turn the wheel and click the 'Submit' button.";
		?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">

</div>

<?php 

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?>   
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="page5.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>