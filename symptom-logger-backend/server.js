const { PORT = 5555 } = process.env;
const app = require("./app");

const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
