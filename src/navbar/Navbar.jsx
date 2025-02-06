import './Navbar.css'
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';

export default function Navbar() {
  return (
    <nav id="navbar-example2" className="navbar navbar-expand-lg px-3 position-fixed top-0 end-0 start-0 z-1 bg-black bg-opacity-50">
    <div className="container p-2">
        <div className='w-50'>
      <a className="navbar-brand text-white fs-2 fw-semibold" href="#">To Do List</a>
        </div>
        {/* toogle button */}

      <ToggleButton className="navbar-toggler border-0" value="justify" aria-label="justified"data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" >
        <FormatAlignJustifyIcon />
      </ToggleButton>
      <div className="collapse navbar-collapse justify-content-evenly" id="navbarSupportedContent">
      <ul className="nav nav-pills d-flex justify-content-between">    
        <li className="nav-item">
          <a className="heading nav-link fw-semibold text-white position-relative" >Profile</a>
        </li>
        <li className="nav-item">
          <a className="heading nav-link fw-semibold text-white position-relative" onClick={All}>All</a>
        </li>
        <li className="nav-item">
          <button className="heading nav-link fw-semibold text-white position-relative" onClick={Done}>Done</button>
        </li>
        <li className="nav-item">
          <button className="heading nav-link fw-semibold text-white position-relative" onClick={OnProgress} >On Progress</button>
        </li>
        <li className="nav-item">
          <a className="heading nav-link fw-semibold text-white position-relative" >Settings</a>
        </li>
      </ul>
      <button className="btn btn-danger my-3" onClick={Logout}>Logout</button>
      </div>
    </div>
  </nav>
  )
}
function Logout(){
    window.location.href ='../login'
}
function All(){
    window.location.href ='../TodoApp'
}
function Done(){
    window.location.href ='../Done'
}
function OnProgress(){
    window.location.href ='../OnProgress'
}


