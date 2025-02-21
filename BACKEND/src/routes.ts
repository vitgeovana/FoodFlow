import { Router, Request, Response } from 'express';
import pool from './database';

const router = Router();

interface Prato {
    id: number;
    nome: string;
}

interface Pedido {
    id: number;
    horario: string;
    status: string;
    tempo_estimado?: number;
    pratos: Prato[];
}
/* ==========================
 📌 Criar uma nova pessoa
========================== */
router.post('/pessoa', async (req: Request, res: Response) => {
    try {
        const { nome, numero_mesa } = req.body;

        if (!nome || !numero_mesa) {
            return res.status(400).json({ error: 'Nome e número da mesa são obrigatórios' });
        }

        const result = await pool.query(
            'INSERT INTO pessoa (nome, numero_mesa) VALUES ($1, $2) RETURNING *',
            [nome, numero_mesa]
        );

        console.log(`✅ Nova pessoa cadastrada:`, result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erro ao salvar pessoa:', error);
        res.status(500).json({ error: 'Erro ao salvar pessoa' });
    }
});

/* ==========================
 📌 Buscar todas as pessoas cadastradas
========================== */
router.get('/pessoa', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM pessoa ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erro ao buscar pessoas:', error);
        res.status(500).json({ error: 'Erro ao buscar pessoas' });
    }
});

/* ==========================
 📌 Buscar pratos disponíveis
========================== */
router.get('/pratos', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT id, nome, CAST(preco AS FLOAT) as preco FROM pratos ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erro ao buscar pratos:', error);
        res.status(500).json({ error: 'Erro ao buscar pratos' });
    }
});

/* ==========================
 📌 Criar um novo pedido
========================== */
router.post('/pedido', async (req: Request, res: Response) => {
    try {
        const { pessoa_id, pratos } = req.body;

        if (!pessoa_id || !pratos || !Array.isArray(pratos) || pratos.length === 0) {
            return res.status(400).json({ error: 'ID da pessoa e lista de pratos são obrigatórios' });
        }

        const pedidoResult = await pool.query(
            'INSERT INTO pedido (pessoa_id, status) VALUES ($1, $2) RETURNING id',
            [pessoa_id, 'Pendente']
        );

        const pedidoId = pedidoResult.rows[0].id;

        for (const prato_id of pratos) {
            await pool.query(
                'INSERT INTO pedido_prato (pedido_id, prato_id) VALUES ($1, $2)',
                [pedidoId, prato_id]
            );
        }

        console.log(`✅ Pedido criado! Pedido ID: ${pedidoId}, Pessoa ID: ${pessoa_id}, Pratos: ${pratos}`);
        res.status(201).json({ message: 'Pedido criado com sucesso!', pedido_id: pedidoId });
    } catch (error) {
        console.error('❌ Erro ao criar pedido:', error);
        res.status(500).json({ error: 'Erro ao criar pedido' });
    }
});

/* ==========================
 📌 Buscar pedidos por pessoa (Cliente)
========================== */
router.get('/pedido/:pessoa_id', async (req: Request, res: Response) => {
    try {
        const { pessoa_id } = req.params;

        console.log(`📌 Buscando pedidos para a pessoa ${pessoa_id}...`);

        const result = await pool.query(`
            SELECT 
                p.id AS pedido_id,
                p.pessoa_id,
                COALESCE(pe.numero_mesa, 0) AS numero_mesa,
                COALESCE(p.status, 'Pendente') AS status,
                COALESCE(p.tempo_estimado, 0) AS tempo_estimado
            FROM pedido p
            LEFT JOIN pessoa pe ON p.pessoa_id = pe.id
            WHERE p.pessoa_id = $1
            ORDER BY p.data DESC;
        `, [pessoa_id]);

        console.log("📌 Pedidos encontrados:", result.rows);

        if (result.rows.length === 0) {
            return res.json([]); // 🔥 Retorna array vazio ao invés de erro 404
        }

        res.json(result.rows);
    } catch (error) {
        console.error("❌ Erro ao buscar pedidos:", error);
        res.status(500).json({ error: "Erro ao buscar pedidos" });
    }
});

/* ==========================
 📌 Buscar todos os pedidos da cozinha
========================== */
router.get('/cozinha/pedidos', async (_req: Request, res: Response) => {
    try {
        console.log("📌 Buscando pedidos da cozinha...");

        const result = await pool.query(`
            SELECT 
                p.id AS pedido_id,
                p.pessoa_id,
                pe.numero_mesa,
                TO_CHAR(p.data, 'YYYY-MM-DD HH24:MI:SS') AS horario,
                p.status,
                p.tempo_estimado,
                pr.id AS prato_id,
                pr.nome AS prato_nome
            FROM pedido p
            JOIN pessoa pe ON p.pessoa_id = pe.id
            JOIN pedido_prato pp ON p.id = pp.pedido_id
            JOIN pratos pr ON pp.prato_id = pr.id
            WHERE p.status != 'Finalizado'  -- 🔥 Só busca pedidos que ainda não foram finalizados
            ORDER BY pe.numero_mesa, p.data;
        `);
        
    

        console.log("📌 Pedidos encontrados:", JSON.stringify(result.rows, null, 2));

        if (result.rows.length === 0) {
            return res.json([]);
        }

        // 🔥 Correção: Criar um objeto para organizar os pedidos por mesa
        const pedidosOrganizados: Record<number, { mesa: number; pedidos: Pedido[] }> = {};

        result.rows.forEach((row) => {
            // 🔥 Se a mesa ainda não foi adicionada, cria um novo array de pedidos
            if (!pedidosOrganizados[row.numero_mesa]) {
                pedidosOrganizados[row.numero_mesa] = {
                    mesa: row.numero_mesa,
                    pedidos: [],
                };
            }

            // 🔥 Busca se já existe um pedido cadastrado para essa mesa
            let pedido = pedidosOrganizados[row.numero_mesa].pedidos.find(p => p.id === row.pedido_id);

            if (!pedido) {
                pedido = {
                    id: row.pedido_id,
                    horario: row.horario,
                    status: row.status,
                    tempo_estimado: row.tempo_estimado,
                    pratos: []
                };
                pedidosOrganizados[row.numero_mesa].pedidos.push(pedido);
            }

            // 🔥 Adiciona o prato ao pedido correto
            pedido.pratos.push({
                id: row.prato_id,
                nome: row.prato_nome,
            });
        });

        // 🔥 Retornar apenas os valores (mesas organizadas)
        res.json(Object.values(pedidosOrganizados));
    } catch (error) {
        console.error('❌ Erro ao buscar pedidos da cozinha:', error);
        res.status(500).json({ error: 'Erro ao buscar pedidos da cozinha' });
    }
});


/* ==========================
 📌 Atualizar status do pedido
========================== */
router.put('/pedido/status/:pedido_id', async (req: Request, res: Response) => {
    try {
        const { pedido_id } = req.params;
        const { status, tempo_estimado } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'O status é obrigatório' });
        }

        const updateQuery = `
            UPDATE pedido 
            SET status = $1, tempo_estimado = $2
            WHERE id = $3 RETURNING *;
        `;

        const result = await pool.query(updateQuery, [status, tempo_estimado, pedido_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }

        console.log(`✅ Pedido ${pedido_id} atualizado para: ${status}, Tempo estimado: ${tempo_estimado || 'Não informado'}`);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erro ao atualizar status do pedido:', error);
        res.status(500).json({ error: 'Erro ao atualizar status do pedido' });
    }
});

export default router;
