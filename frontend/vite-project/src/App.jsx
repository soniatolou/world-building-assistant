import { Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import CreateAccount from './pages/CreateAccount'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateWorld from './pages/CreateWord'
import WorldDetail from './pages/WorldDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-world" element={<CreateWorld />} />
      <Route path="/worlds/:worldId" element={<WorldDetail />} />
    </Routes>
  )
}
