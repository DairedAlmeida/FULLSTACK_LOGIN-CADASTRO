const { v4: uuidv4 } = require('uuid');
const { Sequelize, DataTypes } = require('sequelize');
const { encriptar, compararSenha} = require('../ultis/util');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
  });

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }

});

async function cadastroUsuario(name, email, senha) {
    let senhaEncriptada = await encriptar(senha);
    return await User.create({ name, senha: senhaEncriptada, email });
}

async function autentificarUsuario(email, senha) {
    const user = await User.findOne({ where: { email: email } });
    if (user === null) {
        throw "usuario não encontrado"
    }
    if(await compararSenha(senha, user.senha)) {
        let token = uuidv4();
        user.token = token
        await user.save()
        return token
    } else {
        throw "erro"
    }
}

async function confereToken(token){
    const user = await User.findOne({ where: { token: token } });
    if (user === null) {
        throw "usuario não encontrado"
    }
    return user
}

async function alterarSenha(senha,senhaNew,token){
    const user = await confereToken(token);
    console.log(user)
    if (user === null) {
        console.log(user)
        throw "usuario não encontrado"
    } else if(await compararSenha(senha, user.senha)){
        console.log("user not null")
        let senhaEncriptada = await encriptar(senhaNew);
        user.senha = senhaEncriptada
        await user.save()
        return 
    }

    throw "Erro"
}


module.exports = {User, cadastroUsuario, autentificarUsuario, confereToken, alterarSenha}