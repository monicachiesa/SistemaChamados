import { useState, useEffect, useContext } from 'react'
import './new.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import firebase from '../../services/firebaseConnection'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom';

export default function New() {
    const { id } = useParams();  //parâmetro para passar para o /new
    const history = useHistory();

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const [customers, setCustomers] = useState([]); //Clientes
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [idCustomers, setIdCustomers] = useState(0);  //customer selected
    const [idCustomer, setIdCustomer] = useState(false);  // id do Customer

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
                .get()
                .then((snapshot) => {
                    let lista = [];
                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (lista.length === 0) {
                        console.log("Nenhuma empresa encontrada");
                        setCustomers([{ id: '1', nomeFantasia: '' }]);
                        setLoadingCustomers(false);
                        return;
                    }
                    setCustomers(lista);
                    setLoadingCustomers(false);

                    if (id) {
                        loadId(lista);
                    }

                })
                .catch((error) => {
                    console.log("Erroooooo:", error);
                    setLoadingCustomers(false);
                    setCustomers([{ id: '1', nomeFantasia: '' }]);
                })

        }

        loadCustomers();

    }, [id]);

    async function loadId(lista) {   //entra na rota, e pega o id pra editar
        await firebase.firestore().collection('chamados').doc(id)
            .get()  //achou item
            .then((snapshot) => {
                setAssunto(snapshot.data().assunto);  //preenche os campos
                setStatus(snapshot.data().status);
                setComplemento(snapshot.data().complemento)

                let index = lista.findIndex(item => item.id === snapshot.data().clienteId);
                setIdCustomers(index);
                setIdCustomer(true);  //o item existe!!!!
            }).catch((err) =>{
                console.log("Erro ao editar!!!", err);
                setIdCustomer(false); //item não existe!!!
            })
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {  //alterando os dados se o Id não for nulo
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[idCustomers].nomeFantasia,
                clienteId: customers[idCustomers].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid //pega do context
            })
            .then(() => {
                toast.success('Chamado editado com sucesso!!');
                setComplemento('');
                setCustomers(0);
                history.push('/dashboard') //envia de volta para a tela de chamados
            })
            .catch((err) => {
                toast.error('Ops, erro ao editar chamado!');
                console.log("Erro ao editar O.S", err);
            })

            return;
        }

        await firebase.firestore().collection('chamados')
            .add({
                created: new Date(),
                cliente: customers[idCustomers].nomeFantasia,
                clienteId: customers[idCustomers].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid //pega do context
            })
            .then(() => {
                toast.success('Chamado criado com sucesso!!');
                setComplemento('');
                setIdCustomers(0);
            })
            .catch((err) => {
                toast.error('Ops, erro ao registrar chamado!');
                console.log("Erro ao cadastrar O.S", err);
            })
    }

    function handleChangeSelect(e) {
        setAssunto(e.target.value);
    }

    function handleOptionChange(e) {
        setStatus(e.target.value);
    }

    function handleChangeCustomers(e) {
        setIdCustomers(e.target.value);
    }

    return (
        <div>
            <Header />

            <div className='content'>
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>
                        {loadingCustomers ? (
                            <input type="text" disabled="true" value="Carregando clientes" />
                        ) : (
                            <select value={idCustomers} onChange={handleChangeCustomers}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={index}>{item.nomeFantasia}</option>
                                    )
                                })}
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option key={1} value="Suporte">Suporte</option>
                            <option key={2} value="Visita tecnica">Visita técnica</option>
                            <option key={3} value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input name="radio" checked={status === 'Aberto'} value="Aberto" onChange={handleOptionChange} type="radio" /><span>Em aberto</span>
                            <input name="radio" checked={status === 'Progresso'} value="Progresso" onChange={handleOptionChange} type="radio" /><span>Em progresso</span>
                            <input name="radio" checked={status === 'Atendido'} value="Atendido" onChange={handleOptionChange} type="radio" /><span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} placeholder='Descreva o seu problema (opcional)' />

                        <button type="submit">Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}