import React, { useState } from "react"
import useRoutes from "../routes"


///console.log(useRoutes())

export default function botao(props) {
    const { testeApi, rota }= useRoutes()
    const [data, setData] = useState(null)

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/rota')
            const result = await response.json()
            setData(result)
            console.log(result)
        } catch(error) {
            console.error("Erro ao acessar API: ", error)
        }
    }

    return (
        <>
            <button className="btn btn-primary" onClick={fetchData} >BTN Teste</button>

            {data && (
                <div>
                    <h3>resultado api</h3>
                    <pre>
                        algum outro texto por aqui..
                        {JSON.stringify(data, null, 2)}
                    </pre>
                </div>
            )}
        </>
    )
}