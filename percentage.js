let position = 0;
let startTime = Date.now();
const duration = 10; // 1000 = 1 second

function pickRandomNumber() {
  let currentNumber = 0;
  let intervalId;

  async function pickNumber() {

	   try {
			const response = await fetch('http://127.0.0.1:8000/parity/agreement', {
			  method: 'GET',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  //body: JSON.stringify({ 'option': sendToSoroush, 'player':  player_num})
			});

			if (response.status === 200) {
			  // Handle non-2xx HTTP status codes
			  //const errorData = await response.text();
			  //throw new Error(`HTTP error ${response.status}: ${errorData}`);
			  const responseData = await response.json();
			  document.getElementById('divPerc').innerHTML = responseData.parity_agreement;
			} else {
			
				const queryString = window.location.search;
				const urlParams = new URLSearchParams(queryString);
				const perc = urlParams.get('p')
			
				document.getElementById('divPerc').innerHTML = perc;
			}
		  } catch (error) {
			console.error('Error trying to fetch data:', error);
		  }
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