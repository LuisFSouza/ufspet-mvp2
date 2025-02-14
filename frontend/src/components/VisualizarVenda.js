import { useEffect, useRef, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import {useNavigate, useParams} from 'react-router'
import GerenciamentoVendas from "./GerenciamentoVendas"
import dayjs from 'dayjs'

function VisualizarVenda() {
    const params = useParams()
    const navigate = useNavigate()
    const [cliente, setCliente] = useState(null)
    const [data, setData] = useState(null)
    const [formaPgto, setFormaPgto] = useState(null)
    const [itensVenda, setItensVenda] = useState([])
    const [erro, setErro] = useState(null)
    const refItens = useRef()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendas/${params.id}`).then((resposta) => {
            setCliente(`${resposta.data.cliente.cod} - ${resposta.data.cliente.nome}`)
            const dataFormatada = dayjs(resposta.data.data).format("YYYY-MM-DDTHH:mm")
            setData(dataFormatada)
            setFormaPgto(resposta.data.formaPgto)
            setItensVenda((resposta.data.itens).map(({produto,quantidade})=> ({produto_id:`${produto.cod} - ${produto.nome}`, quantidade})) )
        }).catch((erro) => {
            if(erro.response){
                setErro(erro.response.data.message)
            }
            else{
                setErro("Não foi possivel se conectar com o servidor")
            }
         })
    }, [params.id])


    const voltar = () => {
        navigate('/vendas')
    }


    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
             <GerenciamentoVendas mode={2} ref={refItens} visualizacao={true} botoes={[
                <Button cor="#6F917F" texto="Voltar" tipo="button" handleClick={voltar} corTexto="#FFFFFF" largura='100%'/>
            ]} titulo="Vendas" estados={{cliente, data, formaPgto, itensVenda}} 
            setEstados={{setCliente, setData, setFormaPgto, setItensVenda}}
            subtitulo="Visualizar Vendas" />)
    )
}

export default VisualizarVenda