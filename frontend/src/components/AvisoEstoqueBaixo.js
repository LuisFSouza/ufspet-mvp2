import { useState } from 'react';

//Alerta de estoque baixo
function AvisoEstoqueBaixo({produto, quantidade, style}) {

    //Acompanha a visibilidade do card
    const [visibilidade, setVisibilidade] = useState(true);

    if (!visibilidade) return null;

    return (   
        <div className="card py-2 px-2" style={{...style, width: '24rem', backgroundColor: '#EAEEE1', color: '#4C745F'}}>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setVisibilidade(false)} />
            </div>
            <div className="card-body">
                <h4 className="card-title text-center"><strong>Atenção:</strong> Produto abaixo de 10 unidades em estoque.</h4>
                <div 
                    className="d-flex align-items-center justify-content-center rounded" 
                    style={{ backgroundColor: '#EAEEE1', padding: '1rem' }}
                    >
                    {/* Círculo com a imagem */}
                    <div 
                        className="rounded-circle overflow-hidden position-relative" 
                        style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#8CA799',
                        marginRight: '-40px', // Sobreposição com a caixa de texto
                        border: '2px solid #8CA799',
                        zIndex: 1, // Faz o círculo ficar em cima da caixa
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                        display:'flex',
                        justifyContent:'center', alignItems:'center'
                        }}
                    >
                        <img alt="" src="/cao_latindo_1.svg" 
                        style={{width: '80%', height: '80%', objectFit: 'contain'}}
                        ></img>
                    </div>

                    {/* Caixa com informação de quantidade e produto */}
                    <div 
                        className="text-white py-2 text-start" 
                        style={{ 
                        backgroundColor: '#8CA799', 
                        borderRadius: '33px', 
                        zIndex: 0, 
                        flex: 1, // Faz o texto ocupar o espaço restante
                        paddingLeft: '60px', // Ajusta o texto para começar depois do círculo
                        }}
                    >
                        <strong>{produto}</strong><br />
                        {quantidade} unidades em estoque
                    </div>
                    </div>


           
            </div>
        </div>
    )
}

export default AvisoEstoqueBaixo