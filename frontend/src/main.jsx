import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';

import Header from './components/Header';
import Index from './components/Index';
import Body from './components/Body';
import Mezclar from './components/Mezclar';
import ElementoDetalle from './components/ElementoDetalle';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/elementos" element={<Body />} />
        <Route path="/elementos/:id" element={<ElementoDetalle />} />
        <Route path="/elemento/:id" element={<ElementoDetalle />} />
        <Route path="/mezclar" element={<Mezclar />} />
        <Route path="/documentacion" element={<Index />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);