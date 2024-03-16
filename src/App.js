import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./Components/Signin";
import { useState } from "react";
import Search from "./Components/Search";
import Canvas from "./Components/Canvas";


function App() {

  const [user, setUser] = useState({
    name : '',
    email : ''
  })
  const [src, setSrc] = useState('')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin user={user} setUser={setUser}/>}/>
        <Route path="/search" element={<Search user={user} setSrc={setSrc}/>} />
        <Route path="/canvas" element={<Canvas src={src}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
