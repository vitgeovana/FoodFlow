 export interface MenuItem {
  id: string;
  nome: string;          // Alterado de "name" para "nome"
  descricao: string;     // Alterado de "description" para "descricao"
  preco: number;         // Alterado de "price" para "preco"
  categoria: 'starters' | 'main' | 'drinks' | 'desserts'; // Alterado de "category" para "categoria"
  imagem: string;        // Alterado de "image" para "imagem"
}



export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface TableInfo {
  tableNumber: number;
  mainCustomer: string;
  numberOfPeople: number;
  sharedCode?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'ENTREGUE';

export interface Order {
  id: string;
  tableInfo: TableInfo;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  estimatedTime?: number;
  createdAt: Date;
}