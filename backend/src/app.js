
import express from 'express';
import cors from 'cors';

import usuarioController from './controller/usuarioController.js'
import locaisController from './controller/locaisController.js';

const server = express();




server.use(cors());
server.use(express.json());

server.get('/', (req, res) => {
    res.json({ mensagem: 'API Role SP funcionando!' });
});

server.use(usuarioController);
server.use(locaisController);

export default server;
