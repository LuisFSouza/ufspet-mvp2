import { useEffect, useState } from "react"
import Table from "./Table.js"
import axios from "axios"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Button from "./Button";
import {useNavigate, useParams} from 'react-router'
import Cabecalho from "./Cabecalho";

function Compras (){
    const [selectedBuy, setSelectedBuy] = useState(-1)
    const [message, setMessage] = useState(null)

    const changeSelectedBuy = (id) => {
        setSelectedBuy(id)
    }

    const [dadosCompras, setDadosCompras] = useState([])
    const navigate = useNavigate()

    const {id} = useParams()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/clientes/${id}/compras`).then((resposta) => {
            setDadosCompras((resposta.data).map(({cod, cod_op,formaPgto,total, data, tipo})=> ({cod, cod_op,formaPgto,total: `R$ ${total.toFixed(2).replace('.', ',')}`, data:(new Date(data)).toLocaleString('pt-BR'), tipo})))
        }).catch((erro) => {
            if(erro.response){
                setMessage({'tipo':'erro', 'mensagem': erro.response.data.message})
            }
            else{
                setMessage({'tipo':'erro', 'mensagem': "Não foi possivel se conectar com o servidor"})
            }
        })
    }, [])

    function buttonVisualizarCompra(){
        if(selectedBuy !== -1){
            const buy = dadosCompras.find((item) => item.cod === selectedBuy);
            if(buy.tipo==="Agendamento"){
                navigate(`/clientes/${id}/compras/${buy.cod_op}/agendamento`)
            }

            if(buy.tipo==="Venda"){
                navigate(`/clientes/${id}/compras/${buy.cod_op}/venda`)
            }
        }
    }


    return (

        <div className="mt-5 position-relative">
            {message && message.tipo ==='sucesso' ? (<div class="container alert alert-success text-center mt-5" role="alert">
            {message.mensagem}
          </div>) : message && message.tipo==='erro' ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {message.mensagem}
          </div>): (<></>)}

          <div className="container pe-auto">
                <div className="d-flex justify-content-between ">
                    <div>
                        <Cabecalho titulo="Compras realizadas" subtitulo="Gerenciamento de Clientes" />
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        
                        <Button cor="#6ab2b7" handleClick={buttonVisualizarCompra} texto="Visualizar" tipo="button" icone={<MdOutlineRemoveRedEye fontSize={24} color="#ffffff"/> } corTexto="#ffffff" direcao="row" sombra={true}/>

                    </div>
                </div>

                <Table linetrade={changeSelectedBuy} lineSelected={selectedBuy} cabecalhos={["Data", "Forma de pagamento",  "Total"]} dados={dadosCompras.map(({cod, data, formaPgto, total}) => ({
                    cod, data, formaPgto, total
                }))}/>
               
            </div>
        </div> 

    )
}

export default Compras