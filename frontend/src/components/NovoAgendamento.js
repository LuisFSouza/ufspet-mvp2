import Button from "./Button.js"
import {useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import GerenciamentoAgendamento from "./GerenciamentoAgendamento.js"

function NovoAgendamento(){
    const navigate = useNavigate()
    const [cliente, setCliente] = useState("")
    const [servico, setServico] = useState("")
    const [data, setData] = useState('')
    const [formaPgto, setFormaPgto] = useState("")
    const [status, setStatus] = useState("")

    const cadastrar = (event) => {
        event.preventDefault()

        const form = document.getElementsByTagName('form')[0];
        if(form && form.reportValidity()){
            const forma = parseInt(formaPgto)
            const stat = parseInt(status)
            const dados = {
                cliente_id: parseInt(cliente),
                servico_id: parseInt(servico),
                formaPgto: forma === 1 ? 'CREDITO': forma === 2 ? 'DEBITO' : forma === 3 ? 'DINHEIRO' : forma === 4 ? 'PIX' : 'None',
                status: stat === 1 ? 'PENDENTE' : stat === 2 ? 'CANCELADO' : stat === 3 ? 'CONCLUIDO' : 'None'
            }
            if(data !== ""){
                dados.data = new Date(data).toISOString();
            }

            axios.post(`${process.env.REACT_APP_BACKEND_URL}/agendamentos/criar`, dados
            ).then((resposta) => {
                navigate('/agendamentos', {state: {tipo:"sucesso", mensagem: "Venda cadastrada com sucesso"}})
            }).catch((erro) => {
                if(erro.response){
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/agendamentos', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }


    /*Precisa arrumar*/ 
    const limpar = (event) => {
        event.preventDefault()
        setCliente("")
        setData("")
        setServico("")
        setFormaPgto("")
        setStatus("")
    }

    return (
        <GerenciamentoAgendamento mode={1} visualizacao={false} botoes={[
            <Button cor="#6F917F" texto="Cadastrar" handleClick={cadastrar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Agendamentos" estados={{cliente, servico, data, formaPgto, status}} 
        setEstados={{setCliente, setServico, setData, setFormaPgto, setStatus}}
        subtitulo="Novo Agendamento" />
    )
}

export default NovoAgendamento