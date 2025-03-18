require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const cors = require("cors");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.model.js");
const { isLoggedIn } = require("./middleware.js");
const Course = require("./models/course.model.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true, 
    methods: "GET,POST,PUT,DELETE",
  })
)
app.use(express.static(path.join(__dirname, "build")));
app.use(
  session({
    secret: process.env.MY_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, 
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/',(req,res)=>{
  res.send("Server working")
})

app.post("/signup", async (req, res) => {
  try {
    let { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    let ifUserExist = await User.exists({ username });
    if (ifUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ username });
    await User.register(user, password);

    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

app.post("/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).json({ message: "User login successfully", user: req.user });
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    res.status(200).json({ message: "User logout successfully" });
  });
});

app.get("/courses", async (req, res) => {
  try{
    const data = await Course.find().populate("user");
    res.status(200).json(data);
  }catch(err){
    res.status(400).json({message:"Failed to load courses"})
  }
});

app.post("/buy/:userId", async (req, res) => {
  try {
    let { courseId } = req.body;
    let { userId } = req.params;
    let user = await User.findById(userId);
    let course = await Course.findById(courseId);
    if (course.user.toString() === userId.toString()) {
      return res
        .status(202)
        .json({ message: "Cannot buy since you created this course" });
    }
    let isDuplicate = user.courses.some((course) => {
      if (String(course._id) === String(courseId)) {
        return true;
      }
    });

    if (isDuplicate) {
      return res.status(201).json({ message: "Course already bought" });
    }
    await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { courses: courseId },
    });
    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get("/:userId/courses", async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate({
    path: "courses",
    populate: {
      path: "user",
    },
  });
  res.status(200).json({ user: user });
});

app.post("/:userId/createCourse", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image." });
    }
    cloudinary.uploader
      .upload_stream({ folder: "courses" }, async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Image upload failed" });
        }

        const newCourse = new Course({
          title: name,
          price: price,
          description: description,
          image: result.secure_url,
          user: req.params.userId,
        });

        const course = await newCourse.save();
        await User.findByIdAndUpdate(req.params.userId, {
          $addToSet: { myCourses: course._id },
        });

        res.status(200).json({ message: "New course added", course });
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/:userId/myCourses", async (req, res) => {
  const user = await User.findById(req.params.userId).populate({
    path: "myCourses",
    populate: {
      path: "user",
    },
  });
  res.status(200).json({ myCourses: user.myCourses });
});

app.post("/:courseId/delete", async (req, res) => {
  const user = req.body.userAtLocalStorage;
  await User.findByIdAndUpdate(user._id, {
    $pull: { myCourses: { _id: req.params.courseId } },
  });
  await Course.findByIdAndDelete(req.params.courseId);
  res.status(200).json({ message: "Course deleted" });
});

app.post("/:courseId/edit", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, oldImage } = req.body;
    if (!req.file) {
      await Course.findByIdAndUpdate(req.params.courseId, {
        title: name,
        description: description,
        price: price,
        image: oldImage,
      });
      return res.status(200).json({ message: "Course updated" });
    } else {
      const oldImagePublicId = oldImage?.split("/")?.pop()?.split(".")[0];
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(`courses/${oldImagePublicId}`);
      }
      cloudinary.uploader
        .upload_stream({ folder: "courses" }, async (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Image upload failed" });
          }
          await Course.findByIdAndUpdate(req.params.courseId, {
            title: name,
            description: description,
            price: price,
            image: result.secure_url,
          });
          res.status(200).json({ message: "Course updated" });
        })
        .end(req.file.buffer);
    }
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
const port=process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server connected on port 3000");
})
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

