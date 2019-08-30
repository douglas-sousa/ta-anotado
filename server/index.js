const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;
const apiMember = require('./routes/api/member');
const apiNote = require('./routes/api/note');

//Middleware
app.use(cors());
app.use(express.json());
//--

app.use('/api/member', apiMember);
app.use('/api/note', apiNote);

app.listen(port, function() {
  console.log("Servidor rodando na porta " + port);
})