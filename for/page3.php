<?php include '../functions.php';?>
<?php
session_start(); //Start the session

if (!isset($_SESSION["name"]) || ($_SESSION["name"] === "") || !isset($_SESSION["id"]) || ($_SESSION["id"] === "")) {
	redirect("/index.php?m=1");
} else {
	$setname = $_SESSION["name"];
	$setid = $_SESSION["id"];
}

if (!isset($_SESSION["fortune_count"])) {
	$_SESSION["fortune_count"] = 0;
}

if ($_SESSION["fortune_count"] >= 7) {
	$_SESSION["fortune_count"] = 0;
}

?>
<?php include '../header.php';?>
<?php include '../conn.php';?>

<?php

$sql = "SELECT id, fortune FROM fortunes WHERE id NOT IN (SELECT fortune_id FROM fortunes_saved WHERE name_id = :name_id) LIMIT 1";
//echo $sql . $protocol_id;
$st = $conn->prepare($sql);
$st->bindValue(':name_id', $setid);
$st->execute();

$fortune = "";
$fortune_id = "";

$currentTime = time();
$fortuneString = $currentTime % 2;

if ($st->rowCount() > 0){
	$ck = $st->fetch(PDO::FETCH_ASSOC);
	$fortune_id = $ck["id"];
	$fortune = $ck["fortune"];
	
	$_SESSION["fortune_count"] = $_SESSION["fortune_count"] + 1;
	$_SESSION["fortune_string"] = $_SESSION["fortune_string"] . $fortuneString;
}

if ($fortune_id != '') {
	$sql = "INSERT INTO fortunes_saved (fortune_id, name_id) VALUES (:fortune_id, :name_id)";
	$sth = $conn->prepare($sql);
	$sth->execute(array(':fortune_id' => $fortune_id, ':name_id' => $setid));
}

$strip_page_name = str_replace('/for','',str_replace('.php','',str_replace('/page','',$_SERVER['SCRIPT_NAME'])));
$prev_strip_page_name = $strip_page_name - 1;
$next_strip_page_name = $strip_page_name + 1;

echo toppagecontainer($strip_page_name);
?>

<div class="u-clearfix speech-bubble-wrapper" style="margin-top:-200px;">
	<div class="fleft speech-bubble" style="padding:15%;">
		Press the red button seven times to generate your fortune.
	</div>
</div>


<div class="u-clearfix whobit-straight-wrapper" style="margin-top:210px;">							
	<div class="fleft">
		<img src="/images/what-do-you-want-to-do-whobit.png" class="whobit-straight">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft" style="height:550px;">
		<div id="dial_container" style="height:550px; width:550px;">
			<div style="position:absolute; z-index:0;width:100%; height:225px;margin-top:110px;margin-left:85px;">
				<div class="fleft" style="border:0px solid #000; width:99%; height:100%; font-size:6em; text-align:center; margin-top:70px;">
				<?php
				echo "<strong>#" . $_SESSION["fortune_count"] . "</strong>";
				?>
				</div>
			</div>
		</div>
	</div>
</div>

<?php
echo showModal("<div class='clearfix'><div class='fleft' style='width:27%;'><img src='/images/gif_pqn.gif' width='250'></div><div class='fleft' style='width:65%;'><span style='text-align:center;'><strong>What is really happening here?</strong></span><br><span style='text-align:left;'>When you press the button, you ask the entangled photons whether they’re a particular polarization or not. Because they’re entangled, their answers are related, even though their answers are unknowable ahead of time (they are in superposition). Every time they answer, a bit is created. All the bits together are used to create a random number corresponding to a message. 
		<br><img src='/images/pqnbehindthescenesQRcode-fortune.png' style='width:150px; margin:20px 0px;'><br>Scan the code for a full explanation.<br>This may take a few minutes.</span></div></div>");
?>

<div class="u-clearfix" style="margin-top:400px; margin-left:630px;">
	<div style="position:absolute; margin-left:570px; margin-top:25px;">
		<?php
			if ($_SESSION["fortune_count"] < 7) {
		?>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;" onClick="window.location.href='page3.php'" id="Asubmit">SUBMIT</a>
		<?php
			} else {
		?>
		<a class="u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white" href="#" style="padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;" data-toggle="modal" data-target="#myModal" onClick="sendFortuneCookie('<?=$_SESSION["fortune_string"]?>')" id="Asubmit">SUBMIT</a>
		<?php
			}
		?>
	</div>
</div>
<?php 

echo bottompagecontainer();					
//echo leftnav("page" . $prev_strip_page_name . ".php");
//echo rightnav("page" . $next_strip_page_name . ".php");

?> 

<script>
	window.addEventListener('DOMContentLoaded', () => {
	  const targetElement = document.getElementById('Asubmit'); 

	  if (targetElement) {	
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
	   }
	});
</script>
<?php include '../footer.php';?>