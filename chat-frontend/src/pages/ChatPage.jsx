import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { connectSocket, disconnectSocket, sendSocketMessage } from '../services/socket'

const emojiList = ['😀', '😂', '😍', '👍', '🔥', '🎉', '❤️']

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  const currentUser = useMemo(() => localStorage.getItem('username'), [])

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }

    API.get('/api/messages').then((res) => setMessages(res.data))
    connectSocket((message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => disconnectSocket()
  }, [navigate])

  const sendMessage = (e) => {
    e.preventDefault()
    const trimmed = content.trim()
    if (!trimmed) return
    sendSocketMessage(trimmed)
    setContent('')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <header className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Групповой чат</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">{currentUser}</span>
          <button onClick={logout} className="text-sm bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700">Выйти</button>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`max-w-xl p-3 rounded-xl ${msg.sender === currentUser ? 'ml-auto bg-blue-600' : 'bg-gray-800'}`}>
            <p className="text-xs text-gray-200 mb-1">{msg.sender}</p>
            <p>{msg.content}</p>
          </div>
        ))}
      </main>

      <div className="px-4 py-2 border-t border-gray-800 flex gap-2 overflow-x-auto">
        {emojiList.map((emoji) => (
          <button key={emoji} onClick={() => setContent((prev) => prev + emoji)} className="text-xl">{emoji}</button>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-800 flex gap-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напишите сообщение..."
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 px-5 rounded-xl">Отправить</button>
      </form>
    </div>
  )
}
