import { useEffect, useState } from "react"
import Table from "../components/Table.js"
import axios from "axios"
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import Button from "./Button";
import {useLocation, useNavigate} from 'react-router'
import Cabecalho from "./Cabecalho";
import AvisoExclusao from "./AvisoExclusao";

function Servicos (){

    const [serviceSelected, setServiceSelected] = useState(-1)
    const [message, setMessage] = useState(null)

    const changeServiceSelected = (id) => {
        setServiceSelected(id)
    }
    const [dadosServicos, setDadosServicos] = useState([])
    const navigate = useNavigate()
    const buttonNovoServico = () => {
        navigate('/servicos/novo')
    }

    const buttonVisualizarServico= () => {
        if(serviceSelected !== -1){
            navigate(`/servicos/${serviceSelected}`)
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/servicos`).then((resposta) => {
            setDadosServicos((resposta.data).map(({cod, nome, duracao,preco,descricao})=> ({cod, nome, duracao, preco: `R$ ${Number(preco).toFixed(2).replace('.', ',')}`, descricao})))
        }).catch((erro) => {
            if(erro.response){
                setMessage({'tipo':'erro', 'mensagem': erro.response.data.message})
            }
            else{
                setMessage({'tipo':'erro', 'mensagem': "Não foi possivel se conectar com o servidor"})
            }
        })
    }, [])

    const [mostrarDelete, setMostrarDelete] = useState(false)
    const excluirServico = () => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/servicos/deletar/${serviceSelected}`).then((response) => {
            setMostrarDelete(false)
            setServiceSelected(-1)
            setDadosServicos(dadosServicos.filter((dado) => dado.cod !== serviceSelected))
            setMessage({'tipo': 'sucesso', 'mensagem': `Serviço ${response.data.cod} excluido com sucesso`})
            
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
    const buttonExcluirServico = () => {
        if(serviceSelected !== -1){
            setMostrarDelete(true)
        }
    }

    const buttonEditarServico = () => {
        if(serviceSelected !== -1){
            navigate(`/servicos/editar/${serviceSelected}`)
        }
    }

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
                        <Cabecalho titulo="Serviços" subtitulo="Gerenciamento de Serviços" />
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        <Button cor="#fe8a5f" handleClick={buttonExcluirServico} texto="Excluir" tipo="button" icone={<IoCloseSharp fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#6ab2b7" handleClick={buttonVisualizarServico} texto="Visualizar" tipo="button" icone={<MdOutlineRemoveRedEye fontSize={24} color="#ffffff"/> } corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#f9b461" handleClick={buttonEditarServico}texto="Editar" tipo="button" icone={<GoPencil fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#70917f" handleClick={buttonNovoServico} texto="Novo" tipo="button" icone={<IoIosAdd fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                    </div>
                </div>
                <Table linetrade={changeServiceSelected} lineSelected={serviceSelected} cabecalhos={["Nome", "Duração",  "Preço", "Descrição"]} dados={dadosServicos}/>
            </div>
            {mostrarDelete ? (
            <div className="position-absolute top-50 start-50 translate-middle">
            <AvisoExclusao entidade="servico" handleSubmit={excluirServico} handleCancel={() => setMostrarDelete(false)} />
            </div>) : (<></>) }
        </div> 

    )
}

export default Servicos