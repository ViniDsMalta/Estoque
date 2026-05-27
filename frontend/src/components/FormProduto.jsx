import { useContext, useState } from "react";
import { EstoqueContext } from "../context/EstoqueContext"


export default function FormProduto(){
    const { adicionarProduto} = useContext(EstoqueContext)

    const [nome,setNome] = useState("")
    const [quantidade, setQuantidade] = useState("")
    const [preco, setPreco] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        adicionarProduto({nome, quantidade, preco})
        setNome("")
        setQuantidade("")
        setPreco("")
    }
    return(
        <form onSubmit={handleSubmit}>
            <input type="text"  placeholder="Nome" value={nome} onChange={(e => setNome(e.target.value))}/>
            <input type="number" placeholder="quantidade" value={quantidade} onChange={(e => setQuantidade(e.target.value))}/>
            <input type="number" placeholder="Preço" value={preco} onChange={(e => setPreco(e.target.value))}/>
            <button type="submit">Cadastrar</button>
        </form>
        
    )
}