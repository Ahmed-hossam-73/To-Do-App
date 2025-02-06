
import Done from "./Done/Done";
import Layout from "./Layout/Layout";
import Login from "./login/Login"
import OnProgress from "./OnProgress/OnProgress";
import Sign from "./SignUP/Sign";
import TodoApp from "./TodoApp/TodoApp";
import { createBrowserRouter , RouterProvider } from "react-router-dom";
function App() {
  let routes= createBrowserRouter([
    {
      path:"",
      element:<Layout/>,
      children:[
        {path:"",element:<Login/>},
        {path:"Login",element:<Login/>},
        {path:"Sign",element:<Sign/>},
        {path:"TodoApp",element:<TodoApp/>},
        {path:"Done",element:<Done/>},
        {path:"OnProgress",element:<OnProgress/>},
      ]
    }
  ])
  return (<>
  <RouterProvider router={routes}/>
   </>
  )
}

export default App
