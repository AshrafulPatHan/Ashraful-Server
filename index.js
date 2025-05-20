require('dotenv').config()
const cors = require('cors')
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5022 ;

app.use(express.json());
app.use(cors())

app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// data base collection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hesexcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
// Server code
// Database collection 
const DataBase = client.db('Ashraful');
const massage = DataBase.collection('mail');

// server function
// post mail
app.post('/mail', async(req,res) =>{
    const mail = req.body;
    try{
        const result = await massage.insertOne(mail);
        res.send(result);
        console.log("data is send to database");
    }catch(error){
        console.error("the massage is not send to database because ->",error);
        res.status(500).send({massage:"error is coming to insert mail"});
    };
});

// get mail
app.get('/mails',async(req,res)=>{
    try{
        const bodyData = massage.find();
        const result = await bodyData.toArray();
        res.send(result)
        console.log("mail is display");
        
    }catch(error){
        console.error("the data is not get from database because => ", error)
        res.status(500).send({massage:"error is coming to get mail data"})
    }
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.connect();
  }
}
run().catch(console.dir);

