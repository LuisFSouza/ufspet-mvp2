import { useEffect, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import {useNavigate, useParams} from 'react-router'
import GerenciamentoCliente from "./GerenciamentoCliente"

function VisualizarCliente() {
    const params = useParams()
    const navigate = useNavigate()
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState('')
    const [erro, setErro] = useState(null)
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes/${params.id}`).then((resposta) => {
            setNome(resposta.data.nome)
            setCpf(resposta.data.cpf)
            setEmail(resposta.data.email)
            setTelefone(resposta.data.telefone)
            setEndereco(resposta.data.endereco)
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
        navigate('/clientes')
    }

    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoCliente visualizacao={true} botoes={[
            <Button cor="#6F917F" texto="Voltar" tipo="button" handleClick={voltar} corTexto="#FFFFFF" largura='100%'/>,
        ]} titulo="Clientes" estados={{nome, cpf, email, telefone, endereco}} 
        setEstados={{setNome, setCpf, setEmail, setTelefone, setEndereco}}
        subtitulo="Visualizar Cliente" />
        )        
    )
}

export default VisualizarCliente