const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
  res.send('Car doctor server side running')
})

app.listen(port, () =>{
  console.log(`Car doctor server running on port: ${port}`)
})


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lagpjii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('carDoctor').collection('services');

    app.get('/services', async(req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/services/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1, },
      };

      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    // app.post('/sport', async(req, res) =>{
    //   const newSport = req.body;
    //   console.log(newSport);
    //   const result = await sportCollection.insertOne(newSport);
    //   res.send(result);
    // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
