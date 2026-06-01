import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Hospedes from './pages/Hospedes';
import Promocoes from './pages/Promocoes';
import Politicas from './pages/Politicas';
import Quartos from './pages/Quartos';
import Reservas from './pages/Reservas';
import Pagamentos from './pages/Pagamentos';
import Relatorios from './pages/Relatorios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Home />} />
          <Route path="hospedes" element={<Hospedes />} />
          <Route path="promocoes" element={<Promocoes />} />
          <Route path="politicas" element={<Politicas />} />
          <Route path="quartos" element={<Quartos />} />
          <Route path="reservas" element={<Reservas />} />
          <Route path="pagamentos" element={<Pagamentos />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
