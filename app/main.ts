import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  const sendResponse = (val: String) => {
    socket.write(Buffer.from(val));
    socket.end();
  };

  socket.on("data", (data) => {
    const request = data.toString();
    const path = request.split(" ")[1];
    const param = path.split("/")[1];

    switch (param) {
      case "": {
        sendResponse("HTTP/1.1 200 OK\r\n\r\n");
        break;
      }
      case "echo": {
        const word = request.split("/")[2].split(" ")[0];
        sendResponse(
          `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${word.length}\r\n\r\n${word}`,
        );
        break;
      }
      case "user-agent": {
        const userAgent = request.split("User-Agent: ")[1].split("\r\n")[0];
        console.log(userAgent);
        const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
        sendResponse(response);
        break;
      }
      default: {
        sendResponse("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    }
  });
});

server.listen(4221, "localhost");
