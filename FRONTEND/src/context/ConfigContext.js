import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../api';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({
    siteName: "INTERGIL 2K25",
    logoUrl: "/images/ete-logo.png"
  });

  // TRAVA DE SEGURANÇA: Evita chamadas duplicadas
  const jaCarregou = useRef(false);

  const refreshConfig = async () => {
    // Se já carregou, NÃO carrega de novo
    if (jaCarregou.current) return;

    try {
      jaCarregou.current = true; // Marca que já foi
      const { data } = await api.get('/config');
      setConfig(data);
      if (data.siteName) document.title = data.siteName;
    } catch (error) {
      console.error("Erro config (tentando novamente em 10s...)", error);
      // Libera pra tentar de novo só daqui a 10 segundos se falhar
      setTimeout(() => { jaCarregou.current = false; }, 10000);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, refreshConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);