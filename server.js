const express = require("express");
const cors = require("cors");

const app = express();

let dbConnect = require("./dbConnection");
app.use(
  cors({
     // Used so we can work with cookies and headers.
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

//Routes
let userRoutes = require("./routes/usersRoute");

app.use("/api/users/", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: { message: error.message } });
});

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server is running on ${port}`));
