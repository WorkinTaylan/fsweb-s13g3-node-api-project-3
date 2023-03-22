const express = require('express');
const usersRoutes=require("./users/users-router");
const {logger}=require("./middleware/middleware")
// ekspres'in varsayılan olarak istek gövdelerinde JSON'u ayrıştıramayacağını unutmayın
// global ara yazılımlar ve kullanıcı routelarının buraya bağlanması gerekir
const server = express();
server.use(express.json());
server.use ("/api/users", logger, usersRoutes)


server.get('/', logger, (req, res) => {
  res.send(`<h2>Biraz ara yazılım yazalım!</h2>`);
});

module.exports = server;
