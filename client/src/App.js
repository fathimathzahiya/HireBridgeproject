import React from 'react'
import './App.css';
import DOM from './DOM/DOM';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
     <div>
        <DOM/>
      {/* Navbar intentionally removed to avoid unused import warning */}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
     </div>
  );
}

export default App;
