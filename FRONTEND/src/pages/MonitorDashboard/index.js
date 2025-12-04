import React from 'react';
// Não precisa de CSS próprio, vamos usar o do Admin

const MonitorDashboard = () => {
  return (
    <>
      <div className="admin-header-bar">
        <h2>Visão Geral</h2>
      </div>

      <div className="admin-content-inner">
        <div className="admin-card">
          <h3>Bem-vindo, Monitor!</h3>
          <p>
            Use o menu ao lado para gerenciar os horários dos jogos da sua modalidade
            e para enviar os links atualizados dos editais e chaveamentos.
          </p>
        </div>
      </div>
    </>
  );
};

export default MonitorDashboard;