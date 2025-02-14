import TextField from "./TextField.js"
import Acao from "./Acao.js"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import ItensVenda from "./ItensVenda"

function GerenciamentoVendas({ref, titulo, subtitulo, botoes, estados, setEstados, visualizacao, mode}){
    const navigate = useNavigate()
    const {cliente, data, formaPgto, itensVenda} = estados
    const {setCliente, setData, setFormaPgto, setItensVenda} = setEstados
    const [dadosClientes, setDadosClientes] = useState([])

    useEffect(()=>{
        if(mode !== 2){
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes`).then((resposta) => {
                setDadosClientes((resposta.data).map(({cod,nome})=> ({cod:cod, nome:nome})))
            }).catch((erro) => {
                if(erro.response){
                    navigate('/vendas', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/vendas', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }, [])

    return (
        <Acao titulo={titulo}  subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField  visualizacao={visualizacao} setValue={setCliente} value={cliente} placeholder="Selecione o cliente da venda" titulo="Cliente da venda"  tipo={visualizacao ? "input" : "select"} id="cliente" dadosSelect={dadosClientes}/>, buttonSupport: false},
            {component: <TextField  required={false} visualizacao={visualizacao} setValue={setData} value={data} placeholder="Digite a data da venda" titulo="Data da venda" tipo="datetime-local" id="dtvenda"/>, buttonSupport: false},
            {component: <TextField  visualizacao={visualizacao} setValue={setFormaPgto} value={formaPgto} placeholder="Selecione a forma de pagamento" titulo="Forma de pagamento" tipo={visualizacao ? "input" : "select"} id="formapgto" dadosSelect={[{cod: 1, forma:'Cartão de crédito'}, {cod: 2, forma:'Cartão de débito'}, {cod: 3, forma:'Dinheiro'}, {cod: 4, forma:'PIX'}]}/>, buttonSupport: false},
            {component: <ItensVenda  mode={mode} ref={ref} setValues={setItensVenda} values={itensVenda}/>, buttonSupport: true}
        ]} />
    )
}

export default GerenciamentoVendas