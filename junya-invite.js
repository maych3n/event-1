// Wait for DOM to be ready before accessing elements
document.addEventListener('DOMContentLoaded', function () {
  // Register components only if they haven't been registered yet
  if (!AFRAME.components['billboard-y']) {
    AFRAME.registerComponent('billboard-y', {
      tick: function () {
        const camera = this.el.sceneEl.camera
        const obj3D = this.el.object3D
        if (camera) {
          const targetPos = new THREE.Vector3()
          camera.getWorldPosition(targetPos)
          obj3D.lookAt(targetPos)
          obj3D.rotation.x = 0 // lock X
          obj3D.rotation.z = 0 // lock Z
        }
      },
    })
  }

  // Register the camera animation component
  if (!AFRAME.components['animate-camera']) {
    AFRAME.registerComponent('animate-camera', {
      init: function () {
        const cameraRig = document.querySelector('#rig')
        if (!cameraRig) {
          console.error('[CLIENT] Camera rig not found')
          return
        }

        setTimeout(() => {
          // Animate Position
          cameraRig.setAttribute('animation', {
            property: 'position',
            from: '0 8 40',
            to: '-0.35 0.5 2.5',
            dur: 2500,
            easing: 'easeInOutQuad',
          })

          // Animate Rotation
          cameraRig.setAttribute('animation__rotation', {
            property: 'rotation',
            from: '-5 0 0',
            to: '10 0 0',
            dur: 2500,
            easing: 'easeInOutQuad',
          })

          // Wait for animation to finish, then enable movement
          setTimeout(() => {
            cameraRig.removeAttribute('animation')
            cameraRig.removeAttribute('animation__rotation')

            // Enable movement
            cameraRig.setAttribute(
              'wasd-controls',
              'fly: true; acceleration: 5;'
            )

            // Add networking AFTER camera animations complete
            console.log('[CLIENT] Animation complete, setting up networking')
            if (typeof setupNetworkedWorld === 'function') {
              // Pass the proper world name for scaling
              setupNetworkedWorld('junya-invite', '#rig', 'junya-invite')
            } else {
              console.error('[CLIENT] setupNetworkedWorld function not found')
            }
          }, 2500) // Matches animation duration
        }, 1500) // Pause before animation starts
      },
    })
  }

  // Attach the component to the camera rig if it exists
  const cameraRig = document.querySelector('#rig')
  if (cameraRig) {
    cameraRig.setAttribute('animate-camera', '')
  } else {
    console.error('[CLIENT] Cannot find camera rig with selector #rig')
  }

  // Fallback in case animation component fails
  console.log('[CLIENT] Setting up fallback networking initialization')
  setTimeout(() => {
    if (
      typeof setupNetworkedWorld === 'function' &&
      !window.networkingInitialized
    ) {
      console.log('[CLIENT] Using fallback networking initialization')
      window.networkingInitialized = true
      // Pass the proper world name for scaling
      setupNetworkedWorld('junya-invite', '#rig', 'junya-invite')
    }
  }, 7000) // Wait longer to ensure everything is loaded
})
