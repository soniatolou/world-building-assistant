import { Routes, Route } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import CreateAccount from './pages/CreateAccount'
import Login from './pages/LogIn'
import Dashboard from './pages/Dashboard'
import CreateWorld from './pages/CreateWord'
import WorldDetail from './pages/WorldDetail'
import Characters from './pages/Characters'
import CreateCharacter from './pages/CreateCharacter'
import CharacterDetail from './pages/CharacterDetail'
import Relationships from './pages/Relationships'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import CreateEvent from './pages/CreateEvent'
import Maps from './pages/Maps'
import MapDetail from './pages/MapDetail'
import CreateMap from './pages/CreateMap'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import CreateLocation from './pages/CreateLocation'
import Profile from './pages/Profile'
import Items from './pages/Items'
import ItemDetail from './pages/ItemDetail'
import CreateItem from './pages/CreateItem'
import SpeciesPage from './pages/Species'
import SpeciesDetail from './pages/SpeciesDetail'
import CreateSpecies from './pages/CreateSpecies'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'

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
      <Route path="/worlds/:worldId/events" element={<Events />} />
      <Route path="/worlds/:worldId/events/create" element={<CreateEvent />} />
      <Route path="/worlds/:worldId/events/:eventId" element={<EventDetail />} />
      <Route path="/worlds/:worldId/maps" element={<Maps />} />
      <Route path="/worlds/:worldId/maps/create" element={<CreateMap />} />
      <Route path="/worlds/:worldId/maps/:mapId" element={<MapDetail />} />
      <Route path="/worlds/:worldId/locations" element={<Locations />} />
      <Route path="/worlds/:worldId/locations/create" element={<CreateLocation />} />
      <Route path="/worlds/:worldId/locations/:locationId" element={<LocationDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/worlds/:worldId/items" element={<Items />} />
      <Route path="/worlds/:worldId/items/create" element={<CreateItem />} />
      <Route path="/worlds/:worldId/items/:itemId" element={<ItemDetail />} />
      <Route path="/worlds/:worldId/species" element={<SpeciesPage />} />
      <Route path="/worlds/:worldId/species/create" element={<CreateSpecies />} />
      <Route path="/worlds/:worldId/species/:speciesId" element={<SpeciesDetail />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:notesId" element={<NoteDetail />} />
    </Routes>
  )
}
