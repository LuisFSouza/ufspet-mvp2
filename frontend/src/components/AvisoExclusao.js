import Button from "./Button.js"
import { IoCheckmarkCircle   } from "react-icons/io5";
import { IoCloseCircleSharp } from "react-icons/io5";

/*Fazer o não fechar, e o sim apagar*/
function AvisoExclusao({entidade, handleSubmit, handleCancel}) {
    return (   
        <div className="card" style={{width: '18rem', backgroundColor: '#EAEEE1', color: '#6F917F'}}>
        <div className="card-body">
            <h5 className="card-title text-center">Tem certeza de que deseja excluir este {entidade}?</h5>
            <div className="d-flex w-100 justify-content-center">
                
                <Button handleClick={handleSubmit} icone={<IoCheckmarkCircle  style={{color: '#6F917F', fontSize: '3rem'}} />}  texto="Sim" corTexto="#6F917F" direcao='column'> </Button>
                <Button handleClick={handleCancel} icone={<IoCloseCircleSharp  style={{color: '#FE8A5F', fontSize: '3rem'}}/>} texto="Não" corTexto="#6F917F" direcao='column'> </Button>
            </div>
           
        </div>
        </div>
    )
}

export default AvisoExclusao