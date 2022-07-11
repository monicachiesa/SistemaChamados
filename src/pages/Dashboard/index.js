import { useState, useEffect } from "react"
import { AuthContext } from '../../contexts/auth'
import Header from "../../components/Header";
import firebase from '../../services/firebaseConnection'
import Title from "../../components/Title";
import './dashboard.css'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc');

export default function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);  //controla quando busca os dados dos chamados
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    // const { signOut } = useContext(AuthContext);

    useEffect(() => {

        loadChamados();  //carrega os chamados

        return () => {

        }
    }, [])

    async function loadChamados() {
        await listRef.limit(5) //busca os primeiros 5 chamados
            .get()
            .then((snapshot) => {
                updateState(snapshot);
            })
            .catch((err) => {
                console.log("Erro ao buscar chamados!", err);
                setLoadingMore(false);
            })
        setLoading(false);
    }

    async function updateState(snapshot) {
        const isEmpty = snapshot.size === 0;

        if (!isEmpty) {
            let lista = [];
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    status: doc.data().status,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];  //pegando o ultimo documento buscado
            setChamados(chamados => [
                ...chamados, ...lista
            ]);
            setLastDocs(lastDoc);
        } else {
            setIsEmpty(true); //está vazio
        }
        setLoadingMore(false);
    }

    if (loading) {
        return (<div>
            <Header />

            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>

                <div className="container dashboard">
                    <span>Buscando chamados...</span>
                </div>
            </div>
        </div>)
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Atendimentos">
                    <FiMessageSquare size={25} />
                </Title>
            </div>
            {chamados.length === 0 ? (
                <div className="container dashboard">
                    <span>Nenhum chamado registrado...</span>
                    <Link to="/new" className="new" >
                        <FiPlus size={25} color="#FFF" />
                        Novo chamado
                    </Link>
                </div>
            ) :
                (
                    <>
                        <Link to="/new" className="new" >
                            <FiPlus size={25} color="#FFF" />
                            Novo chamado
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">Assunto</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Cadastrado em</th>
                                    <th scope="col">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chamados.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td data-label="Cliente">{item.cliente}</td>
                                            <td data-label="Assunto">{item.assunto}</td>
                                            <td data-label="Status">
                                                <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                                            </td>
                                            <td data-label={item.createdFormated}>20/05/2022</td>
                                            <td data-label="#">
                                                <button style={{ backgroundColor: "#3583f6" }} className="action">
                                                    <FiSearch color="#FFF" size={17} />
                                                </button>
                                                <button style={{ backgroundColor: "#f6a935" }} className="action">
                                                    <FiEdit2 color="#FFF" size={17} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                )}
        </div>
    )
}