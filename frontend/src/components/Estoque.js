import { useEffect, useState } from "react"
import axios from "axios"
import {useLocation} from 'react-router'
import Cabecalho from "./Cabecalho";

function Estoque (){

    const [message, setMessage] = useState(null)



    const [dadosEstoque, setDadosEstoque] = useState([])


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/produtos/estoque`).then((resposta) => {
            setDadosEstoque((resposta.data).map(({cod, nome, marca,preco,quantidade, fornecedor})=> ({cod, nome, marca, preco: `R$ ${Number(preco).toFixed(2).replace('.', ',')}`, quantidade, fornecedor})))
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

            <div className="container">
                <div className="d-flex justify-content-between ">
                    <div>
                        <Cabecalho titulo="Estoque" subtitulo="Monitoramento de Estoque"/>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="table-responsive card rounded-4 p-0 m-0">
                        <table className="table table-bordered rounded-4 border overflow-hidden p-0 m-0">
                            <thead>
                            <tr>
                                {["Produto", "Marca", "Quantidade", "Fornecedor"].map((cabecalho, index) => (
                                    <th key={index} scope="col">{cabecalho}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {dadosEstoque.map((dado, index) => (
                                <tr key={index} id={dado.cod}>
                                    {Object.entries(dado).filter(([key]) => key !== 'cod' && key !== 'preco').map((valor, i) => (
                                        <td key={i}>{valor[1]}</td>
                                    ))}
                                </tr>

                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Estoque