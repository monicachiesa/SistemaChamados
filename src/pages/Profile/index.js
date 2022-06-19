import { useState, useContext } from 'react'
import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'

import { AuthContext } from '../../contexts/auth'

export default function Profile() {

    const { user, signOut } = useContext(AuthContext);
    //se tiver uma das propriedades setadas, vai atribuiir
    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name="Meu perfil">
                    <FiSettings size={25} />
                </Title>

                <div className="container">
                    <form className='form-profile'>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25} />
                            </span>
                            <input type="file" accept="image/*" />
                            {avatarUrl === null ?
                                <img src={avatar} width="250" height="250
                           " alt="Foto de perfil" />
                                :
                                <img src={avatarUrl} width="250" height="250
                           " alt="Foto de perfil" />}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>E-mail</label>
                        <input type="text" value={email} disabled="true" />

                        <button type="submit">
                            Salvar
                        </button>
                    </form>
                    </div>
                    <div className='container'>
                        <button 
                        onClick={(() => signOut())}
                        className='logout-btn'>Sair</button>
                    </div>                
            </div>
        </div>
    )
}