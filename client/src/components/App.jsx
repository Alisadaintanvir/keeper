import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]);

  const serverUrl = "https://keeper-black.vercel.app";

  function addNote(newNote) {
    axios
      .post(`${serverUrl}/api/add-note`, { newNote })
      .then((res) => {
        console.log("Note has been sent successfully!", res.data);
        fetchNotes();
      })
      .catch((err) => console.log("Error sending the note: ", err));
  }

  function deleteNote(id) {
    axios
      .delete(`${serverUrl}/api/note/${id}`)
      .then((res) => {
        console.log(res.data);
        fetchNotes();
      })
      .catch((err) => {
        console.error("Error deleting note:", err);
      });
  }

  function fetchNotes() {
    axios
      .get(`${serverUrl}/api/all-notes`)
      .then((res) => {
        setNotes(res.data);
      })
      .catch((err) => {
        console.log("Error retrieving notes: ", err);
      });
  } // Include notes in the dependency array

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
