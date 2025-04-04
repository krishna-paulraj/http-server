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
    const method = request.split(" ")[0];
    const path = request.split(" ")[1];
    const param = path.split("/")[1];
    const args = process.argv;
    let acceptEncoding = "";

    if (request.includes("Accept-Encoding")) {
      acceptEncoding = request.split("Accept-Encoding: ")[1].split("\r")[0];
    }

    switch (param) {
      case "": {
        sendResponse("HTTP/1.1 200 OK\r\n\r\n");
        break;
      }
      case "echo": {
        const word = request.split("/")[2].split(" ")[0];
        if (acceptEncoding.includes("gzip")) {
          sendResponse(
            `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Encoding: gzip\r\nContent-Length: ${word.length}\r\n\r\n${word}`,
          );
        } else {
          sendResponse(
            `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${word.length}\r\n\r\n${word}`,
          );
        }
        break;
      }
      case "user-agent": {
        const userAgent = request.split("User-Agent: ")[1].split("\r\n")[0];
        const response = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`;
        sendResponse(response);
        break;
      }
      case "files": {
        const dir = args.slice(3)[0];
        const fileName = path.split("/")[2];
        const filePath = dir + fileName;

        switch (method) {
          case "GET": {
            if (fs.existsSync(filePath)) {
              const fileContent = fs.readFileSync(filePath).toString();
              sendResponse(
                `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${fileContent.length}\r\n\r\n${fileContent}`,
              );
            } else {
              sendResponse("HTTP/1.1 404 Not Found\r\n\r\n");
            }
            break;
          }

          case "POST": {
            const content = request.split("\r\n\r\n")[1];
            console.log(content);
            fs.writeFileSync(filePath, content);
            if (fs.existsSync(filePath)) {
              sendResponse("HTTP/1.1 201 Created\r\n\r\n");
            }
            break;
          }
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
