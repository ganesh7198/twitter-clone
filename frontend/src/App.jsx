import { Route, Routes } from "react-router-dom"
import Signup from "./uicomponent/pages/Signup"

function App() {
  return (
   <>
  <Routes>
     <Route path="/signup" element={<Signup></Signup>}></Route>
  </Routes>
   </>
  )
}

export default App
