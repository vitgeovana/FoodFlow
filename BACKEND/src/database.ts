import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Verificar se as variáveis de ambiente estão carregadas corretamente
console.log("🔍 Verificando credenciais do PostgreSQL:");
console.log("PG_HOST:", process.env.PG_HOST);
console.log("PG_USER:", process.env.PG_USER);
console.log("PG_PASSWORD:", typeof process.env.PG_PASSWORD === "string" ? "medeiros327790" : "Não definido ou inválido");
console.log("PG_DATABASE:", process.env.PG_DATABASE);
console.log("PG_PORT:", process.env.PG_PORT);

// Configuração segura do Pool de conexão
const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  user: process.env.PG_USER || "postgres",
  password: process.env.PG_PASSWORD ? String(process.env.PG_PASSWORD) : "medeiros327790", // Converte para string para evitar erros
  database: process.env.PG_DATABASE || "foodflow",
  port: Number(process.env.PG_PORT) || 5432,
  max: 10, // Número máximo de conexões no pool
  idleTimeoutMillis: 30000, // Tempo antes de uma conexão inativa ser fechada
  connectionTimeoutMillis: 2000 // Tempo máximo para tentar uma nova conexão
});

// Testar a conexão com o banco
pool.connect()
  .then(client => {
    console.log("✅ Conectado ao PostgreSQL!");
    client.release(); // Liberar a conexão após teste bem-sucedido
  })
  .catch(error => {
    console.error("❌ Erro ao conectar ao PostgreSQL:", error);
  });

export default pool;
