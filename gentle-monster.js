AFRAME.registerComponent('animate-camera', {
  init: function () {
    const cameraRig = document.querySelector('#cameraRig')

    setTimeout(() => {
      // Animate Position
      cameraRig.setAttribute('animation', {
        property: 'position',
        from: '0 8 40',
        to: '-0.35 0.5 2.5',
        dur: 2500,
        easing: 'easeInOutQuad',
      })

      // Animate Rotation (Y-axis: 0 → 10 degrees)
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
        cameraRig.setAttribute('wasd-controls', 'fly: true; acceleration: 5;')

        // Add networking AFTER camera animations complete
        console.log('[CLIENT] Animation complete, setting up networking')
        if (typeof setupNetworkedWorld === 'function') {
          setupNetworkedWorld('gentle-monster', '#cameraRig')
        } else {
          console.error('[CLIENT] setupNetworkedWorld function not found')
        }
      }, 2500) // Matches animation duration
    }, 1500) // Pause before animation starts
  },
})

// Attach the component to the camera rig
document.querySelector('#cameraRig').setAttribute('animate-camera', '')

// Fallback in case animation component fails
console.log('[CLIENT] Setting up fallback networking initialization')
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    if (
      typeof setupNetworkedWorld === 'function' &&
      !window.networkingInitialized
    ) {
      console.log('[CLIENT] Using fallback networking initialization')
      window.networkingInitialized = true
      setupNetworkedWorld('gentle-monster', '#cameraRig')
    }
  }, 5000) // Wait 5 seconds to ensure everything is loaded
})
