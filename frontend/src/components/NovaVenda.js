import Button from "./Button.js"
import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import axios from "axios"
import GerenciamentoVendas from "./GerenciamentoVendas.js"

function NovaVenda(){
    const navigate = useNavigate()
    const [cliente, setCliente] = useState(null)
    const [data, setData] = useState("")
    const [formaPgto, setFormaPgto] = useState(null)
    const [itensVenda, setItensVenda] = useState([]) /*Talvez de pra tipar*/
    const refItens = useRef()
    const cadastrar = (event) => {
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

                axios.post(`${process.env.REACT_APP_BACKEND_URL}/vendas/criar`, dados
                ).then((resposta) => {
                    navigate('/vendas', {state: {tipo:"sucesso", mensagem: "Venda cadastrada com sucesso", itensEmFalta: resposta.data}})
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

    /*Precisa arrumar*/ 
    const limpar = (event) => {
        event.preventDefault()
        setCliente("")
        setData("")
        setFormaPgto("")
        //Fazer limpar todos campos
        setItensVenda(refItens.current.cleanItens())
    }

    return (
        <GerenciamentoVendas mode={1} ref={refItens} visualizacao={false} botoes={[
            <Button cor="#6F917F" texto="Cadastrar" handleClick={cadastrar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Vendas" estados={{cliente, data, formaPgto, itensVenda}} 
        setEstados={{setCliente, setData, setFormaPgto, setItensVenda}}
        subtitulo="Cadastro de Vendas" />
    )
}

export default NovaVenda