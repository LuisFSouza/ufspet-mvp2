import {useEffect, useState} from "react"
import axios from "axios"
import {MdOutlineFileDownload} from "react-icons/md";
import Button from "./Button";
import {useLocation} from 'react-router'
import Cabecalho from "./Cabecalho";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import {Line} from 'react-chartjs-2';


import './Relatorio.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


/*const options = {
    responsive: true,
    plugins: {
        legend: {position: 'top'},
        title: {display: true, text: 'Chart.js Example'},
    },
};
*/
function Relatorio() {


    const [message, setMessage] = useState(null)


    const [dadosRelatorio, setDadosRelatorio] = useState([])
    const [vendasInfo, setVendasInfo] = useState([])
    const buttonBaixarRelatorio = async () => {
        const body = document.getElementById("infos");

        const canvas = await html2canvas(body);

        const image = canvas.toDataURL('image/png');

        const pdfrelatorio = new jsPDF("p", "mm", "a4");
        const largura = pdfrelatorio.internal.pageSize.getWidth();
        const altura = (canvas.height * largura)/canvas.width;

        pdfrelatorio.addImage(image, "PNG", 0, 0, largura, altura);
        pdfrelatorio.save("vendasrelatorio.pdf")
    }


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/vendas/find/${new Date().getFullYear()}`).then((resposta) => {
            setDadosRelatorio(resposta.data)
            setVendasInfo(resposta.data[0].vendasInfo)
        }).catch((erro) => {
            if (erro.response) {
                setMessage({'tipo': 'erro', 'mensagem': erro.response.data.message})
            } else {
                setMessage({'tipo': 'erro', 'mensagem': "Não foi possivel se conectar com o servidor"})
            }
        })
    }, [])


    const location = useLocation()
    useEffect(() => {
        if (location.state?.mensagem) {
            setMessage({tipo: location.state.tipo, mensagem: location.state.mensagem})
            window.history.replaceState({}, document.title)

            const timer = setTimeout(() => {
                setMessage(null)
            }, 10000);

            return () => clearTimeout(timer)
        }
    }, [location])


    return (

        <div className="mt-5 position-relative">
            {message && message.tipo === 'sucesso' ? (
                <div class="container alert alert-success text-center mt-5" role="alert">
                    {message.mensagem}
                </div>) : message && message.tipo === 'erro' ? (
                <div class="container alert alert-danger text-center mt-5" role="alert">
                    {message.mensagem}
                </div>) : (<></>)}

            <div className="container pe-auto">
                <div className="d-flex justify-content-between ">
                    <div>
                        <Cabecalho titulo="Relatório de Vendas"/>
                    </div>
                    <div className="d-flex gap-3 align-items-center">
                        <Button cor="#4AA6FF" handleClick={buttonBaixarRelatorio} texto="Baixar" tipo="button"
                                icone={<MdOutlineFileDownload fontSize={24} color="#ffffff"/>} corTexto="#ffffff"
                                direcao="row" sombra={true}/>
                    </div>
                </div>
                
                <div id="infos">
                <div className="container">{dadosRelatorio.map((item, index) => (
                    <div key={index}>
                        <div className="row g-2">
                            <div className="card pt-3 ps-3" id="receita">
                                <h5>Receita</h5>
                                <div className="card-body pt-0" id="valor">{`R$ ${Number(item.receita).toFixed(2).replace('.', ',')}`}</div>
                            </div>
                            <div className="card ms-2 pt-3 ps-3" id="receita">
                                <h5>Quantidade vendida</h5>
                                <div className="card-body pt-0" id="valor">{item.quantidade}</div>
                            </div>
                        </div>
                    </div>
                ))}</div>

                <div className="card ms-2 mt-5 pt-3 ps-3 pb-5" id="receita2">
                    <h5>Receita Anual</h5>

                        <Line data={{
                            labels: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
                            datasets: [
                                {
                                    data: vendasInfo.map((item) => item.salesTotal),
                                    borderColor: 'rgb(111,145,127)',
                                    tension: 0.1,
                                },
                            ],
                        }} options={{
                            responsive: true,
                            plugins: {
                                legend: {display: false},
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        drawOnChartArea:false
                                    }
                                },
                                x: {
                                    grid: {
                                        drawOnChartArea:false
                                    }
                                }
                            },
                            pointRadius: 5,
                            backgroundColor: "rgb(111,145,127)",
                            maintainAspectRatio: false,
                            events: []

                        }}/>

                </div>
                </div>

            </div>
        </div>

    )
}


export default Relatorio