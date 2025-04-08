// Marc Jacobs in Conversation with ChatGPT - Networked A-Frame integration
console.log('[CLIENT] Loading marc-jacobs-networked.js...')

// Wait for DOM to be ready before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  console.log(
    '[CLIENT] DOM loaded, initializing Marc Jacobs networking components'
  )

  // Register the camera animation component if not already registered
  if (!AFRAME.components['animate-camera']) {
    AFRAME.registerComponent('animate-camera', {
      init: function () {
        const cameraRig = document.querySelector('#cameraRig')
        if (!cameraRig) {
          console.error(
            '[CLIENT] Camera rig not found with selector #cameraRig'
          )
          return
        }

        // Store initial position for animation
        const initialPosition = cameraRig.getAttribute('position')

        // Target position - bring camera closer to and slightly elevated over the conversation scene
        const targetPosition = { x: 0, y: 14, z: 20 }

        console.log(
          '[CLIENT] Setting up camera animation for Marc Jacobs scene'
        )

        setTimeout(() => {
          // Animate Position
          cameraRig.setAttribute('animation', {
            property: 'position',
            from: `${initialPosition.x} ${initialPosition.y} ${initialPosition.z}`,
            to: `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`,
            dur: 3000,
            easing: 'easeInOutQuad',
          })

          // Wait for animation to finish, then enable movement
          setTimeout(() => {
            cameraRig.removeAttribute('animation')

            // Enable movement (already has wasd-controls, so just ensure they're properly set)
            const camera = cameraRig.querySelector('[camera]')
            if (camera) {
              camera.setAttribute(
                'wasd-controls',
                'fly: true; acceleration: 60;'
              )
            }

            // Add a slight downward tilt to look at the table
            cameraRig.setAttribute('rotation', '15 0 0')

            // Add networking AFTER camera animations complete
            console.log(
              '[CLIENT] Animation complete, setting up networking for Marc Jacobs scene'
            )
            if (typeof setupNetworkedWorld === 'function') {
              // Pass the specific room name to ensure avatars are positioned correctly
              setupNetworkedWorld('marc-jacobs', '#cameraRig', 'marc-jacobs')

              // Create a spotlight to illuminate avatars better in this world
              const scene = document.querySelector('a-scene')
              if (scene) {
                // Add a spotlight specifically aimed at the avatar spawn position (near dining table)
                const avatarLight = document.createElement('a-light')
                avatarLight.setAttribute('type', 'spot')
                avatarLight.setAttribute('color', '#ffffff')
                avatarLight.setAttribute('intensity', '2')
                avatarLight.setAttribute('position', '0 15 5') // Positioned to illuminate the table area
                avatarLight.setAttribute('target', '0 0.1 1.2') // Target the updated floor-level avatar position
                avatarLight.setAttribute('angle', '60')
                avatarLight.setAttribute('penumbra', '0.5')
                scene.appendChild(avatarLight)

                // Add a second ambient light to ensure avatars are visible from all angles
                const ambientLight = document.createElement('a-light')
                ambientLight.setAttribute('type', 'ambient')
                ambientLight.setAttribute('color', '#ffffff')
                ambientLight.setAttribute('intensity', '0.5')
                scene.appendChild(ambientLight)

                console.log(
                  '[CLIENT] Added additional lighting for Marc Jacobs avatars at the dining table'
                )
              }

              console.log(
                '[CLIENT] Networking initialized for Marc Jacobs room with avatar spawn at dining table'
              )
            } else {
              console.error('[CLIENT] setupNetworkedWorld function not found')
            }
          }, 3000) // Matches animation duration
        }, 1500) // Pause before animation starts
      },
    })
  }

  // Create look-at component for certain elements to face the camera
  if (!AFRAME.components['look-at']) {
    AFRAME.registerComponent('look-at', {
      schema: {
        type: 'selector',
      },

      init: function () {
        this.target = this.data || document.querySelector('[camera]')
      },

      tick: function () {
        if (!this.target) return

        const target3D = new THREE.Vector3()
        const object3D = this.el.object3D

        // Get world position of target
        if (this.target.object3D) {
          this.target.object3D.getWorldPosition(target3D)
          object3D.lookAt(target3D)
        }
      },
    })
  }

  // Attach the animate-camera component to the camera rig
  const cameraRig = document.querySelector('#cameraRig')
  if (cameraRig) {
    console.log('[CLIENT] Attaching animate-camera component to #cameraRig')
    cameraRig.setAttribute('animate-camera', '')
  } else {
    console.error('[CLIENT] Cannot find camera rig with selector #cameraRig')
  }

  // Fallback in case animation component fails
  console.log('[CLIENT] Setting up fallback networking initialization')
  window.networkingInitialized = window.networkingInitialized || false

  setTimeout(() => {
    if (
      typeof setupNetworkedWorld === 'function' &&
      !window.networkingInitialized
    ) {
      console.log(
        '[CLIENT] Using fallback networking initialization for Marc Jacobs scene'
      )
      window.networkingInitialized = true
      setupNetworkedWorld('marc-jacobs', '#cameraRig', 'marc-jacobs')
    }
  }, 7000) // Wait longer to ensure everything is loaded
})

// Toggle sidebar function (for the interview panel)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar')
  if (sidebar) {
    sidebar.classList.toggle('active')
  }
}

console.log('[CLIENT] marc-jacobs-networked.js loaded successfully')
