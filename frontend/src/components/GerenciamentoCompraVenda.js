import TextField from "./TextField.js"
import Acao from "./Acao.js"
import ItensVenda from "./ItensVenda.js"

function GerenciamentoCompraVenda({titulo, subtitulo, botoes, estados}){
    const {cliente, data, formaPgto, itensVenda, totalVenda} = estados


    return (
        <Acao titulo={titulo}  subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField  visualizacao={true}  value={cliente} placeholder="Cliente da compra" titulo="Cliente da compra"  tipo="input" id="cliente"/>, buttonSupport: false},
            {component: <TextField  visualizacao={true}  value={data} placeholder="Data da compra" titulo="Data da compra" tipo="datetime-local" id="dtvenda"/>, buttonSupport: false},
            {component: <TextField  visualizacao={true}  value={formaPgto} placeholder="Forma de pagamento" titulo="Forma de pagamento" tipo="input" id="formapgto"/>, buttonSupport: false},
            {component: <ItensVenda title="Itens da compra"  mode={2}  values={itensVenda}/>, buttonSupport: true},
            {component: <TextField  visualizacao={true}  value={totalVenda} placeholder="Total da compra" titulo="Total da compra" tipo="input" id="total" />, buttonSupport: false},
        ]} />
    )
}

export default GerenciamentoCompraVenda