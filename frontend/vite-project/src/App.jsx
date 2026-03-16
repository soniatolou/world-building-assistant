import { Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import CreateAccount from './pages/CreateAccount'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateWorld from './pages/CreateWord'
import WorldDetail from './pages/WorldDetail'
import Characters from './pages/Characters'
import CreateCharacter from './pages/CreateCharacter'
import CharacterDetail from './pages/CharacterDetail'
import Relationships from './pages/Relationships'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-world" element={<CreateWorld />} />
      <Route path="/worlds/:worldId" element={<WorldDetail />} />
      <Route path="/worlds/:worldId/characters" element={<Characters />} />
      <Route path="/worlds/:worldId/characters/create" element={<CreateCharacter />} />
      <Route path="/worlds/:worldId/characters/:characterId" element={<CharacterDetail />} />
      <Route path="/worlds/:worldId/relationships" element={<Relationships />} />
    </Routes>
  )
}
