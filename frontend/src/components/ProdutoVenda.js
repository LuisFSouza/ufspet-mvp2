import TextField from "./TextField.js"
import './ProdutoVenda.css'
import Button from "./Button.js";
import { IoIosAdd } from "react-icons/io"
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
function ProdutoVenda({mostrarbotoes = true, onchangeproduct, onchangequantity, produtos, visualizacao = false, onadd, onremove, adicionado, valueProduct, id, valueQuantity, checkItemSelected}){
    const [erro, setErro] = useState(null)
    
    const adicionar = (event) => {
        event.preventDefault()
        const form = document.getElementsByTagName('form')[0];
        if(form){
            var itemValido = true;
            const select = form.querySelector('select[id="novo"]')
            const input = form.querySelector('input[id="novo"]')
            const elementos =[input,select];
            elementos.forEach((elemento) => {
                if(!elemento.reportValidity()){
                    itemValido = false;
                }
            })
            if(itemValido){
                const existe = checkItemSelected(valueProduct);
            if(existe === true){
                setErro("Esse produto ja existe")
                
                const timer = setTimeout(() => {
                    setErro(null)
                }, 5000);
        
                return () => clearTimeout(timer)
            }
            else{
                const product = produtos.find((item) => item.cod === Number(valueProduct))
                if(valueQuantity > product.quantidade){
                    setErro(`Existem apenas ${product.quantidade} unidades disponiveis deste produto`)
                
                    const timer = setTimeout(() => {
                        setErro(null)
                    }, 5000);
            
                    return () => clearTimeout(timer)
                }
                else{
                    if(itemValido){
                        onadd(id);
                        setErro("")
                    }
                }
            }
            }   
        }
    }
    return(
        <div className={`d-flex flex-column pt-1`}>
            <div class="row w-100 mx-0">
                <div class="col-6 px-0 pe-1">
                    {mostrarbotoes ?
                     <TextField setValue = {(value) => onchangeproduct(id, value)} value={valueProduct} visualizacao={visualizacao} placeholder="Selecione o produto" tipo="select" id={adicionado ? "produto" : "novo"} dadosSelect={produtos.map(({cod,nome})=> ({cod, nome}))}/>
                    :
                    <TextField setValue = {(value) => onchangeproduct(id, value)} value={valueProduct} visualizacao={visualizacao} placeholder="Selecione o produto" tipo="input" id={adicionado ? "produto" : "novo"}/>
                    }
                </div>
                <div class="col-3 px-0 ps-1">
                <TextField value={valueQuantity} setValue={(value) => onchangequantity(id, value)} visualizacao={visualizacao} placeholder="Quantidade" tipo="number" id={adicionado ? "qtdd-prod" : "novo"} step="1" />
                </div>
                <div class="col-1">
                {mostrarbotoes ?
                    adicionado ? <Button handleClick={() => onremove(id)} cor="#FF7B7B" tipo="button" icone={<IoMdClose fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="column" sombra={true}/>
                    :
                    <Button  cor="#70917f" handleClick={adicionar} tipo="submit" icone={<IoIosAdd fontSize={24} color="#ffffff"/>} corTexto="#ffffff" direcao="column" sombra={true}/>
                    :
                    ''
                }
                </div>
            </div>
            {erro ?
                (<div>
                    <p className="text-danger fs-6">{erro}</p>
                </div>)
            : ""}  
           
        </div>
    )
}

export default ProdutoVenda