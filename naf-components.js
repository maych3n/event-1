// naf-components.js - Client-side socket.io implementation
console.log('[CLIENT] Loading naf-components.js...')

// Component for GLTF avatar representation
AFRAME.registerComponent('gltf-avatar', {
  schema: {
    modelSrc: { type: 'string', default: 'avatar.glb' },
    userName: { type: 'string', default: 'User' },
    worldName: { type: 'string', default: 'default' },
  },

  init: function () {
    console.log('[CLIENT] Creating GLTF avatar for world:', this.data.worldName)

    // Create a container for better organization
    const avatarContainer = document.createElement('a-entity')

    // Position the entire avatar
    let avatarPosition = '0 1.5 0' // Default position

    // World-specific positioning
    if (this.data.worldName === 'marc-jacobs') {
      // Position avatar at floor level near the dining table in the Marc Jacobs scene
      // Coordinates place avatar directly on the floor and closer to the dining table
      avatarPosition = '0 0.1 1.2' // Adjusted for Marc Jacobs world - grounded position at the dining table
      console.log(
        '[CLIENT] Setting special position for Marc Jacobs world:',
        avatarPosition
      )

      // Set initial rotation to face the dining table
      this.el.setAttribute('rotation', '0 180 0') // Rotate to face the table (assuming table is at negative Z)
      console.log('[CLIENT] Setting avatar rotation to face the dining table')
    }

    avatarContainer.setAttribute('position', avatarPosition)

    // Create the GLTF model entity
    const modelEntity = document.createElement('a-entity')
    modelEntity.setAttribute('gltf-model', this.data.modelSrc)

    // Scale based on the world type
    let scale = '130 130 130' // Default scale

    // World-specific scaling
    if (this.data.worldName === 'gentle-monster') {
      scale = '40 40 40' // Client requested scale for gentle-monster world
    } else if (this.data.worldName === 'martine-rose') {
      scale = '50 50 50' // Scale for Martine Rose x Nike world
    } else if (this.data.worldName === 'junya-invite') {
      scale = '50 50 50' // Scale for Junya Watanabe Invitation world
    } else if (this.data.worldName.includes('junya-watanabe')) {
      scale = '100 100 100' // Scale for other Junya Watanabe worlds
    } else if (this.data.worldName === 'marc-jacobs') {
      scale = '40 40 40' // Scale for Marc Jacobs world - slightly smaller
    }

    console.log(
      `[CLIENT] Setting avatar scale to ${scale} for world ${this.data.worldName}`
    )
    modelEntity.setAttribute('scale', scale)

    // Add the model to the container
    avatarContainer.appendChild(modelEntity)

    // Create a separate entity for the text that properly follows the avatar
    const textEntity = document.createElement('a-entity')
    // Position text directly above the avatar container
    textEntity.setAttribute('position', '0 3.5 0')

    // Create a background plane for better text visibility
    const textBackground = document.createElement('a-plane')
    textBackground.setAttribute('color', '#000000')
    textBackground.setAttribute('opacity', '0.5')
    textBackground.setAttribute('height', '0.5')
    textBackground.setAttribute('width', '2')
    textBackground.setAttribute('position', '0 0 -0.01') // Slightly behind text


    // Add floating animation to the avatar container - adjust for Marc Jacobs
    let floatFrom = '0 1.5 0'
    let floatTo = '0 1.7 0'

    if (this.data.worldName === 'marc-jacobs') {
      floatFrom = avatarPosition // Use the new avatar position as the base
      // For Marc Jacobs world, create a very subtle floating effect
      // that doesn't lift the avatar off the ground too much
      const positionParts = avatarPosition.split(' ')
      const toY = parseFloat(positionParts[1]) + 0.05 // Minimal float of just 5cm
      floatTo = `${positionParts[0]} ${toY} ${positionParts[2]}` // Very subtle floating effect

      console.log(
        '[CLIENT] Setting subtle floor-level floating animation:',
        `from ${floatFrom} to ${floatTo}`
      )
    }

    avatarContainer.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 2000,
      easing: 'easeInOutSine',
      loop: true,
      from: floatFrom,
      to: floatTo,
    })

    // Add the avatar container to the main entity
    this.el.appendChild(avatarContainer)

    // Create parent entity for text to follow avatar movement
    const textFollower = document.createElement('a-entity')
    textFollower.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 2000,
      easing: 'easeInOutSine',
      loop: true,
      from: '0 0 0',
      to: '0 0.2 0', // Match the avatar's float but from 0
    })

    textFollower.appendChild(textEntity)
    this.el.appendChild(textFollower)
  },
})

// Socket.io connection management
let socket = null
let myClientId = null
let myRoomName = null
let myWorldName = null
const avatars = {}

// Function to create a remote avatar
function createRemoteAvatar(userId) {
  console.log(
    `[CLIENT] Creating remote avatar for user ${userId} in world ${myWorldName}`
  )

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

  // Set a shortened user ID for display
  const shortUserId = userId.substring(0, 4)

  // Use GLTF avatar with user identification and world information
  avatar.setAttribute('gltf-avatar', {
    modelSrc: 'avatar.glb',
    userName: `User-${shortUserId}`,
    worldName: myWorldName,
  })

  // For Marc Jacobs world, offset each new avatar slightly to prevent overlapping
  if (myWorldName === 'marc-jacobs') {
    // Create a small random offset within a reasonable range around the table
    const offsetX = (Math.random() * 2 - 1) * 0.8 // Random between -0.8 and 0.8
    const offsetZ = Math.random() * 0.5 // Random between 0 and 0.5 (closer to table)

    avatar.setAttribute('position', `${offsetX} 0 ${offsetZ}`)
    console.log(
      `[CLIENT] Positioning avatar with table-area offset: ${offsetX} 0 ${offsetZ}`
    )
  } else {
    avatar.setAttribute('position', '0 0 0')
  }

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

// Send position updates - Handle different camera rig structures
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

  console.log(
    '[CLIENT] Starting position broadcast for rig:',
    cameraRigSelector
  )

  // Send updates every 100ms
  setInterval(function () {
    if (!socket || !myRoomName || !socket.connected) return

    // Get position and rotation from the camera rig
    const position = cameraRig.getAttribute('position')
    const rotation = cameraRig.getAttribute('rotation')

    // Special handling for worlds with camera inside rig
    let finalPosition = position
    let finalRotation = rotation

    if (
      myWorldName === 'martine-rose' ||
      myWorldName === 'junya-invite' ||
      myWorldName === 'marc-jacobs'
    ) {
      // Get the camera entity nested inside the rig
      const camera = cameraRig.querySelector('[camera]')
      if (camera) {
        // Get camera's local position and rotation
        const cameraPosition = camera.getAttribute('position')

        // Combine rig position with camera position for more accurate avatar placement
        finalPosition = {
          x: position.x,
          y: position.y,
          z: position.z,
        }

        // Get the camera's world rotation for avatar facing direction
        if (camera.getAttribute('rotation')) {
          finalRotation = camera.getAttribute('rotation')
        }
      }
    }

    socket.emit('positionUpdate', {
      position: finalPosition,
      rotation: finalRotation,
    })
  }, 100)
}

// Main setup function
window.setupNetworkedWorld = function (roomName, cameraRigSelector, worldName) {
  console.log(
    `[CLIENT] Setting up networked world for room: ${roomName}, world: ${
      worldName || roomName
    }, rig: ${cameraRigSelector}`
  )

  // Set world name for scaling purposes
  myWorldName = worldName || roomName

  // Initialize socket if not already done
  if (!socket) {
    initializeSocketConnection()
  }

  // Join room (or schedule join when socket connects)
  myRoomName = roomName
  if (socket && socket.connected) {
    joinRoom(roomName)
  }

  // Set flag to prevent duplicate initializations
  window.networkingInitialized = true

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
