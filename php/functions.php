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
	
	for($i = 1; $i<=10; $i++) {
		//echo $pageactive . " " . $i . " " . ($pageactive == $i) . "<br>";
		if ($pageactive == $i) {
			 $page_active_array['page' . $i] = 'u-active'; // Fill array dynamically 
		} else {
			$page_active_array['page' . $i] = ''; // Fill array dynamically 
		}
	}

echo "<section id='carousel_745d' class='u-carousel u-slide u-block-6e2a-1' data-u-ride='carousel' data-interval='0'>";
  	echo "<ol class='u-absolute-hcenter u-carousel-indicators u-block-6e2a-2'>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page1"] . "' data-u-slide-to='0'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page2"] . "' data-u-slide-to='1'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page3"] . "' data-u-slide-to='2'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page4"] . "' data-u-slide-to='3'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page5"] . "' data-u-slide-to='4'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page6"] . "' data-u-slide-to='5'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page7"] . "' data-u-slide-to='6'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page8"] . "' data-u-slide-to='7'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page9"] . "' data-u-slide-to='8'></li>";
		echo "<li data-u-target='#carousel_745d' class='u-grey-30 " . $page_active_array["page10"] . "' data-u-slide-to='9'></li>";
  	echo "</ol>";
  echo "<div class='u-carousel-inner' role='listbox'>";
	echo "<div class='u-active u-carousel-item u-clearfix u-section-1-1'>";
	  echo "<div class='u-clearfix u-sheet u-sheet-1'>";
		echo "<div class='data-layout-selected u-clearfix u-expanded-width u-gutter-10 u-layout-wrap u-layout-wrap-1'>";
		  echo "<div class='u-layout' style=''>";
			echo "<div class='u-layout-row' style=''>";
			  echo "<div class='u-align-left u-container-align-left u-container-style u-layout-cell u-right-cell u-size-60 u-size-xs-60 u-white u-layout-cell-2'>";
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
?>