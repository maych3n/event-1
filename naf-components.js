// naf-components.js - Client-side socket.io implementation
console.log('[CLIENT] Loading naf-components.js...')

// Component for custom networked avatar
AFRAME.registerComponent('simple-avatar', {
  schema: {
    color: { type: 'color', default: '#FF6B6B' },
    size: { type: 'number', default: 0.3 },
  },

  init: function () {
    console.log('[CLIENT] Creating simple avatar')

    // Create avatar visual representation (sphere)
    const sphere = document.createElement('a-sphere')
    sphere.setAttribute('color', this.data.color)
    sphere.setAttribute('radius', this.data.size)
    sphere.setAttribute('position', '0 0 0')

    // Add floating animation
    sphere.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 2000,
      easing: 'easeInOutSine',
      loop: true,
      from: '0 0 0',
      to: '0 0.1 0',
    })

    this.el.appendChild(sphere)

    // Add text label
    const text = document.createElement('a-text')
    text.setAttribute('value', 'User')
    text.setAttribute('position', '0 0.5 0')
    text.setAttribute('align', 'center')
    text.setAttribute('scale', '0.5 0.5 0.5')
    text.setAttribute('color', '#FFFFFF')

    this.el.appendChild(text)
  },
})

// Socket.io connection management
let socket = null
let myClientId = null
let myRoomName = null
const avatars = {}

// Function to create a remote avatar
function createRemoteAvatar(userId) {
  console.log(`[CLIENT] Creating remote avatar for user ${userId}`)

  // Skip if avatar already exists
  if (avatars[userId]) {
    console.log(`[CLIENT] Avatar for ${userId} already exists`)
    return
  }

  // Get scene
  const scene = document.querySelector('a-scene')
  if (!scene) {
    console.error('[CLIENT] No a-scene found')
    return
  }

  // Create avatar entity
  const avatar = document.createElement('a-entity')
  avatar.id = `avatar-${userId}`
  avatar.setAttribute('simple-avatar', {
    color: getColorForUser(userId),
  })
  avatar.setAttribute('position', '0 0 0')

  // Add to scene
  scene.appendChild(avatar)

  // Store reference
  avatars[userId] = avatar
}

// Function to update avatar position
function updateAvatarPosition(userId, position, rotation) {
  const avatar = avatars[userId]
  if (avatar) {
    avatar.setAttribute('position', position)
    avatar.setAttribute('rotation', rotation)
  }
}

// Function to remove avatar
function removeAvatar(userId) {
  console.log(`[CLIENT] Removing avatar for user ${userId}`)

  const avatar = avatars[userId]
  if (avatar && avatar.parentNode) {
    avatar.parentNode.removeChild(avatar)
  }

  delete avatars[userId]
}

// Get unique color based on user ID
function getColorForUser(userId) {
  // Simple hash function to convert userId to color
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Convert to RGB
  const r = (hash & 0xff0000) >> 16
  const g = (hash & 0x00ff00) >> 8
  const b = hash & 0x0000ff

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Initialize Socket.io connection
function initializeSocketConnection() {
  console.log('[CLIENT] Initializing socket connection')

  try {
    // Connect to Socket.io server with exact options to match server
    socket = io.connect(window.location.origin, {
      transports: ['websocket', 'polling'],
      forceNew: true,
    })

    // Handle connection events
    socket.on('connect', function () {
      myClientId = socket.id
      console.log(`[CLIENT] Connected to server with ID: ${myClientId}`)

      // Join room only if we already know the room name
      if (myRoomName) {
        joinRoom(myRoomName)
      }
    })

    // Handle connection errors
    socket.on('connect_error', function (error) {
      console.error(`[CLIENT] Connection error: ${error.message}`)
    })

    // Handle new users joining
    socket.on('userJoined', function (data) {
      console.log(`[CLIENT] User joined: ${data.id}`)
      createRemoteAvatar(data.id)
    })

    // Handle users leaving
    socket.on('userLeft', function (data) {
      console.log(`[CLIENT] User left: ${data.id}`)
      removeAvatar(data.id)
    })

    // Handle existing users when joining
    socket.on('existingUsers', function (data) {
      console.log(`[CLIENT] Received existing users: ${data.users.length}`)
      data.users.forEach(function (userId) {
        createRemoteAvatar(userId)
      })
    })

    // Handle position updates
    socket.on('positionUpdate', function (data) {
      updateAvatarPosition(data.id, data.position, data.rotation)
    })
  } catch (e) {
    console.error(`[CLIENT] Error initializing socket: ${e.message}`)
  }
}

// Join a specific room
function joinRoom(roomName) {
  if (!socket) {
    console.error('[CLIENT] Cannot join room - socket not initialized')
    return
  }

  console.log(`[CLIENT] Joining room: ${roomName}`)
  myRoomName = roomName
  socket.emit('joinRoom', roomName)
}

// Send position updates
function startPositionBroadcast(cameraRigSelector) {
  const cameraRig = document.querySelector(cameraRigSelector || '#cameraRig')

  if (!cameraRig) {
    console.error(
      `[CLIENT] Camera rig not found with selector: ${
        cameraRigSelector || '#cameraRig'
      }`
    )
    return
  }

  console.log('[CLIENT] Starting position broadcast')

  // Send updates every 100ms
  setInterval(function () {
    if (!socket || !myRoomName || !socket.connected) return

    const position = cameraRig.getAttribute('position')
    const rotation = cameraRig.getAttribute('rotation')

    socket.emit('positionUpdate', {
      position: position,
      rotation: rotation,
    })
  }, 100)
}

// Main setup function
window.setupNetworkedWorld = function (roomName, cameraRigSelector) {
  console.log(`[CLIENT] Setting up networked world for room: ${roomName}`)

  // Initialize socket if not already done
  if (!socket) {
    initializeSocketConnection()
  }

  // Join room (or schedule join when socket connects)
  myRoomName = roomName
  if (socket && socket.connected) {
    joinRoom(roomName)
  }

  // Wait for A-Frame to be fully initialized
  if (document.readyState === 'complete') {
    startPositionBroadcast(cameraRigSelector)
  } else {
    window.addEventListener('load', function () {
      setTimeout(function () {
        startPositionBroadcast(cameraRigSelector)
      }, 2000)
    })
  }
}

console.log('[CLIENT] naf-components.js loaded successfully')
