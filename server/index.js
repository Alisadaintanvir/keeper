// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Create an instance of Express
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Parse

const dbUser = process.env["DB_USERNAME"];
dbPassword = process.env["DB_PASSWORD"];
const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.dky6ezp.mongodb.net/keeper?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => console.log("Failed to connect to MongoDB:", err));

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const note = mongoose.model("Note", noteSchema);

// Define route
app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.get("/api/all-notes", (req, res) => {
  note
    .find({})
    .then((notes) => res.json(notes))
    .catch((err) => {
      res.status(500).json({ message: "Failed to retrieve notes", error: err });
      console.log("Error retrieving notes: ", err);
    });
});

app.post("/api/add-note", (req, res) => {
  const noteData = req.body.newNote;
  const newNote = new note(noteData);
  newNote
    .save()
    .then((noteData) => {
      console.log("Note saved", noteData);
    })
    .catch((err) => {
      console.log("Failed to save note", err);
    });
  res.send({ message: "New note received successfully" });
});

app.delete("/api/note/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await note.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to delete note", error: err });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
