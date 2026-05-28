import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let client = null

export const connectSocket = (onMessage) => {
  const token = localStorage.getItem('token')

  client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    onConnect: () => {
      console.log('WebSocket подключён!')
      client.subscribe('/topic/messages', (message) => {
        console.log('Получено сообщение:', message.body)
        onMessage(JSON.parse(message.body))
      })
    },
    onStompError: (frame) => {
      console.error('STOMP ошибка:', frame)
    },
    onDisconnect: () => {
      console.log('WebSocket отключён')
    },
    onWebSocketError: (error) => {
      console.error('WebSocket ошибка:', error)
    },
  })
  client.activate()
}

export const sendSocketMessage = (content) => {
  const token = localStorage.getItem('token')
  console.log('Отправка:', content, 'connected:', client?.connected)
  if (client?.connected) {
    client.publish({
      destination: '/app/chat.send',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
  } else {
    console.error('WebSocket не подключён!')
  }
}

export const disconnectSocket = () => {
  client?.deactivate()
}