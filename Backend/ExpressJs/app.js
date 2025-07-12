// const http = require('http');

const express = require('express');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const path =require('path')

const bodyparser = require('body-parser');

// app.use('/second',(req,res,next)=>{   //middleware
//     console.log("Second Page: Second Middleware");
//    // res.send('<html><h1>Hello From ExpressJs</h1></html>')

//     next();     //go to next middleware
// })

// app.use('/',(req,res,next)=>{   //middleware
//     console.log("Server Works By ExpressJs: First Middleware");
//     res.send('<html><h1>Hello From ExpressJs</h1></html>')

//    // next();     //go to next middleware
// })

app.use(bodyparser.urlencoded())

app.use(express.static(path.join(__dirname,'public')));



app.use('/admin',adminRoutes)

app.use(shopRoutes);


app.use((req,res,next)=>{   //To handle not defined url`
    // res.status(404).send('<h1>404 Page Not Found</h1>');
    // res.statusCode(404);
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})


// app.use('/add-product',(req,res,next)=>{   //middleware
//     console.log("Adding Product: Second Middleware");
//     res.send('<html><h1>Add Product</h1><form action="/store-product" method="POST"><input type="text" name="title"/><input type="submit" value="Submit"></form></html>')

//     // next();     //go to next middleware
// })


// app.use('/store-product',(req,res,next)=>{   //middleware
//     console.log('Body:',req.body)
//     res.send('<b>Product Submitted</b>')
//    // next();     //go to next middleware
// }) to avoid this middleware get accessed during GET req we use app.post

// app.post('/store-product',(req,res,next)=>{   //middleware
//     console.log('Body:',req.body)
//     res.send('<b>Product Submitted</b>')
//    // next();     //go to next middleware
// })

// app.use((req,res,next)=>{   //middleware
//     console.log("Server Works By ExpressJs: SecondMiddleware");
//     // next();     //go to next middleware
//     //we have to explicitly send the response
//    // res.send('<html><h1>Hello From ExpressJs</h1></html>')

//     res.send('{Name:MMB}');
// })



app.listen(3739);

// const server = http.createServer(app);
// server.listen(3739);