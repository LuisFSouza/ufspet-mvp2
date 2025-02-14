import { useEffect, useState } from "react"
import Table from "./Table.js"
import axios from "axios"
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import Button from "./Button";
import {useLocation, useNavigate} from 'react-router'
import './Produtos.css'
import Cabecalho from "./Cabecalho.js";
import AvisoExclusao from "./AvisoExclusao.js";


function Agendamentos() {
    const [schedulingSelected, setSchedulingSelected] = useState(-1)
    const [message, setMessage] = useState(null)

    const changeSchedulingSelected = (id) => {
        setSchedulingSelected(id)
    }
    const [dadosAgendamentos, setDadosAgendamentos] = useState([])
    const navigate = useNavigate()
    const buttonNovoClick = () => {
        navigate('/agendamentos/novo')
    }

    const buttonVisualizarClick = () => {
        if(schedulingSelected !== -1){
            navigate(`/agendamentos/${schedulingSelected}`)
        }
    }
    
    const [mostrarDelete, setMostrarDelete] = useState(false)
    const excluirAgendamento = () => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/agendamentos/deletar/${schedulingSelected}`).then((response) => {
            setMostrarDelete(false)
            setSchedulingSelected(-1)
            setDadosAgendamentos(dadosAgendamentos.filter((dado) => dado.cod !== schedulingSelected))
            setMessage({'tipo': 'sucesso', 'mensagem': `Agendamento ${response.data.cod} excluido com sucesso`})
            
            const timer = setTimeout(() => {
                setMessage(null)
            }, 10000);
    
            return () => clearTimeout(timer)
        }).catch((erro) => {
            setMessage({'tipo': 'erro', 'mensagem': erro.response.data.message})
            setMostrarDelete(false)
            const timer = setTimeout(() => {
                setMessage(null)
            }, 10000);
    
            return () => clearTimeout(timer)
        })
    }

    const buttonExcluirAgendamento = () => {
        if(schedulingSelected !== -1){
            setMostrarDelete(true)
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/agendamentos`).then((resposta) => {
            setDadosAgendamentos((resposta.data).map((item)=> ({cod: item.cod, cliente: item.cliente.nome, servico: item.servico.nome,data: (new Date(item.data)).toLocaleString('pt-BR'),formaPgto: item.formaPgto, status: item.status })) )
        }).catch((erro) => {
            if(erro.response){
                setMessage({'tipo':'erro', 'mensagem': erro.response.data.message})
            }
            else{
                setMessage({'tipo':'erro', 'mensagem': "Não foi possivel se conectar com o servidor"})
            }
        })
    }, [])

    const location = useLocation()
    useEffect(() => {
        if(location.state?.mensagem){
            setMessage({tipo: location.state.tipo, mensagem: location.state.mensagem})
            window.history.replaceState({}, document.title)

            const timer = setTimeout(() => {
                setMessage(null)
            }, 10000);
    
            return () => clearTimeout(timer)
        }
    }, [location])

    const buttonEditarAgendamentos = () => {
        if(schedulingSelected !== -1){
            navigate(`/agendamentos/editar/${schedulingSelected}`)
        }
    }

    return (  
        <div className="mt-5 position-relative">
            {message && message.tipo ==='sucesso' ? (<div class="container alert alert-success text-center mt-5" role="alert">
            {message.mensagem}
          </div>) : message && message.tipo==='erro' ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {message.mensagem}
          </div>): (<></>)}

          <div className={`container ${mostrarDelete ? 'pe-none' : 'pe-auto'}`}>
                <div className="d-flex justify-content-between ">
                    <div>
                        <Cabecalho titulo="Agendamentos" subtitulo="Gerenciamento de agendamentos" />
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        <Button cor="#fe8a5f" handleClick={buttonExcluirAgendamento} texto="Excluir" tipo="button" icone={<IoCloseSharp fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#6ab2b7" handleClick={buttonVisualizarClick} texto="Visualizar" tipo="button" icone={<MdOutlineRemoveRedEye fontSize={24} color="#ffffff"/> } corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#f9b461" handleClick={buttonEditarAgendamentos} texto="Editar" tipo="button" icone={<GoPencil fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#70917f" handleClick={buttonNovoClick} texto="Novo" tipo="button" icone={<IoIosAdd fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true} />
                    </div>
                </div>
                <Table linetrade={changeSchedulingSelected} lineSelected={schedulingSelected} cabecalhos={["Cliente", "Serviço",  "Data", "Forma de pagamento", "Status"]} dados={dadosAgendamentos}/>
            </div>
            {mostrarDelete ? (
            <div className="position-absolute top-50 start-50 translate-middle">
            <AvisoExclusao entidade="agendamento" handleSubmit={excluirAgendamento} handleCancel={() => setMostrarDelete(false)} />
            </div>) : (<></>) }
        </div>  
    )
}

export default Agendamentos