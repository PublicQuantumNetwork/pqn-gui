<?php include '../functions.php';?>
<?php
session_start(); //Start the session

if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("/index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}

$v = '0';
if (isset($_GET['v'])) {
	$v = $_GET['v'];
}

$e = '0';
if (isset($_GET['e'])) {
	$e = $_GET['e'];
}
?>
<?php include '../header.php';?>
<?php include '../conn.php';?>

<?php
$strip_page_name = str_replace('/chsh','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);

if ($v >= 2) {
	$strPadding = "15%;";
} else {
	$strPadding = "12%;";
}
?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:<?=$strPadding?>;">
		<?php
			if ($v >= 2) {
				echo "This result means the test was able to show the photons are entangled.";
			} else {
				echo "This result means the test was unable to show the photons are entangled.";
			}
		?>
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">							
	<div class="fleft">
	<?php
		if ($v >= 2) {
			echo '<img src="/images/whobit-excited.png" class="whobit-excited">';
		} else {
			echo '<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">';
		}
	?>
	</div>
</div>

<div class="u-clearfix right-side-wrapper" style="margin-left:630px;">
		<?php
		if ($v >= 2) {
			echo '<div class="u-clearfix" style="margin-top:400px; font-size:1.5em;height: 490px;overflow:scroll; width:950px;">';
			echo '<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:620px; padding:40px;">';
			echo 'Your value was <br><span style="font-size:2em;">' . $v . '</span><br> with an error of <br><span style="font-size:2em;">' . $e . '</span>';
			echo '</div>';
			echo '</div>';
		} else {
			echo '<div class="u-clearfix" style="margin-top:300px; font-size:1.5em;height: 490px;overflow:scroll; width:950px;">';
			echo '<div id="ttentangled" class="tooltiptext u-white fleft pqntooltip" style="width:620px; padding:40px;">';
			echo 'Your value was <br><span style="font-size:2em;">' . $v . '</span><br> with an error of <br><span style="font-size:2em;">' . $e . '</span><br><br>';
			echo 'Some angles are better than others for this test.<br>Try different angles to see this for yourself!';
			echo '</div>';
			echo '</div>';
		}
		?>
</div>

<?php 

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
//echo rightnav("/survey/page1.php");

?> 
<script class="u-script" type="text/javascript" src="/done.js" defer=""></script>
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