const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const games = require('./routes/games');
const comments = require('./routes/comments');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/api/games', games);
games.use('/:gameId/comment', comments);

const dbConnData = {
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  port: process.env.PORT
};

mongoose
  .connect(`mongodb+srv://${dbConnData.username}:${dbConnData.password}@cluster0.5zws5.mongodb.net/chessAPI?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(response => {
    console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB', error));