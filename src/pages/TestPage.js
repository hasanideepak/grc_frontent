import { lazy, useContext } from "react"
import Loader from "../components/partials/Loader"
import { LayoutContext } from "../ContextProviders/LayoutContext"

const TestPage = (props) => {
  const {showLoader,setShowLoader} = useContext(LayoutContext)
  console.log(showLoader,setShowLoader)
  const toggleLoader = () =>{
    let toggle = showLoader ? !showLoader : showLoader;
    console.log(showLoader)
    setShowLoader(toggle)
  }
  return (
    <>
      <button onClick={()=> toggleLoader() }>Toggle loader</button>
      <Loader showLoader={showLoader} />
    </> 
  )
}

export default TestPage