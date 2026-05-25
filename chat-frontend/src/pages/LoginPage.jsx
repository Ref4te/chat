import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/api'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      navigate('/chat')
    } catch {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-white text-2xl font-bold mb-6 text-center">Войти в чат</h1>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Войти
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-blue-400 hover:underline">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}