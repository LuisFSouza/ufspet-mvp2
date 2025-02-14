import Button from "./Button.js"
import { useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import GerenciamentoCliente from "./GerenciamentoCliente.js"

function NovoCliente(){
    const navigate = useNavigate()
    const [nome, setNome] = useState('')
    const [cpf, setCpf] = useState('')
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [endereco, setEndereco] = useState('')

    const cadastrar = (event) => {
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
            
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/clientes/criar`, dados
            ).then((resposta) => {
                navigate('/clientes', {state: {tipo:"sucesso", mensagem: "Cliente cadastrado com sucesso"}})
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
        <GerenciamentoCliente visualizacao={false} botoes={[
            <Button cor="#6F917F" texto="Cadastrar" handleClick={cadastrar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Clientes" estados={{nome, cpf, email, telefone, endereco}} 
        setEstados={{setNome, setCpf, setEmail, setTelefone, setEndereco}}
        subtitulo="Cadastro de Clientes" />
    )
}

export default NovoCliente