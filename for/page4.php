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

$msg = "";
if(isset($_GET['m'])) {
	$msg = $_GET['m'];
}

if(isset($_GET["d"])) {
	$d = $_GET["d"];
} else {
	$d = 32;
}

if (($d < 0) || ($d > 64) || ($d == '')) {
	$d = 32;
}

$sql = "SELECT fortune FROM fortunes WHERE id = :fortune_id";
$st = $conn->prepare($sql);
$st->bindValue(':fortune_id', $d);
$st->execute();
if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$fortune = $ck["fortune"];
}

?>
<?php include '../header.php';?>

<?php
$strip_page_name = str_replace('/for','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:15%;">
		<?php
			echo "And your fortune is...";
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
			echo "<br><span style='font-size:4em;'>#" . $d . "</span><br><br>" . $fortune . "<br>";
		?>
		
		</div>
	</div>
</div>

<?php 

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
//echo rightnav("/survey/page1.php");

?> 
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="/index.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>