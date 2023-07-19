import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import mongo from "mongodb";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
//Mongodb Connection

const MONGO_URL = process.env.mongo_url;

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongodb is connected successfully");
  return client;
}

const client = await createConnection();

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

//get all books
app.get("/books", async (req, res) => {
  const books = await client
    .db("b47-book-app")
    .collection("books")
    .find()
    .toArray();
  res.send(books);
});

//delete book by ID
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  const book = await client
    .db("b47-book-app")
    .collection("books")
    .deleteOne({ id: id });
  res.send(book);
});

//delete using object id
// app.delete("/books/:id", async (req, res) => {
//   const _id = Number(req.params);
//   const book = await client
//     .db("b47-book-app")
//     .collection("books")
//     .deleteOne({ _id }, (err, result) => {
//       if (err) throw err;
//       res.send("Deleted Successfully");
//     });
//   res.send(book);
// });

//add books
app.post("/books", async (req, res) => {
  const newBooks = req.body;
  const output = await client
    .db("b47-book-app")
    .collection("books")
    .insertMany(newBooks);
  res.send(output);
});

//edit books
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const updatedBooks = req.body;
  const output = await client
    .db("b47-book-app")
    .collection("books")
    .updateOne({ id: id }, { $set: updatedBooks });
  res.send(output);
});

//need to use body-parser
//app.use(bodyParser.urlencoded({ extended: true })
//app.use(bodyParser.json())
//edit books
// app.put("/books/:id", async (req, res) => {
//   const oid = Number(req.params.id);
//   const updatedBooks = req.body;
//   const output = await client
//     .db("b47-book-app")
//     .collection("books")
//     .updateOne({ id: oid }, { $set: updatedBooks });
//   res.send(output);
// });

app.listen(PORT, () => console.log("Server starting on port", PORT));
