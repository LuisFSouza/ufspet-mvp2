import { useEffect, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import {useNavigate, useParams} from 'react-router'
import GerenciamentoAgendamento from "./GerenciamentoAgendamento"
import dayjs from 'dayjs'

function EditarAgendamento() {
    const params = useParams()
    const navigate = useNavigate()
    const [cliente, setCliente] = useState("")
    const [servico, setServico] = useState("")
    const [data, setData] = useState('')
    const [formaPgto, setFormaPgto] = useState("")
    const [status, setStatus] = useState("")
    const [erro, setErro] = useState(null)
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/agendamentos/${params.id}`).then((resposta) => {
            setCliente(resposta.data.cliente_id)
            setServico(resposta.data.servico_id)
            const dataFormatada = dayjs(resposta.data.data).format("YYYY-MM-DDTHH:mm")
            setData(dataFormatada)
            const forma = resposta.data.formaPgto
            setFormaPgto(forma === 'CREDITO' ? 1 : forma === 'DEBITO'  ? 2 : forma === 'DINHEIRO'  ? 3 : forma === 'PIX'  ? 4 : "")
            const stat = resposta.data.status
            setStatus(stat === 'PENDENTE' ? 1  : stat === 'CANCELADO'  ? 2 : stat === 'CONCLUIDO'  ? 3 : "")
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
            
            axios.patch(`${process.env.REACT_APP_BACKEND_URL}/agendamentos/editar/${params.id}`, dados
            ).then((resposta) => {
                navigate('/agendamentos', {state: {tipo:"sucesso", mensagem: "Agendamento editado com sucesso"}})
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

    const limpar = (event) => {
        event.preventDefault()
        setCliente("")
        setServico("")
        setData("")
        setFormaPgto("")
        setStatus("")
    }

    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoAgendamento mode={3} botoes={[
            <Button cor="#6F917F" texto="Editar" handleClick={editar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Agendamentos" estados={{cliente, servico, data, formaPgto, status}} 
        setEstados={{setCliente, setServico, setData, setFormaPgto, setStatus}}
        subtitulo="Editar Agendamento" />
        )        
    )
}

export default EditarAgendamento