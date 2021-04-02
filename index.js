const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vo54x.mongodb.net/puppy-shot?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

client.connect(err => {
    const productCollection = client.db("puppy-shot").collection("products");
    const orderedProduct = client.db("puppy-shot").collection("orderedProducts");

    app.get('/products',(req, res)=>{
        productCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents);
        })
    })
    app.post("/addOrder/:email", (req, res) => {
        const order = req.body;
        orderedProduct.insertOne(order)
            .then(result => {
                console.log('data added successfully');
                res.send("data added successfully");
                res.redirect('/checkout');
            })
    })
    app.post("/addProducts", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('data added successfully');
                res.send("data added successfully");
                res.redirect('/');
            })
    })
    app.get('/person/:email', (req, res) => {
        orderedProduct.find({ email: req.params.email })
            .toArray((err, documents) => {
                console.log(req.params.email)
                res.send(documents);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => { 
            console.log(result);
            res.send(result.deletedCount>0)
        })
    })
});








console.log("listening");


app.listen(5055);