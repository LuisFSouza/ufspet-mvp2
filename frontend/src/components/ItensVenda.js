import { useEffect, useImperativeHandle, useState } from "react"
import ProdutoVenda from "./ProdutoVenda.js"
import axios from "axios"
import { useNavigate } from "react-router"
import {v4 as uuid} from 'uuid'

function ItensVenda({ref, setValues, values, mode, title="Itens da Venda"}){
    const navigate = useNavigate()
    const [produtos, setProdutos] = useState([])

    function checkItemAlreadySelected(idproduto){
        const existe = values.find((value) => value.produto_id === Number(idproduto));
        if(existe){
            return true;
        }
        else{
            return false;
        }
    }

    useEffect(()=>{
        if(mode === 1 || mode === 3){
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/produtos/disponiveis`).then((resposta) => {
            setProdutos((resposta.data).map(({cod,nome,quantidade})=> ({cod, nome, quantidade})))
       }).catch((erro) => {
           if(erro.response){
               navigate('/vendas', {state: {tipo:"erro", mensagem: erro.response.data.message}})
           }
           else{
               navigate('/vendas', {state: {tipo:"erro", mensagem:"Não foi possivel se conectar com o servidor"}})
           }
       })
    }
   }, [])

   useImperativeHandle(ref, () => ({
        cleanItens(){
            setCampos(() =>
                {
                    const uuidGen = uuid()
                    
                    const obj = [{
                        adicionado: false,
                        onadd: handleAddProduto,
                        id: uuidGen,
                        valueProduct: "",
                        onremove: handleRemoveProduto,
                        valueQuantity: "",
                        key:uuidGen,
                        onchangeproduct: handleChangeProduto,
                        onchangequantity: handleChangeQuantidade
                    }]
        
                    return obj
                })
        },
    }))

    const [campos, setCampos] = useState(() =>
        {
            if(mode === 1){
                const uuidGen = uuid()  
            
                const obj = [{
                    adicionado: false,
                    onadd: handleAddProduto,
                    id: uuidGen,
                    valueProduct: "",
                    onremove: handleRemoveProduto,
                    valueQuantity: "",
                    key:uuidGen,
                    onchangeproduct: handleChangeProduto,
                    onchangequantity: handleChangeQuantidade
                }]
    
                return obj
            }
            else{
                return []
            }
        })

    const [jaCarregou, setJaCarregou] = useState(false)
    useEffect(() => {
        if(jaCarregou === false){
            if(mode === 2 && campos.length === 0 && values.length > 0){
                
                setCampos(() => {
                    return values.map((valor, indice) => {
                        const uuidGen = uuid()
                        return {
                            adicionado: false,
                            visualizacao: true,
                            mostrarbotoes: false,
                            onadd: handleAddProduto,
                            id: uuidGen,
                            valueProduct: valor.produto_id,
                            onremove: handleRemoveProduto,
                            valueQuantity: parseInt(valor.quantidade, 10),
                            key:uuidGen,
                            onchangeproduct: handleChangeProduto,
                            onchangequantity: handleChangeQuantidade
                        }
                    })
                    
                })
                setJaCarregou(true)
                }
                //Tratar o caso que nao tem itens
                else if(mode === 3 && campos.length === 0 && values.length > 0){
                    setCampos(() => {

                        const uuidGen1 = uuid() 
                    
                        const obj = [{
                            adicionado: false,
                            onadd: handleAddProduto,
                            id: uuidGen1,
                            valueProduct: "",
                            onremove: handleRemoveProduto,
                            valueQuantity: "",
                            key:uuidGen1,
                            onchangeproduct: handleChangeProduto,
                            onchangequantity: handleChangeQuantidade
                        }]
        
        
                        
                        return [
                        ...values.map((valor, indice) => {
                            const uuidGen = uuid() 
                            return {
                                adicionado: true,
                                visualizacao: true,
                                mostrarbotoes: true,
                                onadd: handleAddProduto,
                                id: uuidGen,
                                valueProduct: valor.produto_id,
                                onremove: handleRemoveProduto,
                                valueQuantity: parseInt(valor.quantidade, 10),
                                key:uuidGen,
                                onchangeproduct: handleChangeProduto,
                                onchangequantity: handleChangeQuantidade
                            }
                            
                        }),
                        ...obj];
                    })
                    setJaCarregou(true)
            }

        }
    }, [values])
        
    function handleChangeProduto(id, value){
        setCampos(camposAnt =>{
            const camposAtt = camposAnt.map(campo => {
                if(campo.id === id){
                    const novoCampo = {...campo, valueProduct: value}

                    return novoCampo
                }
                else{
                    return campo;
                }
            })
            return camposAtt
        })
    }

    function handleChangeQuantidade(id, value){
        setCampos(camposAnt =>{
            const camposAtt = camposAnt.map(campo => {
                if(campo.id === id){
                    const novoCampo = {...campo, valueQuantity: value}
                    return novoCampo
                }
                else{
                    return campo;
                }
            })
            return camposAtt
        })
    }

    function handleAddProduto(id){
        setCampos(camposAnt =>{
            const camposAtt = camposAnt.map(campo => {
                if(campo.id === id){
                    return {...campo, adicionado: true, visualizacao: true}
                }
                else{
                    return campo;
                }
            })
            const uuidGen = uuid()
            const camposNovo = [
                ...camposAtt, {
                    adicionado: false,
                    onadd: handleAddProduto,
                    id: uuidGen,
                    valueProduct: "",
                    onremove: handleRemoveProduto,
                    valueQuantity: "",
                    key: uuidGen,
                    onchangeproduct: handleChangeProduto,
                    onchangequantity: handleChangeQuantidade,
                } 
            ]

            const valores = camposNovo.filter((campo)=> {
                if(campo.adicionado===true){
                    return true
                }
                else{
                    return false;
                }
            }).map((campo) => {
                return {produto_id: parseInt(campo.valueProduct), quantidade: parseInt(campo.valueQuantity)}
            })
            setValues(valores)

            return camposNovo;
            }
        )

        
      
    }

    function handleRemoveProduto(id){
        setCampos(camposAnt => { 
           const camposNovo = camposAnt.filter(campo => campo.id !== id)

           const valores = camposNovo.filter((campo)=> {
            if(campo.adicionado===true){
                return true
            }
            else{
                return false;
            }
            }).map((campo) => {
                return {produto_id: parseInt(campo.valueProduct), quantidade: parseInt(campo.valueQuantity)}
            })
            setValues(valores)

            return camposNovo
        }
    )
       
    }

    return (
        <div className="d-flex flex-column mb-3" style={{fontSize: '18px', fontWeight: 'bold'}}>
            <label style={{color: '#667085'}} htmlFor="itens">{title}</label>
            {campos.map(({key, ...props}) => (
                <ProdutoVenda key={key} checkItemSelected={checkItemAlreadySelected} produtos={produtos} {...props}/>
            ))}
        </div>
    )
}

export default ItensVenda