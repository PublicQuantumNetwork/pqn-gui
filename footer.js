let position = 0;
let startTime = Date.now();
const duration = 10; // 1000 = 1 second

function pickRandomNumber() {
  let currentNumber = 0;
  let intervalId;

  async function pickNumber() {

//	  	let dateString = new Date();
//	  	let strippedDate = dateString.replace(/[\/ ]/g, "");
//	  	
		const date = new Date();
		//console.log("Hello");
	  	//fetch(`http://127.0.0.1:8000/polarimeter?t=${Date.now()}`)
		fetch('http://127.0.0.1:8000/polarimeter/theta')
	  .then(response => response.text())
	  .then(data => {
	  	document.getElementById('circle-range').style.display = 'none';
		document.getElementById('values').style.display = 'none';
		var readValue = parseFloat(data);
		readValue = readValue;
		//console.log(readValue)
		//console.log(date);
		orginalValue = readValue
		readValue = (90-readValue);
			  $("#dial_container img").css("rotate", readValue + "deg");
			  document.getElementById('txtDegree').value = orginalValue;
			  
	  })
	  .catch(error => {
		console.error('Error fetching data:', error);
		if (document.getElementById('circle-range') !== null) {
			document.getElementById('circle-range').style.display = 'block';
		}
		
		if (document.getElementById('values') !== null) {
			document.getElementById('values').style.display = 'block';
		}
		clearInterval(intervalId);
	  });
  }

  function startPicking() {
    intervalId = setInterval(pickNumber, 1000/60); // Pick a new number every 2000 = 2 seconds ------- 1000 / 60); // Render at 60 frames per second
  }
  
  function stopPicking() {
    clearInterval(intervalId);
  }

  return {
    start: startPicking,
    stop: stopPicking
  };
}

const picker = pickRandomNumber();
picker.start(); 

//take this out before we go live
//setTimeout(() => {
//  picker.stop(); 
//}, duration * 10);