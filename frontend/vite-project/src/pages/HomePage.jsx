import { useNavigate } from 'react-router-dom'

    export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url('/homepage-background.png')`, fontFamily: "'Cinzel', serif" }}
        >
        <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
            <div className="flex flex-col items-center gap-3">
            <h1 className="text-5xl font-bold text-white">World-Building Assistant</h1>
            <p className="text-xl font-light text-white">The intelligent backbone of your universe</p>
            </div>
            <div className="flex gap-4">
            <button
                onClick={() => navigate('/create-account')}
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
            >
                Create Account
            </button>
            <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
            >
                Log In
            </button>
            </div>
        </div>
        </div>
    )
    }