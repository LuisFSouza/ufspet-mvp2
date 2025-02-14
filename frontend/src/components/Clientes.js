import { useEffect, useState } from "react"
import Table from "../components/Table.js"
import axios from "axios"
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import { GoPencil } from "react-icons/go";
import { IoIosAdd } from "react-icons/io";
import Button from "./Button";
import {useLocation, useNavigate} from 'react-router'
import Cabecalho from "./Cabecalho";
import AvisoExclusao from "./AvisoExclusao";

function Clientes (){
    const [clientSelected, setClientSelected] = useState(-1)
    const [message, setMessage] = useState(null)

    const changeClientSelected = (id) => {
        setClientSelected(id)
    }

    const [dadosClientes, setDadosClientes] = useState([])
    const navigate = useNavigate()
    const buttonNovoCliente = () => {
        navigate('/clientes/novo')
    }

    const [mostrarDelete, setMostrarDelete] = useState(false)
    const excluirCliente = () => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/clientes/deletar/${clientSelected}`).then((response) => {
            setMostrarDelete(false)
            setClientSelected(-1)
            setDadosClientes(dadosClientes.filter((dado) => dado.cod !== clientSelected))
            setMessage({'tipo': 'sucesso', 'mensagem': `Cliente ${response.data.cod} excluido com sucesso`})
            
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

    const buttonExcluirCliente = () => {
        if(clientSelected !== -1){
            setMostrarDelete(true)
        }
    }

    const buttonVisualizarCliente = () => {
        if(clientSelected !== -1){
            navigate(`/clientes/${clientSelected}`)
        }
    }

    const buttonEditarCliente = () => {
        if(clientSelected !== -1){
            navigate(`/clientes/editar/${clientSelected}`)
        }
    }

    const buttonCompras = () => {
        if(clientSelected !== -1){
            navigate(`/clientes/${clientSelected}/compras`)
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes`).then((resposta) => {
            setDadosClientes(resposta.data)
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
                        <Cabecalho titulo="Clientes" subtitulo="Gerenciamento de Clientes" />
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        <Button handleClick={buttonCompras} cor="#7E79FF" texto="Compras" tipo="button" icone={<LuShoppingCart fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#fe8a5f" handleClick={buttonExcluirCliente} texto="Excluir" tipo="button" icone={<IoCloseSharp fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#6ab2b7" handleClick={buttonVisualizarCliente} texto="Visualizar" tipo="button" icone={<MdOutlineRemoveRedEye fontSize={24} color="#ffffff"/> } corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#f9b461" handleClick={buttonEditarCliente} texto="Editar" tipo="button" icone={<GoPencil fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#70917f" handleClick={buttonNovoCliente} texto="Novo" tipo="button" icone={<IoIosAdd fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                    </div>
                </div>
                <Table linetrade={changeClientSelected} lineSelected={clientSelected} cabecalhos={["Cliente", "CPF",  "Email", "Telefone", "Endereço"]} dados={dadosClientes}/>
            </div>
            {mostrarDelete ? (
            <div className="position-absolute top-50 start-50 translate-middle">
            <AvisoExclusao entidade="cliente" handleSubmit={excluirCliente} handleCancel={() => setMostrarDelete(false)} />
            </div>) : (<></>) }
        </div> 

    )
}

export default Clientes