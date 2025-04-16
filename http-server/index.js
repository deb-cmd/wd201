const http = require("http");
const fs = require("fs");
const minimist = require('minimist'); // Import minimist

// --- Argument Parsing ---
const args = minimist(process.argv.slice(2));
let port = 3000; // Default port

if (args.port) {
    const parsedPort = parseInt(args.port, 10);
    if (!isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
        port = parsedPort;
    } else {
        console.warn(`Invalid port "${args.port}" specified. Using default port ${port}.`);
    }
} else {
    console.log(`No port specified via --port. Using default port ${port}.`);
}
// --- End Argument Parsing ---


const serveFile = (filename, contentType, res) => {
  fs.readFile(filename, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.write("404 Not Found");
      console.error(`Error reading file ${filename}:`, err);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.write(data);
    res.end();
  });
};

const server = http.createServer((req, res) => {
  const url = req.url;
  console.log("Request received for:", url); // Log requested URL

  if (url === "/") {
    serveFile("home.html", "text/html", res);
  } else if (url === "/project") {
    serveFile("project.html", "text/html", res);
  } else if (url === "/registration") { // <-- NEW ROUTE for registration HTML
    serveFile("registration.html", "text/html", res);
  } else if (url === "/script.js") { // <-- NEW ROUTE to serve the JS file
    serveFile("script.js", "application/javascript", res);
  }
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("404 Not Found");
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`); // <-- Use the determined port
});