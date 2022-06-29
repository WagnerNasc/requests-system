import { useState } from 'react';
import firebase from '../../services/firebaseConnection';

import './customers.css';
import Header from '../../components/Header';
import Title from '../../components/Title';

import { FiSettings } from "react-icons/fi";
import { toast } from 'react-toastify';

export default function Customers() {
    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [address, setAddress] = useState('');

    async function handleAdd(e) {
        e.preventDefault();
        
        if(companyName !== '' && cnpj !== '' && address !== '') {
            await firebase.firestore().collection('customers')
            .add({ 
                companyName: companyName,
                cnpj: cnpj,
                address: address
            })
            .then(()=> {
                setCompanyName('');
                setCnpj('');
                setAddress('');
                toast.info('Empresa cadastrada com Sucesso!'); 
            })
            .catch((err) => {
                console.log(err);
                toast.error('Erro ao cadastrar a empresa!');
            })
        } else {
            toast.error('Preencha todos os Campos!');
        }
    }
    

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Clientes">
                    <FiSettings size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile customers" onSubmit={handleAdd}>
                        <label>Nome do Clientes</label>
                        <input type="text" placeholder="Nome da sua empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
                        
                        <label>CNPJ</label>
                        <input type="text" placeholder="CNPJ da empresa" value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>
                        
                        <label>Endereço</label>
                        <input type="text" placeholder="CNPJ da empresa" value={address} onChange={(e) => setAddress(e.target.value)}/>
                        
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}