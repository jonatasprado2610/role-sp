import express from 'express';
import cors from 'cors';
import { buscarLocais } from '../repository/locaisRepository.js';
import bcrypt from 'bcryptjs';

import { buscarUsuarioPorEmail , buscarUsuarioPorId, inserirUsuario} from '../repository/usuarioRepository.js';
import { gerarToken } from '../utils/token.js';
import { emailValido, maiorDeIdade } from '../utils/validacao.js';
import { autenticar } from '../middlewares/autenticar.js';





const server = express();

server.use(cors());
server.use(express.json());



server.get('/locais', async (req, resp) => {
    try {
        const { nome, bairro, categoria, faixaPreco, parceiro, notaMinima } = req.query;

        const filtros = {
            nome: nome?.trim() || undefined,
            bairro: bairro?.trim() || undefined,
            categoria: categoria?.trim() || undefined,
            faixaPreco: faixaPreco?.trim() || undefined,
            parceiro:
                parceiro === 'true' ? true :
                parceiro === 'false' ? false :
                undefined,
            notaMinima:
                notaMinima !== undefined && !Number.isNaN(Number(notaMinima))
                    ? Number(notaMinima)
                    : undefined,
        };

        const resposta = await buscarLocais(filtros);
        resp.send(resposta);
    } catch (err) {
        console.error('ERRO AO BUSCAR OS LOCAIS', err.message);
        resp.status(500).send({ erro: 'Não foi possível buscar os locais.' });
    }
});

server.post('/auth/cadastro', async (req, resp) => {
    try {

        const { nome, email, senha, dataNascimento, aceiteTermos } = req.body ?? {};
        const nomeLimpo = String(nome ?? '').trim();
        const emailLimpo = String(email ?? '').trim().toLowerCase();

        if (nomeLimpo.length < 2 || nomeLimpo.length > 100) {
            return resp.status(400).send({ erro: 'Informe seu nome (de 2 a 100 caracteres).' });
        }
        if (!emailValido(emailLimpo)) {
            return resp.status(409).send({ erro: 'Informe um e-mail válido.' });
        }
        if (typeof senha !== 'string' || senha.length < 8 || senha.length > 72) {
            return resp.status(400).send({ erro: 'A senha deve ter de 8 a 72 caracteres.' });
        }
        if (!maiorDeIdade(dataNascimento)) {
            return resp.status(400).send({
                erro: 'Informe a data de nascimento (AAAA-MM-DD). É preciso ter 18 anos ou mais.'
            });
        }
        if (aceiteTermos !== true) {
            return resp.status(400).send({ erro: 'ACEITA O TERMOS DE USO CARAMBA' });
        }

        const jaExiste = await buscarUsuarioPorEmail(emailLimpo);
        if (jaExiste) {
            return resp.status(400).send({ erro: 'Este e-mail ja esta sendo usado' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const usuario = await inserirUsuario(nomeLimpo, emailLimpo, senhaHash, dataNascimento);

        const token = gerarToken(usuario);
        resp.status(201).send({ token, usuario })

    } catch (err) {
        if (err.code === '23505') {
            return resp.status(409).send({ erro: 'Este e-mail já está cadastrado.' });
        }
        console.error('Erro no cadastro:', err.message);
        resp.status(500).send({ erro: 'Não foi possível concluir o cadastro.' });
    }
});

server.post('/auth/login', async (req, resp) => {
    try {
        const { email, senha } = req.body ?? {};
        const emailLimpo = String(email ?? '').trim().toLowerCase();

        if (!emailLimpo || typeof senha !== 'string' || senha.length === 0) {
            return resp.status(400).send({ erro: 'Informe e-mail e senha.' });
        }

        const usuario = await buscarUsuarioPorEmail(emailLimpo);
        const senhaCorreta = usuario
            ? await bcrypt.compare(senha, usuario.senhaHash)
            : false;

        if (!senhaCorreta) {
            return resp.status(401).send({ erro: 'E-mail ou senha incorretos.' });
        }

        const token = gerarToken(usuario);
        resp.send({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
            },
        });

    } catch (err) {
        console.error('Erro no login:', err.message);
        resp.status(500).send({ erro: 'Não foi possível fazer login.' });
    }
});

server.get('/auth/eu', autenticar, async (req, resp) => {
    try {
        const usuario = await buscarUsuarioPorId(req.usuario.id);

        if (!usuario) {
            return resp.status(404).send({ erro: 'Usuário não encontrado.' });
        }

        resp.send(usuario);

    } catch (err) {
        console.error('Erro ao buscar usuário:', err.message);
        resp.status(500).send({ erro: 'Não foi possível buscar o usuário.' });
    }
});



export default server;
