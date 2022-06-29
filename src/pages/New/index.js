import { useState, useEffect, useContext } from 'react';
import firebase from '../../services/firebaseConnection';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import './new.css';

import { FiPlusCircle } from "react-icons/fi";
import { toast } from 'react-toastify';

export default function New() {
    const [ subject, setSubject ] = useState('Support');
    const [ status, setStatus ] = useState('Opened');
    const [ complement, setComplement ] = useState('');

    const [ loadCustomers, setLoadCustomers ] = useState(true);
    const [ customers, setCustomers ] = useState([]); // clientes
    const [ customerSelected, setCustomerSelected ] = useState(0); // para alterar o select
    
    const { user } = useContext(AuthContext); // trazer o usuário

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let list = [];

                snapshot.forEach((item) => {
                    list.push({
                        id: item.id,
                        companyName: item.data().companyName
                    })
                })

                if(list.length === 0) {
                    console.log('Nenhuma empresa encontrada');

                    /* CLIENTE FICTICIO PARA NAO GERAR ERRO */
                    setCustomers([ { 
                        id: '1', 
                        companyName: 'Freela' 
                    }])

                    setLoadCustomers(false);
                    return;
                }
                setCustomers(list);
                setLoadCustomers(false);
            })
            .catch((err) => {
                console.log(err);
                toast.error('Ops! Algo deu errado, tente novamente mais tarde!');
                setLoadCustomers(false);
                /* CLIENTE FICTICIO PARA NAO GERAR ERRO */
                setCustomers([ { 
                    id: '1', 
                    companyName: '' 
                }])
            })
        }
        loadCustomers();
    }, [])


    /* Chama quando a Option for aterada no Select */
    function handleChangeCustomers(e) {
        // console.log('INDEX DO CLIENTE SELECIONADO:  ', e.target.value);
        // console.log('Cliente selecionado ', customers[e.target.value]);
        setCustomerSelected(e.target.value);

    }

    async function handleRegister(e) {
        e.preventDefault();
        
        await firebase.firestore().collection('requests')
        .add({
            created: new Date(),
            client:  customers[customerSelected].companyName,
            clientId: customers[customerSelected].id,
            subject: subject,
            status: status,
            complement: complement,
            userId: user.uid
        })
        .then(() => {
            toast.success('Chamado criado com sucesso!');
            setComplement('');
            setCustomerSelected([0]);
        })
        .catch((err) => {
            console.log(err);
            toast.error('Ops! Erro ao registrar, tente mais tarde!');
        })
    }
    
    /* Chama quando troca o Assunto */
    function handleChangeSelect(e) {
        setSubject(e.target.value);
    }

    /* Chama quando troca o Status */
    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Criar Novo Chamado">
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile form-new" onSubmit={handleRegister}>
                        <label>Cliente<span style={{color: '#ff0000'}}>*</span></label>
                        {loadCustomers ? (
                            <input type="text" disabled={true} value="Carregando clientes..."/>
                        ) : (

                        <select className="clients"
                                value={customerSelected}
                                onChange={handleChangeCustomers}>

                            {
                                customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>
                                            {item.companyName}
                                        </option>
                                    )
                                })
                            }
                        </select>

                        )}

                        <label>Assunto<span style={{color: '#ff0000'}}>*</span></label>
                        <select className="subject" value={subject} onChange={handleChangeSelect}>
                            <option value="Support">Suporte Setor</option>
                            <option value="Scrum">Scrum</option>
                            <option value="Chapter">Suporte Líder</option>
                        </select>
                        
                        <label>Status<span style={{color: '#ff0000'}}>*</span></label>
                        <div className="status">
                            <input type="radio" 
                                  className="opened"
                                  value="Opened"
                                  name="radio"
                                //   defaultChecked={{checked: true}}
                                  checked={ status === 'Opened'}
                                  onChange={handleOptionChange}/>
                            <span>Em aberto</span>
                            
                            <input type="radio" 
                                   className="concluded"
                                   value="Concluded"
                                   name="radio"
                                   checked={ status === 'Concluded'}
                                   onChange={handleOptionChange}/>
                            <span>Atendido</span>

                            <input type="radio" 
                                    className="inprogress"
                                   value="Progress"
                                   name="radio"
                                   checked={ status === 'Progress'}
                                   onChange={handleOptionChange}/>
                            <span>Em Progresso</span>
                        </div>


                        <label>Complemento<span style={{color: '#ff0000'}}>*</span></label>
                        <textarea className="complement"
                                  type="text"
                                  placeholder="Descreva sua solicitação (opcional)"
                                  value={complement}
                                  onChange={(e) => setComplement(e.target.value)}
                        />

                        <button type="submit">Salvar</button>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}