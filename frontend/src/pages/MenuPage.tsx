import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const apiUrl = 'http://localhost:3000/api/pratos';

interface Prato {
    id: number;
    nome: string;
    preco: number;
    imagem?: string;
}

const imagensPratos: { [key: string]: string } = {
    "Bolinho de Bacalhau": "/src/assets/img/bolhinho.jpeg",
    "Carpaccio de Salmão": "/src/assets/img/capaccio.jpeg",
    "Salada Caprese": "/src/assets/img/salada.jpeg",
    "Tábua de Frios": "/src/assets/img/tabua.jpeg",
    "Filé de Frango Grelhado": "/src/assets/img/frango_grelhado.jpeg",
    "Lasanha de Carne": "/src/assets/img/lasanha_carne.jpeg",
    "Macarronada ao Molho 4 Queijos": "/src/assets/img/macarrao.jpeg",
    "Parmegiana de Frango": "/src/assets/img/parmegiana_frango.jpeg",
    "Sucos de Maracujá": "/src/assets/img/maracuja.jpeg",
    "Sucos de Cupuaçu": "/src/assets/img/cupu.jpeg",
    "Sucos de Abacaxi com Hortelã": "/src/assets/img/abaca.jpeg",
    "Caipirinha": "/src/assets/img/caipirinha.jpeg",
    "Refrigerante": "/src/assets/img/refri.jpeg",
    "Limonada Suíça": "/src/assets/img/limonada.jpeg",
    "Cheesecake": "/src/assets/img/cheese.jpeg",
    "Tiramisu": "/src/assets/img/tiramisu.jpeg",
    "Petit Gateau": "/src/assets/img/petit.jpeg",
    "Torta de Limão": "/src/assets/img/torta.jpeg"
};

function MenuPage() {
    const [pratos, setPratos] = useState<Prato[]>([]);
    const [pratosSelecionados, setPratosSelecionados] = useState<number[]>([]);
    const [pessoaId, setPessoaId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedPessoaId = localStorage.getItem("pessoa_id");
        if (storedPessoaId) {
            setPessoaId(parseInt(storedPessoaId, 10));
        } else {
            alert("Erro: Nenhuma pessoa identificada!");
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                console.log("📌 Dados recebidos da API:", data);
                const pratosCorrigidos = data.map((prato: any) => ({
                    ...prato,
                    preco: Number(prato.preco) || 0,
                    imagem: imagensPratos[prato.nome]
                        ? new URL(imagensPratos[prato.nome], import.meta.url).href
                        : new URL("/img/default.jpg", import.meta.url).href
                }));
                setPratos(pratosCorrigidos);
            })
            .catch((error) => console.error('❌ Erro ao carregar pratos:', error));
    }, []);

    const togglePrato = (pratoId: number) => {
        setPratosSelecionados((prev) =>
            prev.includes(pratoId) ? prev.filter((id) => id !== pratoId) : [...prev, pratoId]
        );
    };

    const totalPedido = pratosSelecionados.reduce((total, pratoId) => {
        const prato = pratos.find((p) => p.id === pratoId);
        return total + (prato ? prato.preco : 0);
    }, 0);

    const fazerPedido = async () => {
        if (!pessoaId) {
            alert("Erro: Nenhuma pessoa identificada!");
            return;
        }

        if (pratosSelecionados.length === 0) {
            alert("Escolha pelo menos um prato!");
            return;
        }

        // 🔥 SALVA APENAS O VALOR TOTAL NO LOCALSTORAGE PARA A PÁGINA DE PAGAMENTO
        localStorage.setItem("total_pedido", JSON.stringify(totalPedido));

        const pedidoData = {
            pessoa_id: pessoaId,
            pratos: pratosSelecionados
        };

        try {
            const response = await fetch('http://localhost:3000/api/pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoData)
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer o pedido');
            }

            const result = await response.json();
            console.log('✅ Pedido criado:', result);

            alert("Pedido realizado com sucesso! 🎉");
            setPratosSelecionados([]);

            navigate('/status');
        } catch (error) {
            console.error('❌ Erro ao enviar pedido:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md relative">

           
            <ArrowLeft 
                size={28} 
                className="absolute top-4 left-4 text-red-600 cursor-pointer hover:text-red-700 transition-all duration-300"
                onClick={() => navigate(-1)}
            />

            
            <div className="w-full flex justify-center mt-12 mb-6">
                <img src="/src/assets/img/logo.png" className="w-40 object-contain"  />
            </div>

            <h2 className="text-2xl font-bold text-center mb-4 text-red-700">🍽️ Selecione seus pratos!</h2>

            {/* 🔥 Seções separadas */}
            <div className="space-y-6">
                {[ 
                    { title: " Entradas", items: pratos.slice(0, 4) },
                    { title: " Pratos", items: pratos.slice(4, 8) },
                    { title: " Bebidas", items: pratos.slice(8, 14) },
                    { title: " Sobremesas", items: pratos.slice(14) }
                ].map((section) => (
                    <div key={section.title}>
                        <h3 className="text-lg font-extrabold text-white bg-red-600 px-4 py-2 rounded-md text-center">{section.title}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            {section.items.map((prato) => (
                                <div 
                                    key={prato.id} 
                                    className={`border rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform transform hover:scale-105 
                                        ${pratosSelecionados.includes(prato.id) ? 'border-green-500' : ''}`}
                                    onClick={() => togglePrato(prato.id)}
                                >
                                    <img src={prato.imagem} alt={prato.nome} className="w-full h-32 object-cover"/>
                                    <div className="p-3 text-center">
                                        <p className="text-sm font-bold">{prato.nome}</p>
                                        <p className="text-red-600 font-semibold">R$ {prato.preco.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 Resumo do pedido */}
            <div className="mt-6 p-4 bg-gray-200 rounded-lg text-center">
                <p className="text-lg font-semibold">Total: <span className="text-green-600 text-xl font-bold">R$ {totalPedido.toFixed(2)}</span></p>
            </div>

            {/* 🔥 Botões de ação */}
            <div className="mt-6 flex justify-between gap-4">
                <button className="w-1/2 bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all">Nenhum</button>
                <button 
                    className="w-1/2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                    onClick={fazerPedido}
                    disabled={pratosSelecionados.length === 0}
                >
                    Próximo
                </button>
            </div>
        </div>
    );
}

export default MenuPage;
