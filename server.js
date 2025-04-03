// server.js - Corrected for Socket.io 2.3.0
const express = require('express')
const app = express()
const http = require('http').Server(app)
const socketio = require('socket.io')(http)

// Fix MIME type issues
app.get('*.js', function (req, res, next) {
  res.set('Content-Type', 'application/javascript')
  next()
})

// Serve static files from current directory
app.use(express.static('./'))

// Track rooms and connections
const rooms = {
  'gentle-monster': { users: {} },
  'junya-invite': { users: {} },
  'junya-runway': { users: {} },
  'marc-jacobs': { users: {} },
  'martine-rose': { users: {} },
}

// Handle socket connections
socketio.on('connection', (socket) => {
  const clientId = socket.id
  console.log(`[SERVER] User connected: ${clientId}`)

  let currentRoom = null

  // Handle room join requests
  socket.on('joinRoom', (roomName) => {
    currentRoom = roomName
    socket.join(roomName)

    if (rooms[roomName]) {
      // Add user to room tracking
      rooms[roomName].users[clientId] = {
        joinTime: Date.now(),
      }

      console.log(`[SERVER] User ${clientId} joined room: ${roomName}`)
      console.log(
        `[SERVER] Room ${roomName} now has ${
          Object.keys(rooms[roomName].users).length
        } users`
      )

      // Notify other clients in room about new user
      socket.to(roomName).emit('userJoined', { id: clientId })

      // Send list of existing users to new client
      const existingUsers = Object.keys(rooms[roomName].users).filter(
        (id) => id !== clientId
      )
      socket.emit('existingUsers', { users: existingUsers })
    } else {
      console.log(
        `[SERVER] Room ${roomName} not in predefined list, creating dynamically`
      )
      rooms[roomName] = { users: {} }
      rooms[roomName].users[clientId] = { joinTime: Date.now() }
    }
  })

  // Handle position updates
  socket.on('positionUpdate', (data) => {
    if (currentRoom) {
      socket.to(currentRoom).emit('positionUpdate', {
        id: socket.id,
        position: data.position,
        rotation: data.rotation,
      })
    }
  })

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`[SERVER] User disconnected: ${clientId}`)

    if (currentRoom && rooms[currentRoom]) {
      // Remove user from room tracking
      delete rooms[currentRoom].users[clientId]

      console.log(
        `[SERVER] Room ${currentRoom} now has ${
          Object.keys(rooms[currentRoom].users).length
        } users`
      )

      // Notify others in the room
      socket.to(currentRoom).emit('userLeft', { id: clientId })
    }
  })
})

// Start the server
const PORT = process.env.PORT || 8080
http.listen(PORT, () => {
  console.log(`[SERVER] EVENT Multiplayer server running on port ${PORT}`)
  console.log('[SERVER] Room statistics:')
  Object.keys(rooms).forEach((room) => {
    console.log(`[SERVER] - ${room}: 0 users`)
  })
})
