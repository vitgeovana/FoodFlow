import React, { useEffect, useState } from "react";

const apiUrl = "http://localhost:3000/api/cozinha/pedidos";
const statusApiUrl = "http://localhost:3000/api/pedido/status";

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

interface Mesa {
    mesa: number;
    pedidos: Pedido[];
}

function KitchenPage() {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Erro ao buscar pedidos");

                const data = await response.json();
                console.log("📌 Pedidos recebidos na cozinha:", JSON.stringify(data, null, 2));

                // Garante que `pedidos` seja sempre um array
                const mesasFormatadas = data.map((mesa: any) => ({
                    mesa: mesa.mesa,
                    pedidos: Array.isArray(mesa.pedidos) ? mesa.pedidos : []
                }));

                setMesas(mesasFormatadas);
            } catch (error) {
                console.error("❌ Erro ao carregar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
        const interval = setInterval(fetchPedidos, 5000);
        return () => clearInterval(interval);
    }, []);

    // Atualiza o status do pedido
    const atualizarStatusPedido = async (pedidoId: number, novoStatus: string, tempoEstimado?: number) => {
        try {
            const response = await fetch(`${statusApiUrl}/${pedidoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: novoStatus, tempo_estimado: tempoEstimado }),
            });

            if (!response.ok) throw new Error("Erro ao atualizar status");

            console.log(`✅ Pedido ${pedidoId} atualizado para: ${novoStatus}`);

            // Atualiza o estado localmente
            setMesas((prevMesas) =>
                prevMesas
                    .map((mesa) => ({
                        ...mesa,
                        pedidos: mesa.pedidos
                            .map((pedido) =>
                                pedido.id === pedidoId
                                    ? { ...pedido, status: novoStatus, tempo_estimado: tempoEstimado }
                                    : pedido
                            )
                            .filter((pedido) => pedido.status !== "Finalizado")
                    }))
                    .filter((mesa) => mesa.pedidos.length > 0)
            );
        } catch (error) {
            console.error("❌ Erro ao atualizar status do pedido:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">📋 Pedidos na Cozinha</h2>

            {loading ? (
                <p className="text-gray-500">Carregando pedidos...</p>
            ) : mesas.length === 0 ? (
                <p className="text-gray-500">Nenhum pedido na cozinha.</p>
            ) : (
                mesas.map((mesa) => (
                    <div key={mesa.mesa} className="mb-6 p-4 border rounded bg-gray-100">
                        <h3 className="text-xl font-bold text-red-600">🔴 Mesa {mesa.mesa}</h3>

                        {mesa.pedidos.map((pedido) => (
                            <div key={pedido.id} className="mt-4 p-3 border rounded bg-white">
                                <h4 className="font-bold">
                                    Pedido #{pedido.id} - {new Date(pedido.horario).toLocaleTimeString()}
                                </h4>
                                <ul className="list-disc ml-5 mt-2">
                                    {pedido.pratos.map((prato) => (
                                        <li key={prato.id} className="text-gray-700">
                                            ✅ {prato.nome}
                                        </li>
                                    ))}
                                </ul>

                                {/* Exibir status e tempo estimado */}
                                <p className="mt-2 text-gray-600">
                                    Status: <b>{pedido.status}</b>
                                </p>
                                {pedido.tempo_estimado && (
                                    <p className="text-blue-500 font-bold">
                                        Tempo Estimado: {pedido.tempo_estimado} min
                                    </p>
                                )}

                                {/* Botões para atualizar status */}
                                <div className="mt-3 flex gap-2">
                                    {pedido.status === "Pendente" && (
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                                            onClick={() => {
                                                const tempo = prompt(
                                                    `Digite o tempo estimado para o pedido #${pedido.id} (em minutos):`
                                                );
                                                if (tempo) {
                                                    atualizarStatusPedido(pedido.id, "Em Preparo", parseInt(tempo, 10));
                                                }
                                            }}
                                        >
                                            Iniciar Preparo
                                        </button>
                                    )}

                                    {pedido.status === "Em Preparo" && (
                                        <button
                                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                                            onClick={() => atualizarStatusPedido(pedido.id, "Finalizado")}
                                        >
                                            Finalizar Pedido
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default KitchenPage;
