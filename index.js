const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwoya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// function 

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET ALL service API 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET single service API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the Post api', service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)

        });

        // DELETE service API 

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
};
run().catch(console.dir);


// checking my server
app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.get('/hello', (req, res) => {
    console.log('Hello Update here');
})

app.listen(port, () => {
    console.log('Running Genius Server on Port', port);
});



/*
 one time
 1: heroku account open
 2: heroku software install

 Every Project
 1: git init
 2: .gitignore (node_module, .env)
 3: push everything to git
 4: make sure your have this script: "start": "node index.js",
 5: make sure: put process.env.PORT in front of your port number
 6: heroku login
 7: heroku create (only one time for a project)
 8: command: git push heroku main


 --------
 Update:
 1: save everything check locally
 2: git add, git commit-m "", git push
 3: git push heroku main

*/