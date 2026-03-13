import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '' })

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const data = await login(formData)
        console.log(data)
        localStorage.setItem("user_id", data.user_id)
        localStorage.setItem("username", data.username)
        navigate("/dashboard")
}

    return (
        <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url('/homepage-background.png')`, fontFamily: "'Cinzel', serif" }}
        >
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap"
            rel="stylesheet"
        />
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">Log In</h1>
            <div className="flex flex-col gap-3 w-full">
            {['email', 'password'].map((field) => (
                <input
                key={field}
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                placeholder={field}
                value={formData[field]}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
                />
            ))}
            <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors mt-2"
            >
                Log In
            </button>
            <button
                onClick={() => navigate('/')}
                className="text-white/70 hover:text-white text-sm transition-colors"
            >
                Back
            </button>
            </div>
        </div>
        </div>
    )
}