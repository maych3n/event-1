// Junya Watanabe Runway Archives - Networked A-Frame integration
console.log('[CLIENT] Loading junya-watanabe.js...')

// Wait for DOM to be ready before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  console.log(
    '[CLIENT] DOM loaded, initializing Junya Watanabe networking components'
  )

  // Register the billboard component if not already registered
  if (!AFRAME.components['billboard']) {
    AFRAME.registerComponent('billboard', {
      tick: function () {
        const camera = this.el.sceneEl.camera
        if (!camera) return

        const object3D = this.el.object3D

        // Get the camera's world position
        const cameraWorldPos = new THREE.Vector3()
        camera.getWorldPosition(cameraWorldPos)

        // Make the entity face the camera's world position
        object3D.lookAt(cameraWorldPos)

        // Correct rotation to keep the image upright
        object3D.rotation.x = 0
        object3D.rotation.z = 0
      },
    })
  }

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

        console.log(
          '[CLIENT] Setting up camera animation for Junya Watanabe Runway scene'
        )

        setTimeout(() => {
          // Wait for animation to finish, then enable movement
          setTimeout(() => {
            // Add networking AFTER camera animations complete
            console.log(
              '[CLIENT] Animation complete, setting up networking for Junya Watanabe scene'
            )
            if (typeof setupNetworkedWorld === 'function') {
              setupNetworkedWorld(
                'junya-watanabe',
                '#cameraRig',
                'junya-watanabe'
              )

              // Create a spotlight to illuminate avatars better in this world
              const scene = document.querySelector('a-scene')
              if (scene) {
                const avatarLight = document.createElement('a-light')
                avatarLight.setAttribute('type', 'spot')
                avatarLight.setAttribute('color', '#ffffff')
                avatarLight.setAttribute('intensity', '1.5')
                avatarLight.setAttribute('position', '-20 15 49') // Position near the starting camera position
                avatarLight.setAttribute('target', '-20 0.1 49') // Target the avatar spawn position
                avatarLight.setAttribute('angle', '60')
                avatarLight.setAttribute('penumbra', '0.5')
                scene.appendChild(avatarLight)

                // Add ambient light for better visibility of avatars
                const ambientLight = document.createElement('a-light')
                ambientLight.setAttribute('type', 'ambient')
                ambientLight.setAttribute('color', '#ffffff')
                ambientLight.setAttribute('intensity', '0.3')
                scene.appendChild(ambientLight)

                console.log(
                  '[CLIENT] Added additional lighting for Junya Watanabe avatars'
                )
              }

              console.log(
                '[CLIENT] Networking initialized for Junya Watanabe room'
              )
            } else {
              console.error('[CLIENT] setupNetworkedWorld function not found')
            }
          }, 500) // Short delay to ensure scene is ready
        }, 1000) // Initial delay before setup
      },
    })
  }

  // Create or ensure the look-at component exists
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
        '[CLIENT] Using fallback networking initialization for Junya Watanabe scene'
      )
      window.networkingInitialized = true
      setupNetworkedWorld('junya-watanabe', '#cameraRig', 'junya-watanabe')
    }
  }, 5000) // Wait longer to ensure everything is loaded
})

// Update scene function - integrating with existing functionality
function updateSceneWithAvatars() {
  const updateSceneOriginal = window.updateScene

  // If original updateScene function exists, wrap it
  if (typeof updateSceneOriginal === 'function') {
    window.updateScene = function () {
      // Call the original function first
      updateSceneOriginal()

      // Add any avatar-specific logic here if needed
      // For example, you might want to adjust avatar visibility based on camera position
    }
  }
}

// Call our wrapper function on load
if (document.readyState === 'complete') {
  updateSceneWithAvatars()
} else {
  window.addEventListener('load', updateSceneWithAvatars)
}

console.log('[CLIENT] junya-watanabe.js loaded successfully')
