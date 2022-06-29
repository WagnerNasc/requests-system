import { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/new_logo.png';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault();

    if(name !== '' && email !== '' && password !== '') {
      signUp(email, password, name);

    }
  }

    return (
      <div className="container-center">
        <div className="login">
          <div className="login-area"> 
            <img src={logo} alt="Logo do Sistema"/>
          </div>

          <form onSubmit={handleSubmit}>
            <h1>Cadastrar</h1>
            <input type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}/>
            <input type="text" placeholder="email@email.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="*******" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
          </form>

          <Link to="/">Já tem um conta? Entre</Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;
  