import React, { useState } from 'react';
import { User, Bell, CheckCircle, DollarSign } from 'lucide-react';
import type { Order } from '../types';

// 🔥 Dados Mockados para Teste
const MOCK_ORDERS: Order[] = [
  {
    id: '2',
    tableInfo: {
      tableNumber: 3,
      mainCustomer: 'Maria Santos',
      numberOfPeople: 4
    },
    items: [
      {
        id: '4',
        nome: 'Lasanha à Bolonhesa',
        descricao: 'Lasanha tradicional com molho bolonhesa e queijo gratinado',
        preco: 42.00,
        categoria: 'main',
        imagem: '',
        quantity: 2
      }
    ],
    status: 'ready',
    totalAmount: 84.00,
    estimatedTime: 0,
    createdAt: new Date()
  }
];

function WaiterPage() {
  // 🔥 Estados do Componente
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [paymentRequests, setPaymentRequests] = useState<Order[]>([]);

  // ✅ Marcar pedido como entregue
  const markAsDelivered = (orderId: string) => {
    setOrders((prev: Order[]) =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'delivered' } : order
      )
    );
  };

  // ✅ Componente do Cartão de Pedido
  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 w-full md:max-w-md">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-lg font-bold">Mesa {order.tableInfo.tableNumber}</span>
          <span className="ml-4 text-gray-500">{order.tableInfo.mainCustomer}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.quantity}x {item.nome}</span> {/* 🔥 Corrigido de `item.name` para `item.nome` */}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="font-bold">Total: R$ {order.totalAmount.toFixed(2)}</span>
        <button
          onClick={() => markAsDelivered(order.id)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Confirmar Entrega
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* ✅ Cabeçalho */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <User className="h-8 w-8 text-[#B22222]" />
          <h1 className="text-2xl font-bold">Painel do Garçom</h1>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {/* 🔥 Pedidos Prontos */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#B22222]" />
              Pedidos para Entrega ({orders.filter(o => o.status === 'ready').length})
            </h2>
            {orders.filter(order => order.status === 'ready').length === 0 ? (
              <p className="text-gray-500">Nenhum pedido pronto.</p>
            ) : (
              orders
                .filter(order => order.status === 'ready')
                .map(order => <OrderCard key={order.id} order={order} />)
            )}
          </div>

          {/* 💰 Solicitações de Pagamento */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#B22222]" />
              Solicitações de Pagamento ({paymentRequests.length})
            </h2>
            {paymentRequests.length === 0 ? (
              <p className="text-gray-500">Nenhuma solicitação de pagamento.</p>
            ) : (
              paymentRequests.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4 w-full md:max-w-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">Mesa {order.tableInfo.tableNumber}</span>
                    <span className="font-bold">R$ {order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-500 mb-4">
                    Cliente: {order.tableInfo.mainCustomer}
                  </div>
                  <button className="w-full bg-[#B22222] text-white py-2 rounded hover:bg-[#8B0000]">
                    Processar Pagamento
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterPage;
