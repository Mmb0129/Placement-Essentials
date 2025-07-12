const express=require('express');

const app=express();

const path = require('path')

app.set('views',path.join(__dirname,'views'))

const multer = require('multer')
app.set('view engine','ejs')

var storage=multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,'uploads')
    },
    filename :function(req,file,cb){
        cb(null,file.originalname.replace(/\.[^/.]+$/,"")+'-'+Date.now()+path.extname(file.originalname))
    }
})

let maxSize= 2*1000*1000

let upload = multer({
    storage :storage,
    limits:{
        fileSize: maxSize
    },
    fileFilter :function(req, file, cb){
        let filetypes = /jpeg|png|jpg/;
        let mimetype = filetypes.test(file.mimetype);

        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(mimetype && extname){
            return cb(null,true)
        }

        cb("Error : Only allowed "+filetypes)
    }
}).single('mypic')

app.get('/',(req,res)=>{
    res.render('signup');
})

app.post('/upload',(req,res,next)=>{
    upload(req,res,function(err){
        if (err){
            if(err instanceof multer.MulterError && err.code=="LIMIT_FILE_SIZE"){
                res.send("File Size Should be less than 2MB");
            }
            
        }else{
            res.send("Sucess Uploaded");
        }
    })
})

app.listen(8080,()=>{
    console.log("Server Running");
})