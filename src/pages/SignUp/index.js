import { useState, UseState, useContext } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { AuthContext } from '../../contexts/auth'
import validator from 'validator'
import { toast } from 'react-toastify'

function SignUp() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSubmit(e) {
    e.preventDefault(); //para não atualizar a página

    if (nome == '') {
      toast.error('Digite o seu nome!')
    } 
    if (email == '') {
      toast.error('Digite o seu e-mail!')
    }

    if (!validator.isEmail(email)) {
      toast.error('Digite um e-mail válido!')
    }
    
    if (password == '') {
      toast.error('Digite a sua senha!')
    }

    if (nome !== '' & email !== '' & password !== '') {
      signUp(email, password, nome, telefone); //precisa ser na ordem que está no auth
    }
  }

  return (
    <div className="container-center">
      <div className='login'>
        <div className='login-area'>
          <img src={logo} alt="Sistema Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <h1>Cadastrar</h1>
          <input type="text" placeholder='Seu nome' value={nome} onChange={(e) => setNome(e.target.value)} />
          <input type="text" placeholder='Seu e-mail: Ex: email@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="text" placeholder='Seu telefone: Ex: (51) 9999-9999' value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <input type="password" placeholder='Sua senha' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">{loadingAuth ? 'Carregando...' :'Cadastrar'}</button>
        </form>

        <Link to="/">Já tem uma conta? Faça login</Link>
      </div>
    </div>
  );
}

export default SignUp;
