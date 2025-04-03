import * as net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const param = request.split(" ")[1];

    if (param == "/") {
      socket.write(Buffer.from("HTTP/1.1 200 OK\r\n\r\n"));
    } else if (param.startsWith("/echo")) {
      const word = param.split("/")[2];
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${word.length}\r\n\r\n${word}`,
      );
    } else {
      socket.write(Buffer.from("HTTP/1.1 404 Not Found\r\n\r\n"));
    }

    socket.end();
  });
});

server.listen(4221, "localhost");
