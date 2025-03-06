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

if (!isset($_SESSION["player_id"]) || ($_SESSION["player_id"] === "")) {
	redirect("page3.php");
} else {
	$sql = "SELECT player_number FROM players WHERE id = :player_id ";
	$st = $conn->prepare($sql);
	$st->bindValue(':player_id', $_SESSION["player_id"]);
	$st->execute();

	if ($st->rowCount() == 0){
		redirect("page3.php");
	}
}

?>
<?php include '../header.php';?>

<?php
$strip_page_name = str_replace('/gtk','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="speech-bubble" style="padding:15% 10%;">
		Only the two of you will know the answers because you’re using <a href="#" class="tooltip-local" onclick="toggleLayer('ttentanglement')">entanglement</a>.
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="u-clearfix" style="min-height:270px; margin-top:250px; font-size:1.5em;">
		<div id="ttentanglement" class="tooltiptext u-white fleft pqntooltip" style="display:none;">
			Entanglement means quantum particles are tied together, even if they are very far apart. <br />
		</div>
	</div>
</div>


<?php 

echo bottompagecontainer();					
echo leftnav("page" . $prev_strip_page_name . ".php");
echo rightnav("page" . $next_strip_page_name . ".php");

?>   
<script>
	  document.addEventListener('DOMContentLoaded', function() {
	  const link = document.querySelector('a[href="page6.php"]'); 

	  document.addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
		  link.click();
		}
	  });
	});
</script>
<?php include '../footer.php';?>