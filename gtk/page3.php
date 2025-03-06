<?php include '../functions.php';?>
<?php
session_start(); //Start the session

if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("/index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}

$_SESSION["player_id"] = "";
$_SESSION["total_questions_asked"] = 0;
?>
<?php include '../header.php';?>
<?php include '../conn.php';?>

<?php
$strip_page_name = str_replace('/gtk','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:10%;">
		<?php 
		$defaultmsg = "This game requires 2 players.<br><br>Click next > to proceed.";

		if(isset($_GET['m'])) {
			$msg = $_GET['m'];

			if ($msg === "1") {
				echo "<span style='color:#FF0000;'>Player 1 has already been claimed please choose player 2.</span>";
			} else {

				echo $defaultmsg;

			}
		} else {
			echo $defaultmsg;
		}
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
echo leftnav("../page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?> 
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="page4.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>