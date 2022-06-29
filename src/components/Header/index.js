import './header.css';
import { AuthContext } from '../../contexts/auth';
import { useContext } from 'react';
import avatar from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function Header() {
    const { user, signOut } = useContext(AuthContext);
    return(
        <div className="sidebar">
            <div className="image">
                <img src={ user.avatarUrl === null ? avatar : user.avatarUrl } alt="Foto Samer" />
            </div>
            <div className="menu">
                <div className="menu-itens-top">
                    <Link to="/profile">
                        <FiUser color="#f94d4b" size={24}/>
                        Perfil
                    </Link>
                    <Link to="/dashboard">
                        <FiHome color="#f94d4b" size={24}/>
                        Chamados
                    </Link>
                    <Link to="/customers">
                        <FiSettings color="#f94d4b" size={24}/>
                        Clientes
                    </Link>
                </div>
                <div className="menu-itens-bot">
                    <a className="logout-btn" onClick={() => signOut()}>
                        <FiLogOut color="#f94d4b" size={24}/>
                        Sair
                    </a>
                </div>
            </div>
        </div>
    )
}