<?php
function leftnav($page) {
echo "<a class='u-absolute-vcenter u-carousel-control u-carousel-control-prev u-text-body-color u-block-6e2a-3 pulsate' href='" . $page . "' role='button' data-u-slide='prev'>";
	echo "<span aria-hidden='true'>";
		echo "<svg viewBox='0 0 256 256'><g>";
			echo "<polygon points='207.093,30.187 176.907,0 48.907,128 176.907,256 207.093,225.813 109.28,128'></polygon>";
		echo "</g></svg>";
	echo "</span>";
echo "<span class='sr-only'>";
	echo "<svg viewBox='0 0 256 256'><g>";
		echo "<polygon points='207.093,30.187 176.907,0 48.907,128 176.907,256 207.093,225.813 109.28,128'></polygon>";
	echo "</g></svg>";
echo "</span>";
echo "</a>";
}

function rightnav($page) {
echo "<a class='u-absolute-vcenter u-carousel-control u-carousel-control-next u-text-body-color u-block-6e2a-4 pulsate' href='" . $page . "' role='button' data-u-slide='next'>";
	echo "<span aria-hidden='true'>";
		echo "<svg viewBox='0 0 306 306'><g id='chevron-right'>";
			echo "<polygon points='94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153'></polygon>";
		echo "</g></svg>";
	echo "</span>";
	echo "<span class='sr-only'>";
	echo "<svg viewBox='0 0 306 306'><g id='chevron-right'>";
		echo "<polygon points='94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153'></polygon>"; 
	echo "</g></svg>";
	echo "</span>";
echo "</a>";
}

function toppagecontainer($pageactive){
	$page_active_array = array();
	
	for($i = 1; $i<=15; $i++) {
		//echo $pageactive . " " . $i . " " . ($pageactive == $i) . "<br>";
		if ($pageactive == $i) {
			 $page_active_array['page' . $i] = 'u-active'; // Fill array dynamically 
		} else {
			$page_active_array['page' . $i] = ''; // Fill array dynamically 
		}
	}
	
	$showdash = 2;
	if (strpos($_SERVER['SCRIPT_NAME'],"chsh") > 0) {
		$showdash = 6;
	}elseif (strpos($_SERVER['SCRIPT_NAME'],"gtk") > 0) {
		$showdash = 7;
	}elseif (strpos($_SERVER['SCRIPT_NAME'],"sam") > 0) {
		$showdash = 7;
	}elseif (strpos($_SERVER['SCRIPT_NAME'],"survey") > 0) {
		$showdash = 15;
	}elseif (strpos($_SERVER['SCRIPT_NAME'],"for") > 0) {
		$showdash = 4;
	}

echo "<section id='carousel_745d' class='u-carousel u-slide u-block-6e2a-1' data-u-ride='carousel' data-interval='0'>";
  	echo "<ol class='u-absolute-hcenter u-carousel-indicators u-block-6e2a-2'>";
		for ($i = 0; $i < $showdash; $i++) {
			$c = $i + 1;
			$pagenum = "page" . $c;
    		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array[$pagenum] . "' data-u-slide-to='. $i .'></li>";
		}
  	echo "</ol>";
  echo "<div class='u-carousel-inner' role='listbox'>";
	echo "<div class='u-active u-carousel-item u-clearfix u-section-1-1'>";
	  echo "<div class='u-clearfix u-sheet u-sheet-1'>";
		echo "<div class='data-layout-selected u-clearfix u-expanded-width u-gutter-10 u-layout-wrap u-layout-wrap-1'>";
		  echo "<div class='u-layout' style=''>";
			echo "<div class='u-layout-row' style=''>";
			  echo "<div class='u-align-left u-container-align-left u-container-style u-layout-cell u-right-cell u-size-20 u-size-xs-20 u-layout-cell-2'>";
				echo "<div class='u-container-layout u-valign-middle u-container-layout-2'>";
}

function bottompagecontainer(){
							echo "</div>";
						echo "</div>";
					echo "</div>";
				echo "</div>";
			echo "</div>";
		echo "</div>";
	echo "</div>";
echo "</div>";
}

function redirect($url) {
	header('Location: '.$url);
	die();
}

function percent($number){
    return round(($number * 100),0) . '%';
}

function percent_number($number){
    return round(($number * 100),0);
}

function show_survey_questions_answers($question_order, $total_num_options, $question_id, $question, $option1, $option2, $option3, $option4, $option5, $option6, $option7, $option8) {
	
	if (($question_order == 3) || ($question_order == 4) || ($question_order == 11)) {
		$style = "style='padding:15%;'";
	} else if ($question_order == 5) {
		$style = "style='padding:5%;'";
	} else if (($question_order == 2) || ($question_order == 6) || ($question_order == 7) || ($question_order == 8) || ($question_order == 9) || ($question_order == 10)) {
		$style = "style='padding:20%;'";
	} else if (($question_order == 12) || ($question_order == 13)) {
		$style = "style='padding:12.67%;'";
	} else {
		$style = "style='padding:10%;'";
	}

	
	echo "<div class='u-clearfix speech-bubble-wrapper' style='margin-top:-200px;'>";
		echo "<div class='speech-bubble' $style >";

			echo $question;

		echo "</div>";
	echo "</div>";

	echo "<div class='u-clearfix whobit-straight-wrapper' style='margin-top:200px;'>";							
		echo "<div class='fleft'>";
			echo "<img src='/images/what-do-you-want-to-do-whobit.png' class='whobit-straight'>";
		echo "</div>";
	echo "</div>";
	
	$extraCSS = "";
	
	if ($total_num_options == 3) {
		$extraCSS = 'background: url("/images/circle-3-parts.png");';
	} else if ($total_num_options == 4) {
		$extraCSS = 'background-image: url("/images/circle-4-parts.png");';
	} else if ($total_num_options == 5) {
		$extraCSS = 'background-image: url("/images/circle-5-parts.png");';
	} else if ($total_num_options == 6) {
		$extraCSS = 'background-image: url("/images/circle-6-parts.png");';
	}

	echo "<div class='u-clearfix right-side-wrapper'>";
		echo "<div class='fleft' style='height:550px;'>";
			echo "<div id='dial_container' style='height:550px; width:550px; " . $extraCSS . "'>";
				echo "<div style='position:absolute; z-index:0;width:100%; height:225px;margin-top:110px;margin-left:85px;'>";
					
					if ($total_num_options == 3) {
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:150px 0px 0px 110px;'>";
							echo $option1;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-130px 0px 0px -50px;'>";
							echo $option2;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:20px 0px 0px -88px;'>";
							echo $option3;
						echo "</div>";

					} else if ($total_num_options == 4) {
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:140px 0px 0px 130px;'>";
							echo $option1;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:70px 0px 0px 10px;'>";
							echo $option2;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-245px 0px 0px -110px;'>";
							echo $option3;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-370px 0px 0px -6px;'>";
							echo $option4;
						echo "</div>";

					} else if ($total_num_options == 5) {
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:140px 0px 0px 120px;'>";
							echo $option1;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-180px 0px 0px 40px;'>";
							echo $option2;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-123px 0px 0px -95px;'>";
							echo $option3;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-29px 0px 0px -120px;'>";
							echo $option4;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-24px 0px 0px 33px;'>";
							echo $option5;
						echo "</div>";

					} else if ($total_num_options == 6) {
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:135px 0px 0px 120px;'>";
							echo $option1;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-145px 0px 0px 80px;'>";
							echo $option2;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-145px 0px 0px -60px;'>";
							echo $option3;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-43px 0px 0px -130px;'>";
							echo $option4;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:60px 0px 0px -73px;'>";
							echo $option5;
						echo "</div>";
						echo "<div class='fleft' style='border:0px solid #000; width:100%; font-size:1.3em; text-align:center; margin:-45px 0px 0px 70px;'>";
							echo $option6;
						echo "</div>";
					}
				echo "</div>";

				echo "<div style='position:absolute; z-index:30; margin: 60px 0px 0px 265px;'>";
					echo "<img src='/images/arrow.png' class='circle-arrow'>";
				echo "</div>";
			echo "</div>";
		echo "</div>";
	echo "</div>";

	echo "<div class='u-clearfix' style='margin-top:400px; margin-left:630px;'>";
		echo "<div style='position:absolute; margin-top:25px; margin-left:-70px; width:300px;'>";
			echo "<div class='slidecontainer' style='width:100%;'>";
			  echo "<input type='range' min='0' max='360' value='0' style='width:100%; display:none;' id='circle-range' onChange='setCircle(this.value)' list='values'>";
				echo "<datalist id='values' style='display:none;'>";
				  if ($total_num_options == 3) {
					  echo "<option value='0' label='0&deg;' style='padding: 10px 20px 0px 0px'></option>";
					  echo "<option value='60' label='60&deg;' style='padding: 10px 68px 0px 0px'></option>";
					  echo "<option value='180' label='180&deg;' style='padding: 10px 65px 0px 0px'></option>";
					  echo "<option value='300' label='300&deg;'></option>";
				  } else if ($total_num_options == 4) {
					  echo "<option value='0' label='0&deg;' style='padding: 10px 10px 0px 0px'></option>";
					  echo "<option value='45' label='45&deg;' style='padding: 10px 42px 0px 0px'></option>";
					  echo "<option value='135' label='135&deg;' style='padding: 10px 45px 0px 0px'></option>";
					  echo "<option value='225' label='225&deg;' style='padding: 10px 43px 0px 0px'></option>";
					  echo "<option value='315' label='315&deg;'></option>";
				  } else if ($total_num_options == 5) {
					  echo "<option value='0' label='0&deg;' style='padding: 10px 0px 0px 0px'></option>";
					  echo "<option value='36' label='36&deg;' style='padding: 10px 28px 0px 0px'></option>";
					  echo "<option value='108' label='108&deg;' style='padding: 10px 32px 0px 0px'></option>";
					  echo "<option value='180' label='180&deg;' style='padding: 10px 32px 0px 0px'></option>";
					  echo "<option value='252' label='252&deg;' style='padding: 10px 32px 0px 0px'></option>";
					  echo "<option value='324' label='324&deg;'></option>";
				  } else if ($total_num_options == 6) {
					  echo "<option value='0' label='0&deg;' style='padding: 10px 0px 0px 0px'></option>";
					  echo "<option value='30' label='30&deg;' style='padding: 10px 18px 0px 0px'></option>";
					  echo "<option value='90' label='90&deg;' style='padding: 10px 20px 0px 0px'></option>";
					  echo "<option value='150' label='150&deg;' style='padding: 10px 22px 0px 0px'></option>";
					  echo "<option value='210' label='210&deg;' style='padding: 10px 20px 0px 0px'></option>";
					  echo "<option value='270' label='270&deg;' style='padding: 10px 20px 0px 0px'></option>";
					  echo "<option value='330' label='330&deg;'></option>";
				  }
				echo "</datalist>";
			echo "</div>";
		echo "</div>";
		
		if ($question_order == 1) {
			$onClick = "onClick='takeSurveyQuestion()'";
		} else {
			$onClick = "onClick='logSurveyAnswer()'";
		}
		
		if ($question_order <= 15) {
			$next_page = 'page' . ($question_order + 1) . '.php';
			$page_redirect = $next_page;
		}else {
			$page_redirect = "/index.php";
		}


		echo "<div style='position:absolute; margin-left:570px; margin-top:25px;'>";
		echo "<input type='hidden' name='txtQuestionID' id='txtQuestionID' value='$question_id'>";
		echo "<input type='hidden' name='txtDegree' id='txtDegree' value='90'>";
		echo "<input type='hidden' name='txtNextPage' id='txtNextPage' value='$page_redirect'>";
		echo "<input type='hidden' name='txtQuestionOrder' id='txtQuestionOrder' value='$question_order'>";
		echo "<input type='hidden' name='txtSelectedOptions' id='txtSelectedOptions'>";
			echo "<a id='Asubmit' class='u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white' href='#' style='padding: 10px 20px; border:2px solid #000; width:125px; text-align:center; font-size:1.3em; font-weight:bold;' $onClick >SUBMIT</a>";
		echo "</div>";
	echo "</div>";
}

function getSection($angle,$n) {
    $angle = ($angle % 360);
    $sectionSize = 360 / intval($n);
    $adjusted_angle = ($angle + $sectionSize / 2) % 360 ;
    return floor($adjusted_angle / $sectionSize) + 1;
	

}

function showModal($msg) {
echo "<div class='u-clearfix right-side-wrapper'>";
echo "<div style='height:550px;'>";
echo "<div class='modal fade' id='myModal' role='dialog'>";
	echo "<div class='modal-dialog'>";

		echo "<div class='modal-content'>";
			echo "<div class='modal-header'>";
			//echo "<button type='button' class='close' data-dismiss='modal'>&times;</button>";
			echo "<h4 style='color:red;text-align:center;'><i class='fa-regular fa-share-nodes'></i>&nbsp;&nbsp;&nbsp;Photons are being measured back at the lab</h4>";
			echo "</div>";

			echo "<div class='modal-body'>";
			echo $msg;
			echo "</div>";

			echo "<div class='modal-footer'>";
			echo "</div>";
		echo "</div>";
	echo "</div>";
echo "</div>";
echo "</div>";
echo "</div>";
}

$consentUTitle = "Assent to Participate in a Research Study";
$consentUBody = "<br><strong>Who are we and what are we doing?</strong><br>" .
	"We are from the University of Illinois Urbana-Champaign. We would like to ask if you would be in a research study. A research study is a way to find out new information about something. This is the way we try to find out how kids understand quantum mechanics.<br><br>" . 
	"<strong>Why are we asking you to be in this research study?</strong><br>" .
	"We are asking you to be in this research study because we want to learn more about how to teach quantum mechanics to children. We want you to be in this study because you are the target audience for our activities.<br><br> " . 
	"<strong>What happens in the research study?</strong><br>" .
	"If you decide to be in this research study and your parent or guardian agree to it, you will be given a survey to complete after the activity.<br><br>" . 
	"<strong>Will any part of the research study hurt you?</strong><br>".
	"We will ask you questions in the survey, none of which are designed to give you any distress or make you feel bad. If you feel bad at any point or if any of the questions make you uncomfortable, you will always be able to ask us about it.<br><br> " . 
	"<strong>Will the research study help you or anyone else?</strong><br>" .
	"We do not know for sure if being in this research study will help you. It is possible that we could learn something to help other people with understanding quantum technologies some day.<br><br>" . 
	"<strong>Who will see the information about you?</strong><br>" .
	"Only the researchers or others who are doing their jobs will be able to see the information about you from this research study. We will not tell anyone else that you are in the study.<br><br> " . 
	"<strong>What if you have any questions about the research study?</strong><br>" .
	"It is okay to ask questions. If you don't understand something, you can ask us. We want you to ask questions now and anytime you think of them. If you have a questions now, or later that you didn't think of now, you can email Virginia Lorenz at vlorenz@illinois.edu.<br><br>" . 
	"<strong>Do you have to be in the research study?</strong><br>" .
	"You do not have to be in this study if you don't want to. Being in this study is up to you. No one will be upset if you don't want to do it. Even if you say yes now, you can change your mind later and tell us you want to stop. Your parent or guardian can give their permission for you to be in this study. But even if your parent or guardian say 'yes' you can still decide not to be in the research study. <br><br>" . 
	"<strong>Agreeing to be in the study</strong><br>" .
	"I was able to ask questions about this study. Entering my email and clicking the submit button at the bottom means that I agree to be in this study. My parent or guardian and I will be provided a copy of this form through my email.<br><br> " .
	"<div class='u-clearfix' style='width:900px;'><div class='fleft' style='width:900px;'><div id='emailError'></div><br><label for='txtSelectedOptions'>Email</label><br><input type='text' name='txtSelectedOptions' id='txtSelectedOptions' class='text-area use-keyboard-input'></div></div>";

?>
