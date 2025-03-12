const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const dbURI = `mongodb+srv://${process.env.MONGO_USUARIO}:${process.env.MONGO_SENHA}@cluster0.xgw6c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Conectado ao MongoDB com sucesso');
  } catch (err) {
    console.error('Erro ao conectar com MongoDB:', err);
    throw new Error('Erro ao conectar com MongoDB');
  }
};

module.exports = connectDB;
