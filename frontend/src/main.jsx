import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import Header from './components/Header';
import Body from './components/Body';
import ElementoDetalle from './components/ElementoDetalle'; // Asegúrate de crear este componente

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/elemento/:id" element={<ElementoDetalle />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
