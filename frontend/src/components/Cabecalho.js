function Cabecalho({titulo, subtitulo, classN}) {
    return (
        <div className={classN}>
            <h3>{titulo}</h3>
            <h5>{subtitulo}</h5>
        </div>
    )
}

export default Cabecalho