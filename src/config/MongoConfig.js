const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const dbURI = `mongodb+srv://${process.env.MONGO_USUARIO}:${process.env.MONGO_SENHA}@cluster0.xgw6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    throw new Error('Erro ao conectar com MongoDB. ' + error)
  }
};

module.exports = connectDB;