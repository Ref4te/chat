import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { connectSocket, sendSocketMessage, disconnectSocket } from '../services/socket'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const username = localStorage.getItem('username')
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  useEffect(() => {
    // Загрузить историю сообщений
    API.get('/api/messages').then(res => setMessages(res.data))

    // Подключить WebSocket
    connectSocket((newMessage) => {
      setMessages(prev => [...prev, newMessage])
    })

    return () => disconnectSocket()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!text.trim()) return
    sendSocketMessage(text)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    disconnectSocket()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between shadow">
        <h1 className="text-white text-xl font-bold">💬 Чат</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{username}</span>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 text-sm transition"
          >
            Выйти
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg, i) => {
          const isMe = msg.sender?.username === username
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isMe ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
              }`}>
                {!isMe && (
                  <p className="text-blue-400 text-xs font-semibold mb-1">
                    {msg.sender?.username}
                  </p>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-50 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString('ru', {hour: '2-digit', minute: '2-digit'})}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-gray-800 px-4 py-4 flex items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напиши сообщение..."
          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          ➤
        </button>
      </div>
    </div>
  )
}