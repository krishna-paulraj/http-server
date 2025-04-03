import * as net from "net";
import fs from "fs";

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
    const args = process.argv;

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
      case "files": {
        const dir = args.slice(3)[0];
        const fileName = path.split("/")[2];
        const filePath = dir + fileName;

        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath).toString();
          console.log(fileContent.length);
          sendResponse(
            `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`,
          );
        } else {
          sendResponse("HTTP/1.1 404 Not Found\r\n\r\n");
        }

        break;
      }
      default: {
        sendResponse("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    }
  });
});

server.listen(4221, "localhost");
