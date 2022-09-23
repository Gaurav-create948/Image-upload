const express = require("express");
const app = express();
const PORT = 7000;
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });
const ejs = require("ejs");
const mongoose = require("mongoose");

// connect to database
mongoose.connect("mongodb://localhost:27017/image", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const imageSchema = new mongoose.Schema({
  filename: String,
  contentType : String,
  imagebase64: String
});

const image = mongoose.model("image", imageSchema);

app.set("view engine", "ejs");
app.use(express.json());

app.get("/", (req, res) => {
    image.find({}, function(err, image){
        if(!image){
            res.render("index");
        }else{
            res.render("index", {image: image});
        }
    }) 
});

app.post("/", uploads.array('image', 5), function(req, res, next){
  const images = req.files;
  let newImage
  images.forEach((uploadedImages) => {
      newImage = new image({
      filename: uploadedImages.originalname,
      contentType: uploadedImages.mimetype,
      imagebase64: uploadedImages.buffer.toString('base64')
    });
  })

  newImage.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/');
    }
  });
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});
