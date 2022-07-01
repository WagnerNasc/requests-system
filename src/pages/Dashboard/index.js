import { useState, useEffect } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import './dashboard.css';

import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from "react-icons/fi";

import { Link } from 'react-router-dom';
import firebase from '../../services/firebaseConnection';
import Modal from '../../components/Modal';

const listRef = firebase.firestore().collection('requests').orderBy('created', 'asc');

export default function Dashboard() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false); // para quando clicar para trazer os demais chamados
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {

        async function loadRequest() {
            await listRef.limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((err) => {
                console.log('Ops! Deu ruim, tente mais tarde. ', err);
                setLoadingMore(false);
            })
    
            setLoading(false);
        }

        loadRequest();
        
        return() => {

        }

    }, []);


    async function updateState(snapshot) {
        const isCollectionEmpty = snapshot.size === 0;
        // console.log(isCollectionEmpty);

        if(!isCollectionEmpty) {
            let list = [];

            snapshot.forEach((doc) => {
                list.push({
                    id: doc.id,
                    subject: doc.data().subject,
                    client: doc.data().client,
                    clientId: doc.data().clientId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement
                })
            })
            const lastDoc = snapshot.docs[snapshot.docs.length - 1]; // pega último documento

            setRequests(requests => [...requests, ...list]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true);
        }

        setLoadingMore(false);
    }

    function styleStatus(status) {
        let colorStatus = '';
        if(status === 'Opened') {
            colorStatus = '#5cb85c';
        } else if (status === 'Progress') {
            colorStatus = '#ffdf3f';
        } else {
            colorStatus = '#607FFE';
        }
        return colorStatus
    }

    async function handleMore() {
        setLoadingMore(true);
        console.log(lastDocs);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot)
        })
        .catch((err) => {
            console.log(err);
            toast.error('Ops! Ocorreu um erro, tente mais tarde!');
        })
    }

    function togglePostModal(item) {
        setShowPostModal(!showPostModal);

        console.log(!showPostModal);
        setDetail(item);
    }

    if(loading) {
        
        return (
            <div>
                <Header/>
                <div className="content">
                    <Title name="Chamados">
                        <FiMessageSquare size={25}/>              
                    </Title>
                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    } 

    return (
        <div>
            <Header/>
            <div className="content">
                <Title name="Chamados">
                    <FiMessageSquare size={25}/>              
                </Title>
                    {requests.length === 0 ? (
                        <div className="container dashboard">
                            <span> Nenhum chamado registrado... </span>
    
                            <Link to="/new" className="new">
                                <FiPlus size={25} color="#FFF"/>
                                Novo Chamado
                            </Link>
                        </div>
    
                    ) : (
                        <>
                            <div className="newRequest">
                                <Link to="/new" className="new">
                                    <FiPlus size={25} color="#FFF"/>
                                    Novo Chamado
                                </Link>
                            </div>
    
                            <div className="container dashboard">
                                <table className="table">
                                    <thead>
                                        {/* <caption>teste</caption> */}
                                        <tr>
                                            <th scope="col">Código</th>
                                            <th scope="col">Cliente</th>
                                            <th scope="col">Assunto</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Data Cadastro</th>
                                            <th scope="col">#</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.map((item, index)=> {
                                            return (
                                                <tr key={index}>
                                                    <td data-label="Código">{index + 1}</td>
                                                    <td data-label="Cliente">{item.client}</td>
                                                    <td data-label="Assunto">{item.subject}</td>
                                                    <td data-label="Status">
                                                        <span className="badge" style={{backgroundColor: styleStatus(item.status)}}>{item.status}</span>
                                                    </td>
                                                    <td data-label="Data Cadastro">{item.createdFormated}</td>
                                                    <td data-label="#">
                                                        <button className="action" style={{backgroundColor: '#3A1D71'}} onClick={() => togglePostModal(item)}>
                                                            <FiSearch size={25} color="#FFF"/>
                                                        </button>
                                                        <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f84d4b'}}>
                                                            <FiEdit2 size={25} color="#FFF"/>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando mais chamados...</h3>}
                                {!loadingMore && !isEmpty && 
                                    <div className="pagination">
                                        <button className="btn-more" onClick={handleMore}>Mostrar mais</button>
                                    </div>
                                }
                            </div>
                        </>
                    )}

            </div>
            {showPostModal && (
                <Modal
                    content={detail}
                    close={togglePostModal}
                    styleStatus={styleStatus}
                />
            )}
        </div>
    )
}