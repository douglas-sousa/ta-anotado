const express = require('express');
const mongo = require('mongodb');
const jwt = require('jsonwebtoken');
const encryptKey = 'Fefjd238hf3-k@';

const mongoUrl = 'mongodb://localhost:27017';
const router = express.Router();
const mailer = require('../../mailer');

const { user:response } = require('./response');
const { MongoClient, ObjectID } = mongo;

//Pegar todos os membros do Tá Anotado!
router.get('/', async(req, res) => {
  const col = await membersCollection();
  res.send(await col.find({}, { projection: { username: 1 }}).toArray());
});
//Criar um membro
router.post('/', async(req, res) => {
  const { email, username, password } = req.body;
  const col = await membersCollection();
  const verifyIfExists = await col.findOne({username});
  if(!verifyIfExists) {
    await col.insertOne({ email, username, password });

    //Enviar email de cadastro para o novo usuário
    let subject = 'Seja bem vindo!';
    let text = `
    Obrigado por querer fazer parte de nosso site, ${username}!
    Esperamos que você possa aproveitá-lo e estamos sempre aberto a sugestões!
    Vamos anotar com muito carinho tudo!`;
    mailer(email, subject, text).sender();

    res.status(201)
      .send(response.userCreated)
      .json(response.userCreated);
  }
  res.status(409)
    .send(response.userAlreadyExists)
    .json(response.userAlreadyExists);
});
//Verificar a entrada do usuário
router.post('/auth', async(req, res) => {
  const col = await membersCollection();
  const member = { username: req.body.username, password: req.body.password };
  let result = await col.findOne(member, { projection: { _id: 1, username: 1 }});
  if(!result) {
    res.status(404)
      .send(response.userNotRegistered)
      .json(response.userNotRegistered);
    return;
  }
  jwt.sign(result, encryptKey, { expiresIn: "12h" } ,(err, token) => {
    if(err) {
      console.log(err);
      return;
    }
    res.status(200)
      .send({token})
      .json({token});
  })
});
//Pegar usuário específico
router.get('/:username', async(req, res) => {
  const col = await membersCollection();
  try {
    const query = await col.findOne({username: req.params.username});
    console.log(query);
    res.status(200)
      .send(query)
      .json(query);
  } catch(err) {
    console.log(err);
  }
});
//Remover um membro
router.delete('/:username', async(req, res) => {
  const col = await membersCollection();
  await col.deleteOne({ username: req.params.username });
  res.status(200)
    .send(response.userDeleted)
    .json(response.userDeleted);
});
//Atualizar um membro
router.put('/:username', async(req, res) => {
  const { username:newU, password:newP } = req.body;
  const { username:oldU } = req.params;
  const col = await membersCollection();
  await col.updateOne({oldU}, {newU, newP});
  res.status(200)
    .send(response.userUpdated)
    .json(response.userUpdated);
});

//Conexão com o MongoDB
async function membersCollection(_collection = 'members', _database = 'Users') {
  const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true });
  return client.db(_database).collection(_collection);
}

module.exports = router;

//Retornar usuário e sua anotação
//Usar o nomatch na rota caso deseje procurar todos os usuários e suas anotações
/*router.get('/info/:username', async(req, res) => {
  const col = await membersCollection();
  const { username } = req.params;
  //Objetos para o aggregate
  const project = { $project: { _id: 0, password: 0, username: 0 } }; //Esse project serve somente para o objeto pai - nesse caso o Usuário
  const match = { $match: { username } };
  const lookup = {
    $lookup: {
      from: "notes",
      localField: "_id",
      foreignField: "user_id",
      as: "notes"
    }
  };
  //--
  let value;
  (username !== 'nomatch') ? value = await col.aggregate([match, lookup, project]).toArray()
  : value = await col.aggregate([lookup, project]).toArray();
  res.status(200)
    .send(value)
    .json(value);
});*/