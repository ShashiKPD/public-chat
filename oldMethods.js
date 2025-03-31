// Abstracted XMLHttpRequest function
function makeApiRequest(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);

  // Include credentials (such as cookies)
  xhr.withCredentials = true;

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
