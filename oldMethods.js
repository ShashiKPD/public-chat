// Abstracted XMLHttpRequest function
function makeApiRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          callback(null, response);
        } catch (error) {
          callback('Error parsing response: ' + error, null);
        }
      } else {
        callback('Error fetching data: HTTP status ' + xhr.status, null);
      }
    }
  };

  xhr.send();
}

// // Use the abstracted function for fetching cat fact
// function fetchCatFact() {
//   makeApiRequest('https://meowfacts.herokuapp.com/', function(error, data) {
//     if (error) {
//       console.error(error);
//       document.getElementById('test').textContent = 'Could not fetch cat fact.';
//     } else {
//       document.getElementById('test').textContent = data.data[0];
//     }
//   });
// }

// fetchCatFact(); // Fetch the cat fact on page load.
