</section>
<footer class="u-align-center u-clearfix u-container-align-center u-footer u-grey-30 u-footer" id="sec-08c0">
	  <!--<div class="u-clearfix u-sheet u-sheet-1">
        <p class="u-small-text u-text u-text-variant u-text-1">Sample text. Click to select the Text Element.</p>
      </div>-->
	</footer>
    <section class="u-backlink u-clearfix u-white-80">
      <!--<p class="u-text">
        <span>This site was created with the </span>
        <a class="u-link" href="https://nicepage.com/" target="_blank" rel="nofollow">
          <span>Nicepage</span>
        </a>
      </p>-->
	  <div class="clearfix u-sheet u-valign-middle u-sheet-1" style="width:100%;">
	    <div class="fleft" style="width:100px;">
			<a href="#">
			  <img src="/images/block I.png" style="height:60px;">
			</a>
		</div>
		
		<div class="fright" style="width:100px; margin-right:240px; margin-top:10px;">
			<?php
			if (isset($_SESSION["recalibrate_needed"])) {
				if ($_SESSION["recalibrate_needed"]  == 1) {
					echo "<a class='u-button-style u-nav-link u-text-active-palette-1-base u-text-hover-palette-2-base u-white' href='#' style='padding: 10px 20px; border:2px solid #000; width:325px;' onclick='recalibrate();'>Arrow acting strange? Calibrate it!</a>";
				}
			}
			?>
		</div>
	  </div>
    </section>
<script language="text/javascript">
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})
</script>
</body></html>