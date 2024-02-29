const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

// Express
const app = express();

// Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/myDatabase');

// Set View  
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


// Definisikan model MongoDB
const Data = mongoose.model('latihan', {
    filename: String,
    contentType: String,
    image: Buffer,
    content : String
});

// Membuat storage untuk penyimpanan file yang di upload 
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './upload/')
    },
    filename:  (req, file, cb) => {
        cb(null, new Date().getTime() + '-'+ file.originalname)
      }
})

const upload = multer({storage: storage});

// Inisiasi halaman form
app.get('/', (req, res)=>{
    res.render("form")
})

// Endpoint untuk upload gambar
app.post('/upload', upload.single('image'), async (req, res) => {
    // Masukkan data ke mongoDB
  await Data.insertMany({
    filename: req.file.filename,
    contentType: req.file.mimetype,
    imaget: fs.readFileSync(req.file.path),
    content: req.body.content
  })
  res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server berjalan di port 3000');
});