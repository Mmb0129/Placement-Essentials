const express = require('express');

const app = express();

const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');

const dbo = require('./db');
const ObjectId = dbo.ObjectId;  // Corrected import

app.use(bodyparser.urlencoded({ extended: true }));

app.engine('hbs', exhbs.engine({ layoutsDir: 'views/', defaultLayout: "main", extname: "hbs" }));
app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', async (req, res) => {
    let database = await dbo.getDatabase();

    const collection = database.collection('books');
    const cursor = collection.find({});

    let books = await cursor.toArray();

    let edit_id, edit_book;

    if (req.query.edit_id) {
        edit_id = req.query.edit_id;
        edit_book = await collection.findOne({ _id: new ObjectId(edit_id) });  // Use ObjectId correctly
    }

    let message = ''; 
    switch (req.query.status) {
        case '1':
            message = 'Inserted Successfully';
            break;

        case '2':
            message = 'Updated Successfully';
            break;

        default:
            break;
    }

    res.render('main', { message, books, edit_id, edit_book });
});

app.post('/store-book', async (req, res) => {

    let database = await dbo.getDatabase();

    const collection = database.collection('books');

    let book = { title: req.body.title, author: req.body.author };
    await collection.insertOne(book);
    return res.redirect('/?status=1');
});

app.post('/update-book/:edit_id', async (req, res) => {

    let database = await dbo.getDatabase();
    let edit_id= req.params.edit_id;

    const collection = database.collection('books');

    let book = { title: req.body.title, author: req.body.author };
    await collection.updateOne({_id:new ObjectId(edit_id)},{$set:book});
    return res.redirect('/?status=2');
});



app.listen(8000, () => {
    console.log("Server Running on port 8000");
});