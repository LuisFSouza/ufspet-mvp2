import TextField from "./TextField.js"
import Acao from "./Acao.js"
import { format } from "@react-input/mask"

function GerenciamentoCliente({titulo, subtitulo, botoes, estados, setEstados, visualizacao}){
    const {nome, cpf, email, telefone, endereco} = estados
    const {setNome, setCpf, setEmail, setTelefone, setEndereco} = setEstados


    return (
        <Acao titulo={titulo} subtitulo={subtitulo} botoes={botoes} campos={[
            {component: <TextField visualizacao={visualizacao} setValue={setNome} value={nome} placeholder="Digite o nome do cliente" titulo="Nome do Cliente" tipo="text" id="nomecliente"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setCpf} value={format(cpf, {mask: "___.___.___-__", replacement: { _: /\d/ }})} placeholder="Digite a CPF do cliente" titulo="CPF do Cliente" tipo="text" id="cpfcliente" mask="___.___.___-__" replacement={{ _: /\d/ }}  pattern=".{14,}"/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setEmail} value={email} placeholder="Digite o e-mail do cliente" titulo="E-mail do Cliente" tipo="email" id="emailcliente" pattern=".+@.+\..+" required={false}/>, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setTelefone} value={format(telefone, {mask: "(__)_____-____", replacement: { _: /\d/ }})} placeholder="Digite o telefone do cliente" titulo="Telefone do Cliente" tipo="text" id="telefonecliente" mask="(__)_____-____" replacement={{ _: /\d/ }} pattern=".{14,}" />, buttonSupport: false},
            {component: <TextField visualizacao={visualizacao} setValue={setEndereco} value={endereco} placeholder="Digite o endereço do cliente" titulo="Endereço do Cliente" tipo="textarea" id="enderecocliente"/>, buttonSupport: false}
        ]}
    />
    )
}

export default GerenciamentoCliente