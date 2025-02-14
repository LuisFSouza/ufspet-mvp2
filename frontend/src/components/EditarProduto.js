import { useEffect, useState } from "react"
import Button from "./Button.js"
import axios from "axios"
import GerenciamentoProduto from './GerenciamentoProduto'
import {useNavigate, useParams} from 'react-router'
import Decimal from 'decimal.js'

function EditarProduto() {
    const params = useParams()
    const navigate = useNavigate()
    const [nome, setNome] = useState('')
    const [marca, setMarca] = useState('')
    const [preco, setPreco] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [fornecedor, setFornecedor] = useState('')
    const [erro, setErro] = useState(null)
    
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/produtos/${params.id}`).then((resposta) => {
            setNome(resposta.data.nome)
            setMarca(resposta.data.marca)
            setPreco(resposta.data.preco)
            setQuantidade(resposta.data.quantidade)
            setFornecedor(resposta.data.fornecedor)
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
            const dados = {
                nome: nome,
                marca: marca,
                preco: new Decimal(preco),
                quantidade: Number(quantidade)
            }
            if(fornecedor !== ""){
                dados.fornecedor = fornecedor
            }
            
            axios.patch(`${process.env.REACT_APP_BACKEND_URL}/produtos/editar/${params.id}`, dados).then((resposta) => {
                navigate('/produtos', {state: {tipo:"sucesso", mensagem: "Produto editado com sucesso"}})
            }).catch((erro) => {
                if(erro.response){
                    navigate('/produtos', {state: {tipo:"erro", mensagem: erro.response.data.message}})
                }
                else{
                    navigate('/produtos', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
                }
            })
        }
    }

    const limpar = (event) => {
        event.preventDefault()
        setFornecedor("")
        setQuantidade("")
        setMarca("")
        setNome("")
        setPreco("")
    }


    return (
        erro ? (<div class="container alert alert-danger text-center mt-5" role="alert">
            {erro}
          </div>) : (
        <GerenciamentoProduto botoes={[
            <Button cor="#6F917F" texto="Editar" handleClick={editar} corTexto="#FFFFFF" largura='100%'/>,
            <Button cor="#A5A5A5" texto="Limpar" handleClick={limpar} corTexto="#FFFFFF" largura='100%'/>
        ]} titulo="Produtos" estados={{nome, marca, preco, quantidade, fornecedor}} 
        setEstados={{setNome, setMarca, setPreco, setFornecedor, setQuantidade}}
        subtitulo="Editar Produto" />
        )        
    )
}

export default EditarProduto