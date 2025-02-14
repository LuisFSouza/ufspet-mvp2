import TextField from "./TextField.js"
import Acao from "./Acao.js"

function GerenciamentoServico({titulo, subtitulo, botoes, estados, setEstados, visualizacao}){
    const {nome, duracao, preco, descricao } = estados
    const {setNome, setDuracao, setPreco, setDescricao} = setEstados

    return (
        <Acao titulo={titulo} subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField visualizacao={visualizacao} setValue={setNome} value={nome} placeholder="Digite o nome do serviço" titulo="Nome do Serviço" tipo="text" id="nomeservico"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setDuracao} value={duracao} placeholder="Digite a duração do serviço" titulo="Duração do Serviço (em m)" tipo="number" id="duracaoservico" step="1"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setPreco}  min={0} value={preco} placeholder="Digite o preço do serviço" titulo="Preço do Serviço" tipo="number" id="precoservico" step="0.01"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setDescricao} value={descricao} placeholder="Digite a descrição do serviço" titulo="Descrição do Serviço" tipo="text" id="descricaoservico" required={false}/>, buttonSupport: false}
        ]}
    />
    )
}

export default GerenciamentoServico