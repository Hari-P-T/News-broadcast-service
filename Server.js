const net = require('net');
const readline = require('readline');

const serverPort = 8080;
let clients = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const server = net.createServer((socket) => {
  console.log('Client connected');
  clients.push(socket);
  console.log(`Number of clients: ${clients.length}`);

  socket.on('end', () => {
    clients = clients.filter(client => client !== socket);
    console.log('Client disconnected');
    console.log(`Number of clients: ${clients.length}`);
  });

  socket.on('error', (err) => {
    console.error(`Socket error: ${err}`);
  });
});

server.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});

server.on('error', (err) => {
  console.error(`Server error: ${err}`);
});

function broadcastMessage(message) {
  if (clients.length > 1) {
    clients.forEach((client) => {
      client.write(message);
    });
  } else {
    console.log('Not enough clients to broadcast message');
  }
}

rl.on('line', (input) => {
  console.log(`Sending message: ${input}`);
  broadcastMessage(input);
});
