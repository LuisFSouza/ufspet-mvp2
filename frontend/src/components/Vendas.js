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
import AvisoEstoqueBaixo from "./AvisoEstoqueBaixo.js";


function Vendas() {
    const [saleSelected, setSaleSelected] = useState(-1)
    const [message, setMessage] = useState(null)

    const changeSaleSelected = (id) => {
        setSaleSelected(id)
    }
    const [dadosVendas, setDadosVendas] = useState([])
    const navigate = useNavigate()
    const buttonNovoClick = () => {
        navigate('/vendas/nova')
    }

    const buttonVisualizarClick = () => {
        if(saleSelected !== -1){
            navigate(`/vendas/${saleSelected}`)
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendas`).then((resposta) => {
            setDadosVendas((resposta.data).map(({cod, cliente_id,data,formaPgto, totalVenda})=> ({cod, cliente_id,data: (new Date(data)).toLocaleString('pt-BR'),formaPgto, totalVenda: `R$ ${totalVenda.toFixed(2).replace('.', ',')}`})) )
        }).catch((erro) => {
            if(erro.response){
                setMessage({'tipo':'erro', 'mensagem': erro.response.data.message})
            }
            else{
                setMessage({'tipo':'erro', 'mensagem': "Não foi possivel se conectar com o servidor"})
            }
        })
    }, [])

    const buttonEditarVenda = () => {
        if(saleSelected !== -1){
            navigate(`/vendas/editar/${saleSelected}`)
        }
    }

    const [mostrarDelete, setMostrarDelete] = useState(false)
    const excluirVenda = () => {
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/vendas/deletar/${saleSelected}`).then((response) => {
            setMostrarDelete(false)
            setSaleSelected(-1)
            setDadosVendas(dadosVendas.filter((dado) => dado.cod !== saleSelected))
            setMessage({'tipo': 'sucesso', 'mensagem': `Venda ${response.data.cod} excluida com sucesso`})
            
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

    const buttonExcluirVenda = () => {
        if(saleSelected !== -1){
            setMostrarDelete(true)
        }
    }

    const location = useLocation()
    useEffect(() => {
        if(location.state?.itensEmFalta){
            setProdutosEmFalta(location.state.itensEmFalta)
        }

        if(location.state?.mensagem){
            setMessage({tipo: location.state.tipo, mensagem: location.state.mensagem})
            window.history.replaceState({}, document.title)

            const timer = setTimeout(() => {
                setMessage(null)
            }, 10000);
    
            return () => clearTimeout(timer)
        }
    }, [location])

    const [produtosEmFalta,setProdutosEmFalta] = useState([])



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
                        <Cabecalho titulo="Vendas" subtitulo="Gerenciamento de vendas" />
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        <Button cor="#fe8a5f" handleClick={buttonExcluirVenda} texto="Excluir" tipo="button" icone={<IoCloseSharp fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true}/>
                        <Button cor="#6ab2b7" handleClick={buttonVisualizarClick} texto="Visualizar" tipo="button" icone={<MdOutlineRemoveRedEye fontSize={24} color="#ffffff"/> } corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#f9b461" handleClick={buttonEditarVenda} texto="Editar" tipo="button" icone={<GoPencil fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true} />
                        <Button cor="#70917f" handleClick={buttonNovoClick} texto="Novo" tipo="button" icone={<IoIosAdd fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="row" sombra={true} />
                    </div>
                </div>
                <Table linetrade={changeSaleSelected} lineSelected={saleSelected} cabecalhos={["Cliente", "Data",  "Forma de Pagamento", "Total"]} dados={dadosVendas}/>
            </div>
            {mostrarDelete ? (
            <div className="position-absolute top-50 start-50 translate-middle">
            <AvisoExclusao entidade="vendas" handleSubmit={excluirVenda} handleCancel={() => setMostrarDelete(false)} />
            </div>) : (<></>) }

             

            {produtosEmFalta ? 
            <div className="position-absolute top-50 start-50 translate-middle">
                {produtosEmFalta.map((prod, index) => (
                    <AvisoEstoqueBaixo style={{position: 'absolute', top: `${index*10}px`, left: '50%', transform: 'translateX(-50%)'}} produto={prod.produto} quantidade={prod.quantidade}/>
                ))}
            </div> : (<></>)
            }
        </div>  
    )
}

export default Vendas