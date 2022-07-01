import './modal.css';
import { FiXOctagon } from 'react-icons/fi';

export default function Modal({content, close, styleStatus}) {
    return (
        <div className="modal">
            <div className="container">
                <button className="close"
                        onClick={close}>
                            <FiXOctagon size={17}/> 
                            Voltar
                </button>

                <div>
                    <h2>Detalhes do Chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: 
                            <a>{content.client}</a>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Assunto: 
                            <a>{content.subject}</a>
                            </span>
                        <span>
                            Cadastrado em: 
                            <a>{content.createdFormated}</a>
                        </span>
                    </div>
                    <div className="row">
                        <span>
                            Status: 
                            <a className="status"
                               style={{backgroundColor: styleStatus(content.status)}}>
                                     {content.status}
                            </a>
                        </span>
                    </div>
                    {content.complement && 
                        <>
                            <h3>Complemento:</h3>
                            <p>{content.complement}</p>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}