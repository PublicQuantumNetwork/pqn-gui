<?php include 'functions.php';?>
<?php include 'header.php';?>

<?= toppagecontainer("1")?>

<div class="u-clearfix speech-bubble-wrapper">
	<div class="fleft speech-bubble" style="padding:10%;" id="divAddName">
		Click in the box to the right to bring up the keyboard, enter your name, and click the 'Submit' button.
	</div>
</div>

<div class="u-clearfix whobit-straight-wrapper">								
	<div class="fleft">
		<img src="images/index-whobit.png" class="whobit-pointing-right">
	</div>
</div>

<div class="u-clearfix right-side-wrapper">
	<div class="fleft" style="width:600px;">
		<form name="frmSubmitName" id="frmSubmitName" action="#" method="post" onSubmit="checkName(document.getElementById('txtName').value);return false">
			<div clas="u-clearfix">
				<div class="fleft" style="font-size:1.3em;">
					<label for="txtName">Enter your name</label><br>
					<input type="text" name="txtName" id="txtName" maxlength="18" class="text-area use-keyboard-input" style="width:185px; border:2px solid #000000;">&nbsp;&nbsp;<input type="submit" name="btnSubmit" id="btnSubmit" value="Submit" style="border:2px solid #000000; padding:0px 10px;">
				</div>
			</div>
		</form>
	</div>
</div>

<?php 

echo bottompagecontainer();					
echo leftnav("index.php");
//echo rightnav("page" . $next_strip_page_name . ".php");

?>  
<script src="keyboard-script.js"></script>
<?php include 'footer.php';?>