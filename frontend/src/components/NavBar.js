import { Link, useLocation } from "react-router";
import './NavBar.css'
import { useEffect, useRef } from "react";

function NavBar() {
    const itemAtual = useRef(null)

    const location =  useLocation();
    useEffect(() => {
        const pathName = location.pathname;
        const base = pathName.split("/")[1]

        const item = document.getElementById(base)
        if(item){
            if(itemAtual.current){
                itemAtual.current.style.cssText = 'a:hover {color: #000000}'
                
            }
            itemAtual.current = item
            item.style.cssText = 'background-color: #FFFFFF; color: #6F917F !important;'
        }
    }, [location])

    return (
        <nav className="navbar navbar-expand-lg py-3" style={{backgroundColor: '#6F917F'}}>
        <div className="container-fluid">
            <a href="/">
                <img alt="" src="/logo_ufspet_1.svg"></img>
                <img alt="" src="/logo_ufspet_2.svg"></img>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="justify-content-end collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav gap-4 fs-4">
                <li className="nav-item" >
                <Link to="/produtos" id="produtos" className="nav-link rounded-2">Produtos</Link>
                </li>
                <li className="nav-item" >
                <Link to="/vendas" id="vendas" className="nav-link rounded-2">Vendas</Link>
                </li>
                <li className="nav-item" >
                <Link to="/agendamentos" id="agendamentos" className="nav-link rounded-2">Agendamentos</Link>
                </li>
                <li className="nav-item" >
                <Link to="/servicos" id="servicos" className="nav-link rounded-2" >Serviços</Link>
                </li>
                <li className="nav-item" >
                <Link to="/clientes" id="clientes" className="nav-link rounded-2" >Clientes</Link>
                </li>
                <li className="nav-item" >
                <Link  to="/estoque" id="estoque" className="nav-link rounded-2">Estoque</Link>
                </li>
            </ul>
            </div>
        </div>
        </nav>
    )
}
export default NavBar