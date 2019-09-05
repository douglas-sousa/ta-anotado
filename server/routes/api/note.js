const express = require('express');
const mongo = require('mongodb');
const mongoUrl = "mongodb://localhost:27017";
const router = express.Router();

const { MongoClient, ObjectID } = mongo;
const { note:response } = require('./response');

//Retornar as anotações de um usuário
router.get('/:userid', async(req, res) => {
  const col = await notesCollection();
  const { userid } = req.params;
  try{
    const notes = await col.find({ user_id: ObjectID(userid) }, { projection: { user_id: 0 } }).toArray();
    res.status(200)
      .send(notes)
      .json(notes);
  } catch(err) {
    console.log(err);
  }
});
//Criar uma nova anotação
router.post('/:userid', async(req, res) => {
  const col = await notesCollection();
  const { userid } = req.params;
  let { title, deadline, text } = req.body;
  if(deadline == '9999' || deadline < new Date().getFullYear()) {
    deadline = '9999'; //Esse vai servir como o falar para quando a data não for especificada
    await col.insertOne({
      title,
      deadline: new Date(`${deadline}-`),
      text,
      user_id: ObjectID(userid)
    });
  } else {
    await col.insertOne({
      title,
      deadline: new Date(deadline),
      text,
      user_id: ObjectID(userid)
    });
  }
  res.status(201)
    .send(response.noteCreated)
    .json(response.noteCreated);
});

//Editar uma anotação
router.put('/:userid/:noteid', async(req, res) => {
  const col = await notesCollection();
  const { title, deadline, text } = req.body;
  const { userid, noteid } = req.params;
  await col.updateOne({ _id: ObjectID(noteid), user_id: ObjectID(userid) }, {
      $set: {
        _id: ObjectID(noteid), 
        title,
        deadline: new Date(deadline),
        text,
        user_id: ObjectID(userid)
      }
    }, { upsert: true }
  );
  res.status(200)
    .send(response.noteUpdated)
    .json(response.noteUpdated);
});
//Remover uma anotação
router.delete('/:userid/:noteid', async(req, res) => {
  const col = await notesCollection();
  const { userid, noteid } = req.params;
  await col.deleteOne({ _id: ObjectID(noteid), user_id: ObjectID(userid) });
  res.status(200)
    .send(response.noteDeleted)
    .json(response.noteDeleted);
})

async function notesCollection(_collection = 'notes', _database = 'Users') {
  const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
  return client.db(_database).collection(_collection);
}

module.exports = router;