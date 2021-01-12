const express = require("express");
const app = express();
const port = 5000;
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());
const mongoose = require("mongoose");
const { reset } = require("nodemon");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! Its time to start hard work. Can u ready for this?");
});

app.get("/api/hello", (req, res) => {
  res.send("Hello World!");
});
// 회원가입
app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  // Find the requested email
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "There is not user that match the email.",
      });
    }
    // if the email exits, Check the password that is right or not.
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "Wrong password." });
      }
      // if the password is correct, Produce Token.
      userInfo.generateToken((err, userInfo) => {
        if (err) return res.status(400).send(err);

        // where do we store token? maybe Cookie or localStorage.
        // I will store token in Cookie.
        res
          .cookie("x_auth", userInfo.token)
          .status(200)
          .json({ loginSuccess: true, userId: userInfo._id });
      });
    });
  });
});

// auth 는 미들웨어 의미
app.get("/api/users/auth", auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다라는 것은 Authentication 이 true이다.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

// Logout
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      token: "",
    },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
