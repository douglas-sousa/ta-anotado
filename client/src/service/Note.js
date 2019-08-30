const baseUrl = "http://localhost:4000/api/note";

class Note {
  static getUserNotes(userid) {
    return fetch(`${baseUrl}/${userid}`);
  }
  static createNote(userid, title, deadline, text) {
    if(deadline === 'today') deadline = new Date();
    return fetch(`${baseUrl}/${userid}`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ title, deadline, text })
    })
  }
  static updateNote(userid, noteid, title, deadline, text) {
    if(deadline === 'today') deadline = new Date();
    return fetch(`${baseUrl}/${userid}/${noteid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ title, deadline, text })
    })
  }
  static deleteNote(userid, noteid) {
    return fetch(`${baseUrl}/${userid}/${noteid}`, {
      method: "DELETE"
    })
  }
}

export default Note;
