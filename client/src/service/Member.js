const baseUrl = "http://localhost:4000/api/member";

class Member {
  static async getMembers() {
    let call = await fetch(baseUrl);
    return call.json();
  }

  static thisMember(username) {
    return fetch(`${baseUrl}/${username}`);
  }

  static createMember({ email, username, password }) {
    return fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        email, username, password
      })
    })
  }

  static authMember({username, password}) {
    return fetch(`${baseUrl}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        username, password
      })
    })
  }

  static deleteMember({username, password}) {
    return fetch(`${baseUrl}/${username}/${password}`, {
      method: "DELETE"
    })
  }

  //Atualizar membro


  static memberNotes(id) {
    return fetch(`${baseUrl}/notes/${id}`);
  }
}

export default Member;