var overlay = document.getElementById('overlay');
    var baseurl = "https://todo-websocket-basic.onrender.com";
    // var baseurl = "http://192.168.10.12:8080"
    var wssurl = "wss://todo-websocket-basic.onrender.com/ws";
    // var wssurl = "ws://192.168.10.12:8080/ws";

    function wakeUpBackend() {
      makeApiRequest(baseurl + "/healthcheck", function(error, data) {
        if (!error) {
          
          console.log("Backend response:", data);
          overlay.style.display = 'none';

          setTimeout(function () {
            wakeUpBackend(); //keep alive
          }, 60000);
        } else {
          console.error("Error waking up backend:", error);
          overlay.textContent = "Failed to connect to backend";
        }
      });
    }
    wakeUpBackend();

    // get userID
    makeApiRequest(baseurl + "/connect", function(error, data) {
      if (!error) {
        console.log("User:", data);
        startWebSocket();
      } else {
        console.error("Error getting userID:", error);
      }
    });

  function startWebSocket(){
    var ws = new WebSocket(wssurl);

    ws.onopen = function() {
      console.log("WebSocket connected.");
    };

    // When receiving a message, assume it's a JSON string containing a "message" property.
    ws.onmessage = function(event) {
      try {
        var data = JSON.parse(event.data);
        console.log(event.data);
        
        if (data.message) {
          var ul = document.getElementById('msgs');
          var username = document.createElement('span');
          username.style.color = data.from.userColor
          var message = document.createElement('span');
          var li = document.createElement('li');
          console.log(data);
          
          username.textContent = data.from.name + ": ";
          message.textContent = data.message;

          li.appendChild(username);
          li.appendChild(message);
          ul.appendChild(li);
        }
      } catch(e) {
        console.error("Error parsing message:", e);
      }
    };

    // Handle form submission.
    document.getElementById('msgForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var input = document.getElementById('msgInput');
      var message = input.value.trim();
      if (message) {
        ws.send(JSON.stringify({ message: message }));
        input.value = "";
      }
    });
  }