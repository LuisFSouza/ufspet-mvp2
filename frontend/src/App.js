import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router'
import NavBar from "./components/NavBar"
import Produtos from './components/Produtos.js';
import NovoProduto from './components/NovoProduto.js';
import VisualizarProduto from './components/VisualizarProduto.js';
import Servicos from './components/Servicos.js'
import VisualizarServico from './components/VisualizarServico.js';
import NovoServico from './components/NovoServico.js';
import Clientes from './components/Clientes.js'
import VisualizarCliente from './components/VisualizarCliente.js';
import NovoCliente from './components/NovoCliente.js';
import Vendas from './components/Vendas.js';
import NovaVenda from './components/NovaVenda.js';
import VisualizarVenda from './components/VisualizarVenda.js';
import Agendamentos from './components/Agendamentos.js';
import VisualizarAgendamento from './components/VisualizarAgendamento.js';
import NovoAgendamento from './components/NovoAgendamento.js';
import EditarCliente from './components/EditarCliente.js';
import EditarProduto from './components/EditarProduto.js';
import EditarServico from './components/EditarServico.js';
import EditarVenda from './components/EditarVenda.js';
import EditarAgendamento from './components/EditarAgendamento.js';
import Relatorio from './components/Relatorio.js';
import Estoque from './components/Estoque.js';
import Compras from './components/Compras.js';
import VisualizarCompraVenda from './components/VisualizarCompraVenda.js';
import VisualizarCompraAgendamento from './components/VisualizarCompraAgendamento.js';



function App() {
  return(
    <Router>
      <NavBar/>
      
      <Routes>
        <Route path='/clientes' element={<Clientes/>}></Route>
        <Route path='/clientes/novo' element={<NovoCliente />}></Route>
        <Route path='/clientes/:id' element={<VisualizarCliente />}></Route>
        <Route path='/produtos' element={<Produtos />}></Route>
        <Route path='/produtos/novo' element={<NovoProduto/>}></Route>
        <Route path='/produtos/:id' element={<VisualizarProduto/>}></Route>
        <Route path='/servicos' element={<Servicos />}></Route>
        <Route path='/servicos/novo' element={<NovoServico/>}></Route>
        <Route path='/servicos/:id' element={<VisualizarServico/>}></Route>
        <Route path='/vendas' element={<Vendas />}></Route>
        <Route path='/vendas/nova' element={<NovaVenda />}></Route>
        <Route path='/vendas/:id' element={<VisualizarVenda />}></Route>
        <Route path='/agendamentos' element={<Agendamentos />}></Route>
        <Route path='/agendamentos/novo' element={<NovoAgendamento />}></Route>
        <Route path='/agendamentos/:id' element={<VisualizarAgendamento />}></Route>
        <Route path='/clientes/editar/:id' element={<EditarCliente />}></Route>
        <Route path='/produtos/editar/:id' element={<EditarProduto />}></Route>
        <Route path='/servicos/editar/:id' element={<EditarServico />}></Route>
        <Route path='/vendas/editar/:id' element={<EditarVenda />}></Route>
        <Route path='/agendamentos/editar/:id' element={<EditarAgendamento />}></Route>
        <Route path='/' element={<Relatorio />}></Route>
        <Route path='/Estoque' element={<Estoque />}></Route>
        <Route path='/clientes/:id/compras' element={<Compras />}></Route>
        <Route path='clientes/:idcliente/compras/:id/venda' element={<VisualizarCompraVenda />}></Route>
        <Route path='clientes/:idcliente/compras/:id/agendamento' element={<VisualizarCompraAgendamento />}></Route>
      </Routes>
    </Router>
  )
}

export default App;
