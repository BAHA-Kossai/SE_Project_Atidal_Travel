import React from 'react'
import ReactDOM from 'react-dom/client'
import { supabase } from './config/supabase.js'

function App() {
  console.log(supabase); 
  return (
    <div>
      <h1>This is the home page</h1>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)