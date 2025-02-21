import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

// Certifique-se de que o prefixo `/api` está correto
app.use('/api', routes);

const PORT = process.env.PORT || 3000;  //  CONFIRME AQUI SE A PORTA ESTÁ CORRETA

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}/api`);
});
