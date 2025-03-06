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

$protocol_name = 'sam';

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

if (!isset($_SESSION["player_id"])) {
	redirect("page3.php");
}

$sql = "SELECT emoji FROM emojis_saved";
$st = $conn->prepare($sql);
$st->execute();
if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$emoji = $ck["emoji"];
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
	<div class="speech-bubble" style="padding:15%;">
		<?php
			echo "Wow! <br>You really are in sync!";
		?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-left:630px;">
	<div class="u-clearfix" style="margin-top:270px; font-size:1.3em;height: 390px;overflow:scroll; width:650px;">
		<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:620px; text-align:center;">

		<?php
			//echo $emoji;
			//if (($_SESSION["counting_returned_bits"] != '') && ($_SESSION["emoji"] != '')) {
				echo '<img src="/images/emoji-' . $emoji . '-' . $_SESSION["counting_returned_bits"] . '.png">';
			//} else {
				//echo '<img src="/images/emoji-happy-6.png">';
			//}
		?>
		
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