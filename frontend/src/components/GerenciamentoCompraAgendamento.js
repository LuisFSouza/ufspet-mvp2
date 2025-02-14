import TextField from "./TextField.js"
import Acao from "./Acao.js"

function GerenciamentoCompraAgendamento({titulo, subtitulo, botoes, estados}){
    const {cliente, servico, data, formaPgto, status, total} = estados


    return (
        <Acao titulo={titulo} subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField visualizacao={true} value={cliente} placeholder="Cliente da compra" titulo="Cliente da compra" tipo="input" id="cliente" />, buttonSupport: false},
            {component: <TextField visualizacao={true} value={servico} placeholder="Serviço da compra" titulo="Serviço da compra"  tipo="input" id="servico"  />, buttonSupport: false},
            {component: <TextField visualizacao={true} value={data} setV placeholder="Data da compra" titulo="Data da compra" tipo="datetime-local" id="data"/>, buttonSupport: false},
            {component: <TextField visualizacao={true} value={formaPgto} placeholder="Forma de pagamento" titulo="Forma de pagamento"  tipo="input" id="formaPgto" />, buttonSupport: false},
            {component: <TextField visualizacao={true} value={status} placeholder="Status do agendamento" titulo="Status do agendamento"  tipo="input" id="status"/>, buttonSupport: false},
            {component: <TextField visualizacao={true} value={total} placeholder="Total da compra" titulo="Total da compra"  tipo="input" id="status"/>, buttonSupport: false}
        ]} />
    )
}

export default GerenciamentoCompraAgendamento