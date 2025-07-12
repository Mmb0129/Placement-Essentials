const express = require('express');
const router = express.Router();
const path = require('path');



router.get('/add-product',(req,res,next)=>{   //middleware
    console.log("Adding Product: Second Middleware");
    // res.send('<html><h1>Add Product</h1><form action="http://localhost:3739/admin/store-product" method="POST"><input type="text" name="title"/><input type="submit" value="Submit"></form></html>')
    res.sendFile(path.join(__dirname,'..','views','add-product.html'));
    // next();     //go to next middleware
})


router.post('/store-product',(req,res,next)=>{   //middleware
    console.log('Body:',req.body)
    res.send('<b>Product Submitted</b>')
   // next();     //go to next middleware
})

module.exports= router;