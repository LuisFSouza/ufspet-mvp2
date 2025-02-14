import { useEffect, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import GerenciamentoServico from './GerenciamentoServico'
import {useNavigate, useParams} from 'react-router'

function VisualizarServico() {
    const params = useParams()
    const navigate = useNavigate()
    const [nome, setNome] = useState('')
    const [duracao, setDuracao] = useState('')
    const [preco, setPreco] = useState('')
    const [descricao, setDescricao] = useState('')
    const [erro, setErro] = useState(null)
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/servicos/${params.id}`).then((resposta) => {
            setNome(resposta.data.nome)
            setDuracao(resposta.data.duracao)
            setPreco(resposta.data.preco)
            setDescricao(resposta.data.descricao)
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
        navigate('/servicos')
    }

    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoServico visualizacao={true} botoes={[
            <Button cor="#6F917F" texto="Voltar" tipo="button" handleClick={voltar} corTexto="#FFFFFF" largura='100%'/>,
        ]} titulo="Serviços" estados={{nome, duracao, preco, descricao}} 
        setEstados={{setNome, setDuracao, setPreco, setDescricao}}
        subtitulo="Visualizar Serviço"/>)
    )
}

export default VisualizarServico