import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { AudioProvider } from './context/AudioContext';
// Importe o novo Provider
import { ConfigProvider } from './context/ConfigContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AudioProvider>
        <AuthProvider>
           {/* O ConfigProvider envolve o App */}
           <ConfigProvider>
              <App />
           </ConfigProvider>
        </AuthProvider>
      </AudioProvider>
    </BrowserRouter>
  </React.StrictMode>
);