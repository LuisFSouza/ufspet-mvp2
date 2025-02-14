import TextField from "./TextField.js"
import Acao from "./Acao.js"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"

function GerenciamentoAgendamento({titulo, subtitulo, botoes, estados, setEstados, visualizacao, mode}){
    const navigate = useNavigate()
    const {cliente, servico, data, formaPgto, status} = estados
    const {setCliente, setServico, setData, setFormaPgto, setStatus} = setEstados
    const [dadosClientes, setDadosClientes] = useState([])
    const [dadosServicos, setDadosServicos] = useState([])

    useEffect(() => {
        if(mode !== 2){
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes`).then((resposta) => {
                setDadosClientes((resposta.data).map(({cod,nome})=> ({cod:cod, nome:nome})))
                
            }).catch((erro) => {
                if(erro.response){
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }, []) 

    useEffect(() => {
        if(mode !== 2){
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/servicos`).then((resposta) => {
                setDadosServicos((resposta.data).map(({cod, nome})=> ({cod, nome})))
            }).catch((erro) => {
                if(erro.response){
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }, []) 

    return (
        <Acao titulo={titulo} subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField visualizacao={visualizacao} setValue={setCliente} value={cliente} placeholder="Selecione o cliente do agendamento" titulo="Cliente do agendamento" tipo={visualizacao ? "input" : "select"} id="cliente" dadosSelect={dadosClientes}/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setServico} value={servico} placeholder="Selecione o serviço do agendamento" titulo="Serviço do agendamento"  tipo={visualizacao ? "input" : "select"} id="servico"  dadosSelect={dadosServicos}/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setData} value={data} setV placeholder="Digite a data do agendamento" titulo="Data do agendamento" tipo="datetime-local" id="data" required={false}/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setFormaPgto} value={formaPgto} placeholder="Selecione a forma de pagamento" titulo="Forma de pagamento"  tipo={visualizacao ? "input" : "select"} id="formaPgto" dadosSelect={[{cod: 1, forma:'Cartão de crédito'}, {cod: 2, forma:'Cartão de débito'}, {cod: 3, forma:'Dinheiro'}, {cod: 4, forma:'PIX'}]}/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setStatus} value={status} placeholder="Selecione o status do agendamento" titulo="Status do agendamento"  tipo={visualizacao ? "input" : "select"} id="status" dadosSelect={[{"cod": 1, 'status':'Pendente'}, {"cod": 2, 'status':'Cancelado'}, {"cod": 3, 'status':'Concluído'}]}/>, buttonSupport: false}
        ]} />
    )
}

export default GerenciamentoAgendamento