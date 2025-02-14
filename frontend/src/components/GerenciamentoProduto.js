import TextField from "./TextField.js"
import Acao from "./Acao.js"

function GerenciamentoProduto({titulo, subtitulo, botoes, estados, setEstados, visualizacao}){
    const {nome, marca, preco, quantidade, fornecedor} = estados
    const {setNome, setMarca, setPreco, setQuantidade, setFornecedor} = setEstados

    return (
        <Acao titulo={titulo} subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField visualizacao={visualizacao} setValue={setNome} value={nome} placeholder="Digite o nome do produto" titulo="Nome do Produto" tipo="text" id="nomeproduto"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setMarca} value={marca} placeholder="Digite a marca do produto" titulo="Marca do produto" tipo="text" id="marcaproduto"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setPreco} value={preco} min={0} placeholder="Digite o preço do produto" titulo="Preço do produto" tipo="number" id="precoproduto" step="0.01"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setQuantidade} value={quantidade} placeholder="Digite a quantidade do produto" titulo="Quantidade do produto" tipo="number" id="quantidadeproduto" step="1"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setFornecedor} value={fornecedor} placeholder="Digite o fornecedor do produto" titulo="Fornecedor do produto" tipo="text" id="fornecedorproduto" required={false}/>, buttonSupport: false}
        ]}
    />
    )
}

export default GerenciamentoProduto