import { createContext, useState, useEffect } from "react"
import axios from "axios"

export const EstoqueContext = createContext()

export function EstoqueProvider({children}){
    const [produtos, setProdutos] = useState([])

    const API = "http://localhost:5000/api/produtos"

    const buscarProduto = async() => {
        const res = await axios.get(API)
        setProdutos(res.data)
    }
    const adicionarProduto = async(produto) => {
        await axios.post(API, produto)
        buscarProduto()
    }
    const removerProduto = async(id, produto) => {
        await axios.delete(`${API}/${id}`)
        buscarProduto()
    }
    const atualizarProduto = async(id, produto) => {
        await axios.put(`${API}/${id}`, produto)
        buscarProduto()
    }
    useEffect(() => { buscarProduto() }, [])

    return(
        <EstoqueContext.Provider value={{produtos, adicionarProduto, atualizarProduto, removerProduto}}>
            {children}
        </EstoqueContext.Provider>
    )
}

