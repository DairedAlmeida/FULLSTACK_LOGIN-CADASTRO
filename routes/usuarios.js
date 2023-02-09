var express = require('express');
const { cadastroUsuario, autentificarUsuario, confereToken, alterarSenha} = require('../models/user');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('Birds home page');
});

router.post('/', async function(req,res){
    try{
        let user = req.body;
        user = await cadastroUsuario(user.name, user.email, user.senha)
        res.status(201).send(user)
    } catch(err){
        res.status(400).send()
    }
});

router.post('/autenticar', async function(req,res){
    try{
        let token;
        let {email, senha} = req.body;
        token = await autentificarUsuario(email, senha)
        res.status(200).send({token})
    } catch(err){
        res.status(400).send()
    }
});

router.post('/isAutenticated', async function(req,res){
    try{
        let user;
        let {token} = req.body;
        user = await confereToken(token)
        res.status(200).send({email:user.email, name:user.name, id:user.id})
    } catch(err){
        res.status(400).send()
    }
});

router.patch('/senha', async function(req,res){
    try{
        let {senha, senhaNew,token} = req.body;
        console.log(senha, senhaNew,token)
        await alterarSenha(senha, senhaNew,token)
        res.status(200).send()
    } catch(err){
        console.log(err)
        res.status(400).send()
    }
});

module.exports = router;