const express = require("express");
const session = require('express-session');
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");

dbConnect();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'hello_world',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
