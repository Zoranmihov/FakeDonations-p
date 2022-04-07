const mongoose = require("mongoose");

let mongoDbUrl =
  "mongodb+srv://FakeUser:FakeUser97@cluster0.cxkvv.mongodb.net/FakeSubscription";

mongoose.connect(mongoDbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let dbConnect = mongoose.connection;

dbConnect.on("error", () => {
  console.log("Fail");
});

dbConnect.on("connected", () => {
  console.log("Success");
});

module.exports = mongoose;