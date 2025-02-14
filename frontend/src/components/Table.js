import './Table.css'

function Table({cabecalhos, dados, linetrade, lineSelected}) {
    return(
        <div className="mt-4">
            <div className="table-responsive card rounded-4 p-0 m-0">
                <table className="table table-bordered rounded-4 border overflow-hidden p-0 m-0">
                    <thead>
                        <tr>
                        {cabecalhos.map((cabecalho, index) => (
                            <th key={index} scope="col">{cabecalho}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>

                        {dados.map((dado, index) => (
                            
                                <tr key={index} id={dado.cod} className={lineSelected === dado.cod ? 'linhaSelecionada' : ''} onClick={() => linetrade(dado.cod)}>
                                        {Object.entries(dado).filter(([key]) => key !== 'cod').map((valor, i) => (
                                            <td key={i}>{valor[1]}</td>
                                        ))}  
                                </tr>
                            
                        ))}
                    </tbody>
                </table>
                </div>
        </div>



    )

}


export default Table;