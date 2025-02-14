import { useEffect, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import {useNavigate, useParams} from 'react-router'
import GerenciamentoCliente from "./GerenciamentoCliente"

function EditarCliente() {
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

    const editar = (event) => {
        event.preventDefault()

        const form = document.getElementsByTagName('form')[0];
        if(form && form.reportValidity()){
            const dados = {
                nome: nome,
                cpf: cpf.replaceAll('-' , '').replaceAll('.', ''),
                telefone: telefone.replaceAll('(' , '').replaceAll(')', '').replaceAll('-', ''),
                endereco: endereco
            }
            if(email !== ""){
                dados.email = email
            }
            
            axios.patch(`${process.env.REACT_APP_BACKEND_URL}/clientes/editar/${params.id}`, dados
            ).then((resposta) => {
                navigate('/clientes', {state: {tipo:"sucesso", mensagem: "Cliente editado com sucesso"}})
            }).catch((erro) => {
                if(erro.response){
                    navigate('/clientes', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/clientes', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }

    const limpar = (event) => {
        event.preventDefault()
        setNome("")
        setCpf("")
        setEmail("")
        setTelefone("")
        setEndereco("")
    }

    return (
        erro ? (<div className="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoCliente botoes={[
            <Button cor="#6F917F" texto="Editar" handleClick={editar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Clientes" estados={{nome, cpf, email, telefone, endereco}} 
        setEstados={{setNome, setCpf, setEmail, setTelefone, setEndereco}}
        subtitulo="Editar Cliente" />
        )        
    )
}

export default EditarCliente