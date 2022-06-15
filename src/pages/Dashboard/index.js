import { useContext } from "react"
import { AuthContext } from '../../contexts/auth'

export default function Dashboard() {

    const { signOut } = useContext(AuthContext);
    return (
        <div>
            <h1>Página dashboard</h1>
            <button onClick={() => signOut()}>Sair da conta</button>
        </div>
    )
}