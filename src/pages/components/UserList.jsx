import { useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import axios from "axios"



export default function UserAdmin() {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    const [userList, setUserList] = useState("")
    
    const getUserList = async () => {
        console.log("----getUserList----")

        try {
            const response = await axios.post(`${url}/api/useraccount/`)
            response?.data.length > 0 && setUserList(response.data)
        } catch(err) {
            console.error("Erro ao listar usuários: ", err)
        }
    }

    const userPasswordUpdate = async (user) => {
        console.log("----userPasswordUpdate----")

        try {
            const response = await axios.post(`${url}/api/useraccount/password-update`, {userId: user._id})
            console.log("respone: ", response.data)
        } catch(err) {
            console.error("Erro ao atualizar password do usuário: ", err)
        }
        
    }

    useEffect(()=> {
        getUserList()

    }, [])


    


    return (
        <>
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>ID</th>
                            <th>UserName</th>
                            <th>Email</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Data Criação</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userList?.length > 0 && (
                                userList.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="avatar">
                                                <div className="w-16 rounded-full">
                                                    <img src={user.avatarImage} />
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user._id}</td>
                                        <td>{user.userName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{format(user.createdAt, "dd/mm/yyyy - HH:mm:ss") }</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={()=> userPasswordUpdate(user)}>Alterar Senha</button><br/>
                                            <input type="text" className="input input-sm w-full bg-neutral" />
                                        </td>
                                    </tr>
                                ))        
                            )
                        }
                        
                    </tbody>
                    

                </table>
            </div>
        </>
    )

}