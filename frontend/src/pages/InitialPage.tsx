import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react'; // Ícone para compartilhamento

function InitialPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    numero_mesa: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nome: formData.nome,
      numero_mesa: Number(formData.numero_mesa),
    };

    try {
      const response = await fetch('http://localhost:3000/api/pessoa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar no banco');
      }

      const result = await response.json();
      console.log('✅ Pessoa salva:', result);

      // Salva o ID da pessoa no localStorage
      localStorage.setItem('pessoa_id', result.id);

      // Redireciona para a página do menu
      navigate('/menu');
    } catch (error) {
      console.error('❌ Erro ao enviar requisição:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  px-4 ">
      {/* ✅ Logo reposicionada mais para baixo */}
      <div className="w-full flex justify-center mt-2">
        <img src="/src/assets/img/logo.png" className="w- object-contain" alt="Food Flow Logo" />
      </div>
          
      {/* ✅ Formulário Responsivo e Melhorado */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105 ">
      

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Insira seu nome</label>
            <input
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B22222] focus:border-transparent transition-all duration-300"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Número da Mesa</label>
            <input
              type="number"
              required
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B22222] focus:border-transparent transition-all duration-300"
              value={formData.numero_mesa}
              onChange={(e) => setFormData({ ...formData, numero_mesa: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#B22222] text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-[#8B0000] transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Continuar para o Cardápio
            </button>
          </div>
        </form>

        {/* ✅ Texto ajustado com um ícone */}
        <div className="flex items-center justify-center mt-4 text-gray-600">
          <Users size={20} className="mr-2 text-[#B22222]" />
          <p>Deseja compartilhar o pedido com um amigo?</p>
        </div>
      </div>
    </div>
  );
}

export default InitialPage;
