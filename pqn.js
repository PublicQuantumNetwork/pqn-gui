// JavaScript Document

function toggleLayer( whichLayer ){  
	var elem, vis;  if( document.getElementById ) // this is the way the standards work    
	elem = document.getElementById( whichLayer );  
	else if( document.all ) // this is the way old msie versions work      
	elem = document.all[whichLayer];  
	else if( document.layers ) // this is the way nn4 works    
	elem = document.layers[whichLayer];  
	vis = elem.style;  // if the style.display value is blank we try to figure it out here  
	if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)    
	vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';  
	vis.display = (vis.display==''||vis.display=='block')?'none':'block';
}


function checkName(v){
	fetch('https://pqnetwork.web.illinois.edu/pqn-api/check_name/' + v, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
		v
	  })
	})
	.then(response => response.json())
	.then(data => {
	  // Access the value from the response data
	  let readValue
	  readValue = data.parameterName;
	  
	  //console.log(readValue); 
	  
	  if (data === true) {
	  	//alert('true')
		location.href = 'add-name-to-session.php?v=' + v
		return false 
	  } else {
	  	//alert('false')
		document.getElementById('divAddName').innerHTML = 'This is not an acceptable name, please try again.';
		document.getElementById('txtName').value = '';
		document.getElementById('txtName').focus;
	  	return false
	  }
	  
	  return false
	})
	.catch(error => {
	  //alert('false')
	  document.getElementById('divAddName').innerHTML = 'Something went wrong, please try again.';
	  console.log('Error:', error);
	  return false
	  
	});
	
	return false
}

function setCircle(v) {
	originalV = v;
	v = (90-v);
	$("#dial_container img").css("rotate", v + "deg");
	document.getElementById('txtDegree').value = originalV;
}

function getRotationDegrees() {

	const dialImage = document.querySelector('#dial_container img');
	const computedStyle = window.getComputedStyle(dialImage);
	
	const rotationValue = dialImage.style.getPropertyValue('rotate');
	
	//alert(rotationValue);
	
	if (rotationValue > 360) {
		rotationValue = rotationValue % 360
	}


  if (rotationValue) {
	// Convert the rotation value to a degree on a 360 scale
    //const degree = (parseFloat(rotationValue[1]) * 180) / Math.PI;
	const degree = rotationValue.replace("deg","")
	if (degree === null) {
		const degree = 50;
	}
    return parseInt(degree); // Convert to a number

  } else {

    return 0; // No rotation applied

  }

}

//Get to know
async function sendValueToLabParity(protocol_id, return_page, name_id, player_id, player_num) {
  try {
  	const deg = document.getElementById('txtDegree').value;
  	const qi = document.getElementById('txtQuestionID').value;
  	const sendToSoroush = getSection(deg,2);
    const response = await fetch('http://127.0.0.1:8000/parity/basis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush})
    });

    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const errorData = await response.text();
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  const responseData = await response.json();
	  console.log(responseData);
	  window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=' + responseData.value;
    }
  } catch (error) {
    console.error('Error trying to fetch data:', error);
	//window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=1';
  }
}

async function sendValueToLabParityNoReturn(protocol_id, return_page, name_id, player_id, player_num) {
  try {
  	const deg = document.getElementById('txtDegree').value;
  	const qi = document.getElementById('txtQuestionID').value;
  	const sendToSoroush = getSection(deg,2);
    const response = await fetch('http://127.0.0.1:8000/parity/basis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush})
    });

    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const errorData = await response.text();
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  const responseData = await response.json();
	  console.log(responseData);
	  //window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id;
    }
  } catch (error) {
    console.error('Error trying to fetch data:', error);
	//window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=1';
  }
}

//Send a secret message
async function sendValueToLabQKD(protocol_id, return_page, name_id, player_id, ckfinished) {
  try {
  	const deg = document.getElementById('txtDegree').value;
    const qi = document.getElementById('txtQuestionID').value;
    const sendToSoroush = getSection(deg,2);
    const response = await fetch('http://127.0.0.1:8000/qkd/basis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush, 'finished': ckfinished })
    });

    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const errorData = await response.text();
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  const responseData = await response.json();
	  console.log(responseData);
	  window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=' + responseData.value;
    }

  } catch (error) {
    console.error('Error trying to fetch data:', error);
	//window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=1';
  }
}

function getSection(angle, n) {
  angle = (angle % 360);
  const sectionSize = (360 / n);
  const adjustedAngle = (angle + sectionSize / 2) % 360;
  return Math.floor(adjustedAngle / sectionSize) + 1;
}

async function sendCHSHValueToLab(protocol_id, return_page, name_id, player_id) {
  const deg = document.getElementById('txtDegree').value;
  const qi = document.getElementById('txtQuestionID').value;
  const sendToSoroush = deg;
  
  try {
    const response = await fetch('http://127.0.0.1:8000/chsh/set_angle1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush })
    });

	 console.log(response);
    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const responseData = await response.text();
	  
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=1';
    } else {
    	console.error('Error trying to fetch data:', error);
	}
  } catch(error) {
    console.error('Error trying to fetch data:',error);
  }
}

async function sendCHSHValueToLabAngle2(protocol_id, return_page, name_id, player_id) {
  	$('#myModal').modal('show');
	$('#Asubmit').prop('disabled', true);
  
  try {
    const deg = document.getElementById('txtDegree').value;
    const qi = document.getElementById('txtQuestionID').value;
    const sendToSoroush = deg;

    const response = await fetch('http://127.0.0.1:8000/chsh/set_angle2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush })
    });

    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const errorData = await response.text();
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  const responseData = await response.json();
	  console.log(responseData);
	  //const parsedData = JSON.parse(responseData);
	  
	  window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=' + responseData.chsh_value + '&returnerror=' + responseData.chsh_error;
    }

  } catch (error) {
    console.error('Error trying to fetch data:', error);
  }
}


async function sendFortuneCookie(deg) {
	try {

    const sendToSoroush = deg;

    // const qi = document.getElementById('txtQuestionID').value;
    const response = await fetch('http://127.0.0.1:8000/rng/user_input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'option': sendToSoroush })
    });

    if (response.status === 200) {
      // Handle non-2xx HTTP status codes
      //const errorData = await response.text();
      //throw new Error(`HTTP error ${response.status}: ${errorData}`);
	  const responseData = await response.json();
	  console.log(responseData);
	  //window.location.href = '../save-answer.php?qi=' + qi + '&pi=' + protocol_id + '&deg=' + deg + '&rp=' + return_page + '&ni=' + name_id + '&play=' + player_id + '&returndata=' + responseData.number;
	  window.location.href = '/for/page4.php?d=' + responseData.number

    //const data = await response.json();
    //console.log(data);

    //setTimeout(() => {
    //  window.location.href = '/for/page4.php?d=' + data;
    //}, 0); // 60 seconds = 60000 milliseconds
  }} catch (error) {
    console.error('Error trying to fetch data:', error);
	//window.location.href = '/for/page4.php?d=32';
  }
}

function takeSurveyQuestion() {

	var degree = getSection(document.getElementById('txtDegree').value,3);
	//alert(degree);

	if (degree == 1) { //under 18
		window.location.href='/survey/sign-research.php?s=u';
	} else if (degree == 2)  { //over 18
		window.location.href='/survey/sign-research.php?s=o';
	} else if (degree == 3) { 
		window.location.href='/index.php';
	}

}

function logSurveyAnswer() {
	var txtQuestionID = document.getElementById('txtQuestionID').value;
	var txtDegree = document.getElementById('txtDegree').value;
	var txtQuestionOrder = document.getElementById('txtQuestionOrder').value;
	var txtSelectedOptions = document.getElementById('txtSelectedOptions').value;
	var txtNextPage = document.getElementById('txtNextPage').value;
	
	$.ajax({
            type : "POST",  
            url  : "save-survey.php",  
            data : { questionID : txtQuestionID, degree : txtDegree, questionOrder : txtQuestionOrder, selectedOptions: txtSelectedOptions},
            
			success: function(res) {
			// Check the response from the server
			if (res.trim() == '') {
			  // Redirect to the new page
			  window.location.href = txtNextPage;
			} else {
			  // Handle the error case
			  console.log("Error:", res);
			}
		  },
			  error: function(xhr, status, error) {
				// Handle the AJAX error
				console.log("AJAX error:", error);
			  }
			});	
}

function selectedOptionSave(divname, o, t) {
	if (t != '' ) {
		
		let currentValue = document.getElementById(t).value;
		let newValue = '';
		
		//alert(currentValue.indexOf(o));
		if (currentValue.indexOf(o) == -1) {
			document.getElementById(divname).style.backgroundColor = '#f0ecec';
		
			//add to hidden text
			//alert(currentValue == '');
			if (currentValue == '') {
				newValue = o;
				//alert('newValue: ' + newValue);
			} else {
				newValue = currentValue + '|' + o;
			}
		} else {
			//remove from hidden text
			newValue = currentValue.replace(o, '');
			document.getElementById(divname).style.backgroundColor = '#ffffff';
		}
		//alert(t + ' = ' + newValue);
		if (newValue != '') {
			newValue = newValue.replace('||','');
			document.getElementById(t).value = newValue;
		}
	}
}

function recalibrate() {
	fetch('http://127.0.0.1:8000/polarimeter/start_normalizing', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  }
	})
	.then(response => response.json())
	//console.log('hi there');
}

function proceedResearch(){
	window.location.href='/survey/page2.php';
}

function refuseResearch() {
	window.location.href='/index.php';
}

function emailConsent() {
	var txtEmail = document.getElementById('txtSelectedOptions').value;
	
	if (txtEmail == '') {
		document.getElementById('emailError').innerHTML = "Please enter an email address";
	} else {
	
		$.ajax({
			type : "POST",  
			url  : "/survey/send-survey.php",  
			data : { txtEmail : txtEmail},

			success: function(res) {
			// Check the response from the server
			if (res.trim() == '') {
			  // Redirect to the new page
			  window.location.href = "/survey/page2.php";
			} else {
			  // Handle the error case
			  console.log("Error:", res);
			}
		  },
			  error: function(xhr, status, error) {
				// Handle the AJAX error
				console.log("AJAX error:", error);
			  }
			});	
	}
}

function emailSurvey() {
	var txtEmail = document.getElementById('txtSelectedOptions').value;
	var questionID = document.getElementById('txtQuestionID').value;
	var degree = document.getElementById('txtDegree').value;
	
	
	if (txtEmail == '') {
		document.getElementById('emailError').innerHTML = "Please enter an email address";
	} else {
	
		$.ajax({
			type : "POST",  
			url  : "/survey/save-survey.php",  
			data : { selectedOptions : txtEmail, questionID: questionID, degree: degree, questionOrder:'14' },

			success: function(res) {
			// Check the response from the server
			if (res.trim() == '') {
			  // Redirect to the new page
			  window.location.href = "/survey/page15.php";
			} else {
			  // Handle the error case
			  console.log("Error:", res);
			}
		  },
			  error: function(xhr, status, error) {
				// Handle the AJAX error
				console.log("AJAX error:", error);
			  }
			});	
	}
}
