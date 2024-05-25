import { BrowserRouter,Routes,Route,Switch,Redirect } from "react-router-dom"; 
import Homepage from "./pages/Homepage";
import Editorpage from "./pages/Editorpage";
import { v4 } from "uuid";
import toast,{Toaster} from "react-hot-toast";

function App() {
  return (
    <>
    <div>
    <Toaster
  position="top-right"
  reverseOrder={false}
/>
    </div>
      <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Homepage/>}/>
          
        
        <Route path="/editor/:id" element={<Editorpage/>}/>
        
       
      </Routes>
    
      </BrowserRouter>
      </>
    
 
  );
}

export default App;
