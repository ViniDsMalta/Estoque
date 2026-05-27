import { EstoqueProvider} from "./context/EstoqueContext"
import FormProduto from "./components/FormProduto"
import TabelaProdutos from "./components/TabelaProduto"


export default function app(){
  return (
  <EstoqueProvider> 
    <h1>Controle de Estoque</h1>
    <FormProduto/>
    <TabelaProdutos/>
  </EstoqueProvider>)
}