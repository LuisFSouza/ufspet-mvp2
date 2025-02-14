function Button({cor, texto, tipo, icone, handleClick, largura, corTexto, direcao, sombra=false}) {
    return (
        <button type={tipo} style={{backgroundColor: cor, width: largura, boxShadow: sombra ? "4px 4px 10px rgba(0,0,0,0.5)" : ""}} onClick={handleClick} className="btn align-items-center">
            <div className={`d-flex flex-${direcao} align-items-center justify-content-center gap-2`}>
                {icone}
                <span style={{color: corTexto}}>{texto}</span>
            </div>
        </button>
    )
}

export default Button