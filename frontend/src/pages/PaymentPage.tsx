import React, { useState, useEffect } from "react";
import { CreditCard, User, ArrowLeft } from "lucide-react"; // Ícones
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  // 🔹 Estado para armazenar o método de pagamento selecionado
  const [paymentMethod, setPaymentMethod] = useState<"app" | "waiter" | null>(null);

  // 🔹 Estado para armazenar o valor total do pedido
  const [totalAmount, setTotalAmount] = useState<number>(0); // 🔥 Definimos um valor padrão de `0`

  // 🔹 Hook de navegação para redirecionamento
  const navigate = useNavigate();

  // 🔹 Recupera o valor total do pedido do `localStorage`
  useEffect(() => {
    const totalSalvo = localStorage.getItem("total_pedido");

    if (totalSalvo) {
      try {
        const total = JSON.parse(totalSalvo);
        setTotalAmount(total ?? 0); // 🔥 Garante que `null` vira `0`
      } catch (error) {
        console.error("❌ Erro ao carregar total do pedido:", error);
        setTotalAmount(0);
      }
    }
  }, []);

  // 🔹 Função para processar pagamento
  const handlePayment = () => {
    if (paymentMethod === "app") {
      navigate("/payment-confirmation"); // Redireciona para confirmação de pagamento
    } else if (paymentMethod === "waiter") {
      navigate("/waiter-confirmation"); // Redireciona para tela de garçom
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 bg-gray-100 flex flex-col items-center justify-center">
      
      {/* 🔙 Ícone de voltar para o menu */}
      <ArrowLeft 
        size={28} 
        className="absolute top-4 left-4 text-red-600 cursor-pointer hover:text-red-700 transition-all"
        onClick={() => navigate("/menu")}
      />

      {/* ✅ Logo no topo */}
      <div className="w-full flex justify-center mb-6">
        <img src="/src/assets/img/logo.png" alt="Food Flow Logo" className="w-28" />
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 w-full">
        <h2 className="text-2xl font-bold text-[#B22222] mb-6 text-center">Pagamento</h2>

        {/* 🔹 Exibição do valor total correto */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total a Pagar</span>
            <span className="text-[#B22222] text-xl">
              {`R$ ${(totalAmount ?? 0).toFixed(2)}`}
            </span>
          </div>

          {/* 🔹 Se total for 0, avisa o usuário */}
          {totalAmount === 0 && (
            <p className="text-center text-gray-500">Nenhum pedido encontrado.</p>
          )}

          {/* 🔹 Escolha do método de pagamento */}
          <div className="border-t pt-4">
            <p className="font-medium mb-4">Escolha como deseja pagar:</p>

            <div className="space-y-4">
              {/* 🔹 Pagamento pelo App */}
              <button
                onClick={() => setPaymentMethod("app")}
                className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${
                  paymentMethod === "app"
                    ? "border-[#B22222] bg-red-50 shadow-md"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <CreditCard className="h-6 w-6 text-[#B22222]" />
                <div className="text-left">
                  <p className="font-medium">Pagar pelo App</p>
                  <p className="text-sm text-gray-500">PIX ou Cartão Virtual</p>
                </div>
              </button>

              {/* 🔹 Chamar Garçom */}
              <button
                onClick={() => setPaymentMethod("waiter")}
                className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all duration-300 ${
                  paymentMethod === "waiter"
                    ? "border-[#B22222] bg-red-50 shadow-md"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                <User className="h-6 w-6 text-[#B22222]" />
                <div className="text-left">
                  <p className="font-medium">Chamar Garçom</p>
                  <p className="text-sm text-gray-500">Dinheiro ou Cartão Físico</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Botão para confirmar pagamento */}
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || totalAmount === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            paymentMethod && totalAmount > 0
              ? "bg-[#B22222] text-white hover:bg-[#8B0000] shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {paymentMethod === "app"
            ? "Continuar para Pagamento"
            : paymentMethod === "waiter"
            ? "Chamar Garçom"
            : "Selecione um método de pagamento"}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
