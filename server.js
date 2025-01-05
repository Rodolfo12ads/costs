const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(cors()); // Habilita o CORS
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`JSON Server está rodando na porta ${PORT}`);
});
