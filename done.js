
try {

const response = fetch('http://127.0.0.1:8000/chsh/done', {
  method: 'POST',
  headers: {
	'Content-Type': 'application/json'
  },
  //body: JSON.stringify({ '' });
});

//if (response.status === 200) {

//}

} catch (error) {
console.error('Error trying to fetch data:', error);
}
