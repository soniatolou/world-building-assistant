import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/auth'

export default function CreateAccount() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })
    const [repeatPassword, setRepeatPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [emailTakenError, setEmailTakenError] = useState(false)
    const [usernameTakenError, setUsernameTakenError] = useState(false)
    const [missingFieldsError, setMissingFieldsError] = useState(false)

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        if (e.target.name === 'email') { setEmailError(false); setEmailTakenError(false) }
        if (e.target.name === 'username') setUsernameTakenError(false)
        setMissingFieldsError(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const allFilled = Object.values(formData).every(v => v.trim() !== '') && repeatPassword.trim() !== ''
        if (!allFilled) {
            setMissingFieldsError(true)
            return
        }
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        setEmailError(!emailValid)
        const passwordMatch = formData.password === repeatPassword
        setPasswordError(!passwordMatch)
        if (!emailValid || !passwordMatch) return
        const { ok, data } = await register(formData)
        if (!ok) {
            if (data.detail && data.detail.includes('Email already exists')) setEmailTakenError(true)
            if (data.detail && data.detail.includes('Username already taken')) setUsernameTakenError(true)
            return
        }
        navigate('/', { state: { accountCreated: true } })
    }

    return (
        <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url('/homepage-background.png')`, fontFamily: "'Cinzel', serif" }}
        >
        <div className="absolute inset-0 bg-[#080a14]/80 pointer-events-none" />
        <link
            href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap"
            rel="stylesheet"
        />
        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <div className="flex flex-col gap-3 w-full">
            <input
                type="text"
                name="username"
                placeholder="username (required)"
                value={formData.username}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
            />
            {usernameTakenError && (
                <p className="text-red-400 text-sm">Username already taken</p>
            )}
            {['first_name', 'last_name'].map((field) => (
                <input
                key={field}
                type="text"
                name={field}
                placeholder={`${field.replace('_', ' ')} (required)`}
                value={formData[field]}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
                />
            ))}
            <input
                type="text"
                name="email"
                placeholder="email (required)"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
            />
            {emailError && (
                <p className="text-red-400 text-sm">Invalid email address</p>
            )}
            {emailTakenError && (
                <p className="text-red-400 text-sm">There already is an account with that email</p>
            )}
            <input
                type="password"
                name="password"
                placeholder="password (required)"
                value={formData.password}
                onChange={handleChange}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
            />
            <input
                type="password"
                placeholder="Repeat password (required)"
                value={repeatPassword}
                onChange={(e) => { setRepeatPassword(e.target.value); setPasswordError(false); setMissingFieldsError(false) }}
                className="px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 border border-white/40 outline-none focus:border-white"
            />
            {passwordError && (
                <p className="text-red-400 text-sm">Passwords do not match</p>
            )}
            {missingFieldsError && (
                <p className="text-red-400 text-sm">Please fill in all the required fields.</p>
            )}
            <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors mt-2"
            >
                Create Account
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
