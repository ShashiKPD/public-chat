var overlay = document.getElementById('overlay');
    var url = "https://todo-websocket-basic.onrender.com/healthcheck";
    // var url = "http://localhost/healthcheck"
    var wssurl = "wss://todo-websocket-basic.onrender.com/ws";
    // var wssurl = "ws://localhost/ws";

    function wakeUpBackend() {
      makeApiRequest(url, function(error, data) {
        if (!error) {
          
          console.log("Backend response:", data);
          overlay.style.display = 'none';
        } else {
          console.error("Error waking up backend:", error);
          overlay.textContent = "Failed to connect to backend";
        }
      });
    }

    wakeUpBackend();
    setTimeout(() => {
      wakeUpBackend(); //keep alive
    }, 60000);

    // Replace with your WebSocket server address if different.
    var ws = new WebSocket(wssurl);

    // Log connection status.
    ws.onopen = function() {
      console.log("WebSocket connected.");
    };

    // When receiving a message, assume it's a JSON string containing a "todo" property.
    ws.onmessage = function(event) {
      try {
        var data = JSON.parse(event.data);
        console.log(event.data);
        
        if (data.todo) {
          var ul = document.getElementById('msgs');
          var username = document.createElement('span');
          username.style.color = data.fromUserColor
          var message = document.createElement('span');
          var li = document.createElement('li');
          console.log(data);
          
          username.textContent = data.from.name + ": ";
          message.textContent = data.todo;

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
      var todo = input.value.trim();
      if (todo) {
        // Send the new todo as a JSON message.
        ws.send(JSON.stringify({ todo: todo }));
        input.value = "";
      }
    });