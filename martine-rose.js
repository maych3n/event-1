// Martine Rose x Nike - Networked A-Frame integration
console.log('[CLIENT] Loading martine-rose-networked.js...')

// Wait for DOM to be ready before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  console.log(
    '[CLIENT] DOM loaded, initializing Martine Rose networking components'
  )

  // Register spin component if not already registered
  if (!AFRAME.components['spin']) {
    AFRAME.registerComponent('spin', {
      schema: { speed: { type: 'number', default: 0.5 } },

      tick: function (time, timeDelta) {
        // Convert speed to smooth rotation per frame
        this.el.object3D.rotation.y += (this.data.speed * timeDelta) / 1000
      },
    })
  }

  // Register the camera animation component if not already registered
  if (!AFRAME.components['animate-camera']) {
    AFRAME.registerComponent('animate-camera', {
      init: function () {
        const cameraRig = document.querySelector('#rig')
        if (!cameraRig) {
          console.error('[CLIENT] Camera rig not found with selector #rig')
          return
        }

        // Store initial position for animation
        const initialPosition = cameraRig.getAttribute('position')
        const targetPosition = { x: 0, y: 0, z: 15 } // Closer position to view the ball

        console.log(
          '[CLIENT] Setting up camera animation for Martine Rose x Nike scene'
        )

        setTimeout(() => {
          // Animate Position
          cameraRig.setAttribute('animation', {
            property: 'position',
            from: `${initialPosition.x} ${initialPosition.y} ${initialPosition.z}`,
            to: `${targetPosition.x} ${targetPosition.y} ${targetPosition.z}`,
            dur: 2500,
            easing: 'easeInOutQuad',
          })

          // Wait for animation to finish, then enable movement
          setTimeout(() => {
            cameraRig.removeAttribute('animation')

            // Enable movement
            const camera = cameraRig.querySelector('[camera]')
            if (camera) {
              camera.setAttribute(
                'wasd-controls',
                'fly: true; acceleration: 5;'
              )
            }

            // Add networking AFTER camera animations complete
            console.log(
              '[CLIENT] Animation complete, setting up networking for Martine Rose x Nike scene'
            )
            if (typeof setupNetworkedWorld === 'function') {
              // Pass 'martine-rose' as the world name for proper avatar scaling (50 50 50)
              setupNetworkedWorld('martine-rose', '#rig', 'martine-rose')
              console.log(
                '[CLIENT] Networking initialized for Martine Rose room'
              )
            } else {
              console.error('[CLIENT] setupNetworkedWorld function not found')
            }
          }, 2500) // Matches animation duration
        }, 1500) // Pause before animation starts
      },
    })
  }

  // Attach the animate-camera component to the camera rig if it exists
  const cameraRig = document.querySelector('#rig')
  if (cameraRig) {
    console.log('[CLIENT] Attaching animate-camera component to #rig')
    cameraRig.setAttribute('animate-camera', '')
  } else {
    console.error('[CLIENT] Cannot find camera rig with selector #rig')
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
        '[CLIENT] Using fallback networking initialization for Martine Rose scene'
      )
      window.networkingInitialized = true
      // Pass 'martine-rose' as the world name for proper avatar scaling (50 50 50)
      setupNetworkedWorld('martine-rose', '#rig', 'martine-rose')
    }
  }, 7000) // Wait longer to ensure everything is loaded
})

console.log('[CLIENT] martine-rose-networked.js loaded successfully')
