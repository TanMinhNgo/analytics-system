const { WebSocketServer } = require("ws");
const { etlEvents } = require("../etl/etl-events");

function setupWebsocket(server) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const jobId = url.searchParams.get("jobId");

    const listener = (event) => {
      if (!jobId || String(event.jobId) === jobId) {
        socket.send(JSON.stringify({ type: "etl", ...event }));
      }
    };

    etlEvents.on("progress", listener);

    socket.on("close", () => {
      etlEvents.off("progress", listener);
    });
  });
}

module.exports = { setupWebsocket };
