const multer = require("multer");

const fs1 = require("fs-extra");
let filtro = false;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const ruta = './uploads'
        fs1.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
        
    }   
});

const uploadFilter = function (req, file, cb,) {

     let typeArray = file.mimetype.split('/');
     let fileType = typeArray[1];
    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
        cb(null, true);
    } else {
            cb(null, false);
            console.log("archivo no cumple el filtro");
    }

 };

const upload = multer({ 
    storage: storage,
    fileFilter: uploadFilter
 });

exports.upload = upload.single("myFile");
