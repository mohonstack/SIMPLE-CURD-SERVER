
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgagqeu.mongodb.net/`
);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('You successfully connected to MongoDB!');
    return client;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db('simpleCrudDB');
const users = db.collection('users');

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Simple server is running');
});

app.get('/users', async (req, res) => {
 
    const cursor = users.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers);

});

app.get('/users/:id', async(req,res)=>{
    console.log('params in the server',req.params)
    const id= req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await users.findOne(query);
    res.send(result);



})

app.patch("/users/:id", async (req, res) => {
  console.log("params in the server", req.params);

  const id = req.params.id;
  const updateUser = req.body;

  console.log("update userId:", id, "user", updateUser);

  const filter = { _id: new ObjectId(id) };

  const updateDoc = {
    $set: {
      name: updateUser.name,
      email: updateUser.email,
    },
  };

  const result = await users.updateOne(filter, updateDoc);

  const updatedUser = await users.findOne(filter);

  res.send(updatedUser);
});

app.delete('/users/:id', async(req,res)=>{
    console.log('params in the server',req.params)
    const id= req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await users.deleteOne(query);
    res.send(result);



})

app.post('/users',async(req,res)=>{
    const newUser=req.body;
    console.log("neew user addint",newUser);
    const result=await users.insertOne(newUser);
    res.send(result);

})





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
