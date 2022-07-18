import { createContext, useState, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast} from 'react-toastify'

export const AuthContext = createContext({});

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        function loadStorage() {
            const storageUser = localStorage.getItem('SistemaUser');

            if (storageUser) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadStorage();
    }, [])

    async function signUp(email, password, nome, telefone) {
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        nome: nome,
                        avatarUrl: null  //avatar nulo
                    }).then(() => {
                        let data = {
                            uid: uid,
                            nome: nome,
                            email: value.user.email,
                            telefone: telefone,
                            avatarUrl: null
                        };
                        setUser(data);  //salva no useState os dados do user
                        storageUser(data);  //salva no localStorage também
                        setLoadingAuth(false);
                        toast.success('Cadastro realizado com sucesso! :)')
                    })
            }).catch((error) => {
                console.log(error);
                toast.error('Oops, dados incorretos!')
                setLoadingAuth(false);
            })
    }

    function storageUser(data) {
        localStorage.setItem('SistemaUser', JSON.stringify(data));
    }

    //fazer login
    async function signIn(email, password) {
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                //vai la no firebase e busca as informações do usuário com o uid acima
                const userProfile = await firebase.firestore().collection('users')
                    .doc(uid).get();

                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    avatarUrl: userProfile.data().avatarUrl,
                    email: value.user.email,
                    telefone: value.user.telefone
                }
                setUser(data);  //salva no useState os dados do user
                storageUser(data);  //salva no localStorage também
                setLoadingAuth(false);
                toast.success('Bem vindo(a) a plataforma! :)')

            })
            .catch((error) => {
                console.log(error);
                toast.error('Oops, algo deu errado!')
                setLoadingAuth(false);
            })
    }

    async function signOut() {
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ signed: !!user,
             user,
              loading,
               signUp, 
               signOut,
                signIn,
                 loadingAuth,
                 setUser,
                 storageUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;