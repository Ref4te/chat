import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let client = null

export const connectSocket = (onMessage) => {
  client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    reconnectDelay: 3000,
    onConnect: () => {
      client.subscribe('/topic/messages', (message) => {
        onMessage(JSON.parse(message.body))
      })
    },
  })
  client.activate()
}

export const sendSocketMessage = (content, type = 'TEXT') => {
  if (client?.connected) {
    client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ content, type }),
    })
  }
}

export const disconnectSocket = () => {
  client?.deactivate()
}
