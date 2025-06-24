import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import Header from './components/Header';
import Index from './components/Index';
import Body from './components/Body';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/elementos" element={<Body />} />
        {/* Si usas esto también para detalles individuales */}
        <Route path="/elemento/:id" element={<Body />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
