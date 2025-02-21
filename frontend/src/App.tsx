import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Utensils, User, ChefHat, Coffee } from 'lucide-react';
import InitialPage from './pages/InitialPage';
import MenuPage from './pages/MenuPage';
import OrderStatusPage from './pages/OrderStatusPage';
import PaymentPage from './pages/PaymentPage';
import KitchenPage from './pages/KitchenPage';
import WaiterPage from './pages/WaiterPage';
import { OrderProvider } from './context/OrderContext';

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
        isActive
          ? 'bg-white text-[#B22222]'
          : 'text-white hover:bg-white/10'
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-[#B22222] p-4 shadow-lg">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Utensils className="h-8 w-8 text-white" />
                  <h1 className="text-2xl font-bold text-white">
                    Food<span className="text-[#FFD700]">Flow</span>
                  </h1>
                </div>
              </div>
              
              <nav className="flex gap-4">
                <NavLink to="/">
                  <Coffee className="h-5 w-5" />
                  Cliente
                </NavLink>
                <NavLink to="/kitchen">
                  <ChefHat className="h-5 w-5" />
                  Cozinha
                </NavLink>
                <NavLink to="/waiter">
                  <User className="h-5 w-5" />
                  Garçom
                </NavLink>
              </nav>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<InitialPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/status" element={<OrderStatusPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/kitchen" element={<KitchenPage />} />
              <Route path="/waiter" element={<WaiterPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App