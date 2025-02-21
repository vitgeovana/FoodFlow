import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"; // Ícones para status e voltar

const apiUrl = "http://localhost:3000/api/pedido";

function OrderStatusPage() {
    // Estado para armazenar os pedidos do usuário
    const [pedidos, setPedidos] = useState<any[]>([]);
    
    // Estado para armazenar erros
    const [error, setError] = useState<string | null>(null);
    
    // Estado para armazenar o ID da pessoa logada
    const [pessoaId, setPessoaId] = useState<number | null>(null);
    
    // Hook de navegação para redirecionamento de páginas
    const navigate = useNavigate();

    // 🔹 Obtém o `pessoa_id` armazenado no `localStorage`
    useEffect(() => {
        const storedPessoaId = localStorage.getItem("pessoa_id");

        // Se existir um ID, converte para número e salva no estado
        if (storedPessoaId) {
            setPessoaId(parseInt(storedPessoaId, 10));
        } else {
            setError("Nenhuma pessoa identificada!");
        }
    }, []);

    // 🔹 Busca os pedidos do usuário logado
    useEffect(() => {
        if (!pessoaId) return;

        const fetchPedidos = () => {
            fetch(`${apiUrl}/${pessoaId}`)
                .then((res) => res.json())
                .then((data) => {
                    // Atualiza o estado dos pedidos
                    setPedidos(Array.isArray(data) ? data : []);
                    setError(null);
                })
                .catch((error) => {
                    // Em caso de erro, atualiza o estado de erro e limpa os pedidos
                    setError(error.message);
                    setPedidos([]);
                });
        };

        // Chama a função de busca inicial
        fetchPedidos();

        // Define um intervalo para atualizar os pedidos a cada 5 segundos
        const interval = setInterval(fetchPedidos, 5000);

        // Limpa o intervalo quando o componente for desmontado
        return () => clearInterval(interval);
    }, [pessoaId]);

    // 🔹 Redireciona para a página de pagamento e remove o pedido da tela
    const handlePagamento = (pedidoId: number) => {
        // Encontra o pedido selecionado
        const pedidoSelecionado = pedidos.find((p) => p.pedido_id === pedidoId);
        
        // Salva o pedido no `localStorage` para a tela de pagamento
        if (pedidoSelecionado) {
            localStorage.setItem("pedido_para_pagamento", JSON.stringify(pedidoSelecionado));
        }

        // Remove o pedido finalizado da tela
        setPedidos((prevPedidos) => prevPedidos.filter((p) => p.pedido_id !== pedidoId));

        // Redireciona para a página de pagamento
        navigate("/payment");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
            
            {/* 🔙 Ícone de voltar para o menu */}
            <ArrowLeft 
                size={28} 
                className="absolute top-4 left-4 text-red-600 cursor-pointer hover:text-red-700 transition-all"
                onClick={() => navigate("/menu")}
            />
             <div className="w-full flex justify-center mt-12 mb-6">
                <img src="/src/assets/img/logo.png" className="w-40 object-contain"  />
            </div>
            {/* 🔹 Título da página */}
            <h2 className="text-2xl font-bold text-center mb-6 text-red-700">
                📋 Status do Pedido
            </h2>

            {/* 🔹 Exibe mensagens de erro ou pedidos */}
            {error ? (
                <p className="text-red-500 text-center font-semibold">{error}</p>
            ) : pedidos.length === 0 ? (
                <p className="text-gray-500 text-center">Nenhum pedido encontrado.</p>
            ) : (
                <div className="space-y-4">
                    {pedidos.map((pedido) => (
                        <div 
                            key={pedido.pedido_id} 
                            className="p-4 border rounded-lg bg-white shadow-lg transition-all transform hover:scale-105"
                        >
                            {/* 🔹 Título do pedido */}
                            <h4 className="font-bold text-lg flex items-center gap-2">
                                Pedido #{pedido.pedido_id} - Mesa {pedido.numero_mesa}
                            </h4>

                            {/* 🔹 Exibição do status do pedido */}
                            <div className="flex items-center gap-2 mt-2">
                                {pedido.status === "Em Preparo" ? (
                                    <Clock size={20} className="text-yellow-500" />
                                ) : pedido.status === "Finalizado" ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                ) : (
                                    <XCircle size={20} className="text-red-500" />
                                )}
                                <p className="font-semibold">{pedido.status}</p>
                            </div>

                            {/* 🔹 Exibição do tempo estimado se o pedido estiver em preparo */}
                            {pedido.status === "Em Preparo" && pedido.tempo_estimado && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Tempo Estimado: <b>{pedido.tempo_estimado} min</b>
                                </p>
                            )}

                            {/* 🔹 Botão para pagamento se o pedido estiver finalizado */}
                            {pedido.status === "Finalizado" && (
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded mt-3 hover:bg-green-600 transition-all"
                                    onClick={() => handlePagamento(pedido.pedido_id)}
                                >
                                    Ir para Pagamento
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderStatusPage;
