import { useEffect, useRef, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import {useNavigate, useParams} from 'react-router'
import GerenciamentoVendas from "./GerenciamentoVendas"
import dayjs from 'dayjs'
function EditarVenda() {
    const params = useParams()
    const navigate = useNavigate()
    const [cliente, setCliente] = useState(null)
    const [data, setData] = useState("")
    const [formaPgto, setFormaPgto] = useState(null)
    const [itensVenda, setItensVenda] = useState([]) /*Talvez de pra tipar*/
    const [erro, setErro] = useState(null)
    const refItens = useRef()

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendas/${params.id}`).then((resposta) => {
            setCliente(resposta.data.cliente.cod)
            const dataFormatada = dayjs(resposta.data.data).format("YYYY-MM-DDTHH:mm")
            setData(dataFormatada)
            const forma = resposta.data.formaPgto;
            setFormaPgto(forma === 'CREDITO' ? 1 : forma === 'DEBITO' ? 2 : forma === 'DINHEIRO' ? 3 : forma === 'PIX' ? 4 : -1)
            setItensVenda((resposta.data.itens).map(({produto,quantidade})=> ({produto_id: produto.cod, quantidade})) )
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
        if(form){
            var itemValido = true;
            const client = form.querySelector('select[id="cliente"]')
            const dt = form.querySelector('input[id="dtvenda"]')
            const pgto = form.querySelector(' select[id="formapgto"]')
            var elementos = [pgto,dt,client]
            if(itensVenda.length === 0){
                const select = form.querySelector('select[id="novo"]')
                const input = form.querySelector('input[id="novo"]')
                elementos = [input, select, ...elementos]
            }

            
            elementos.forEach((elemento) => {
                if(!elemento.reportValidity()){
                    itemValido = false;
                }
            })

            if(itemValido){
                if(itensVenda.length === 0){
                    navigate('/vendas', {state: {tipo:"erro", mensagem:"A venda tem que ter pelo menos um item"}})  
                }
                else{
                    const forma = parseInt(formaPgto)
                    const dados = {
                        cliente_id: parseInt(cliente),
                        formaPgto: forma === 1 ? 'CREDITO': forma === 2 ? 'DEBITO' : forma === 3 ? 'DINHEIRO' : forma === 4 ? 'PIX' : 'None',
                        itens: itensVenda
                    }
                    if(data !== ""){
                        dados.data = new Date(data).toISOString();
                    }
                    
                    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/vendas/editar/${params.id}`, dados
                    ).then((resposta) => {
                        navigate('/vendas', {state: {tipo:"sucesso", mensagem: "Venda editada com sucesso", itensEmFalta: resposta.data}})
                    }).catch((erro) => {
                        if(erro.response){
                            navigate('/vendas', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                        }
                        else{
                            navigate('/vendas', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                        }
                    })
                }
            }
        }
    }

    const limpar = (event) => {
        event.preventDefault()
        setCliente("")
        setData("")
        setFormaPgto("")
        //Fazer limpar todos campos
        setItensVenda(refItens.current.cleanItens())
    }

    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoVendas  mode={3} ref={refItens} botoes={[
            <Button cor="#6F917F" texto="Editar" handleClick={editar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Vendas" estados={{cliente, data, formaPgto, itensVenda}} 
        setEstados={{setCliente, setData, setFormaPgto, setItensVenda}}
        subtitulo="Editar Venda" />
        )        
    )
}

export default EditarVenda