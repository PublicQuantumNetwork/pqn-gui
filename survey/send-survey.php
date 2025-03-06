<?php include '../conn.php';?>
<?php include '../functions.php';?>
<?php

session_start(); //Start the session

$txtEmail = $_POST["txtEmail"];

if ($txtEmail == '') {
	$txtEmail = "no-reply@illinois.edu";
}


	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
	require '/home/pqnetwork/vendor/phpmailer/phpmailer/src/Exception.php';
	require '/home/pqnetwork/vendor/phpmailer/phpmailer/src/PHPMailer.php';
	require '/home/pqnetwork/vendor/phpmailer/phpmailer/src/SMTP.php';

	$mail = new PHPMailer(true);

	$consentBodyStripped = str_replace("<div class='u-clearfix' style='width:900px;'><div class='fleft' style='width:900px;'><div id='emailError'></div><label for='txtSelectedOptions'>Email</label><br><input type='text' name='txtSelectedOptions' id='txtSelectedOptions' class='text-area use-keyboard-input'></div></div>", "", $consentUBody); 

	$message = 'Greetings! Below, you will find the consent form you signed from the Public Quantum Network in the Urbana Free Library:<br><br>' . $consentUTitle .$consentBodyStripped;

	$mail->isSMTP();
	$mail->Host = 'smtp-cx.socketlabs.com';
	$mail->SMTPAuth = true;
	$mail->Username = 'server50352';
	$mail->Password = 'Dd9w6S2Ppq8E5';
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
	$mail->Port = 587;

	$mail->setFrom('publicquantumnetworkinfo@gmail.com', 'Public Quantum Network team');
	$mail->addAddress($txtEmail, $txtEmail);
	$mail->Subject = 'PQN Survey';
	// Set HTML 
	$mail->isHTML(TRUE);
	$mail->Body = '<html>' . $message . '</html>';
	$mail->AltBody = $message;
	// add attachment 
	// just add the '/path/to/file.pdf'
	/*$attachmentPath = './confirmations/yourbooking.pdf';
	if (file_exists($attachmentPath)) {
		$mail->addAttachment($attachmentPath, 'yourbooking.pdf');
	}
	*/
	// send the message
	if(!$mail->send()){
		echo 'Message could not be sent.';
		echo 'Mailer Error: ' . $mail->ErrorInfo;
	} else {
		//echo 'Message has been sent';
	}

	$sql = "INSERT INTO survey_consent (email) VALUES (:email)";
		$sth = $conn->prepare($sql);
		$sth->execute([
			':email' => $txtEmail,
		]);

	die();	

?> 
