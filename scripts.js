// Function to toggle the sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Function to handle the fixed button click
function buttonClicked() {
    alert('Button clicked!');
}

// VR code
AFRAME.registerComponent('left-joystick-y-movement', {
    tick: function () {
      const controller = this.el;
      const rig = document.getElementById('rig');
      const axis = controller.components['oculus-touch-controls']?.axis;
  
      if (axis && axis.length >= 2) {
        const yMovement = axis[1] * 0.1; // Adjust the speed with this multiplier
        const rigPosition = rig.getAttribute('position');
        rig.setAttribute('position', {
          x: rigPosition.x,
          y: rigPosition.y + yMovement,
          z: rigPosition.z
        });
      }
    }
  });
  
  AFRAME.registerComponent('right-joystick-position-movement', {
    tick: function () {
      const controller = this.el;
      const rig = document.getElementById('rig');
      const axis = controller.components['oculus-touch-controls']?.axis;
      const camera = document.querySelector('[camera]');
      
      if (axis && axis.length >= 2) {
        const forwardMovement = axis[1] * 0.1; // Z-axis movement
        const strafeMovement = axis[0] * 0.1; // X-axis movement
        
        const cameraRotation = camera.getAttribute('rotation').y * (Math.PI / 180);
        const sinY = Math.sin(cameraRotation);
        const cosY = Math.cos(cameraRotation);
  
        // Move in the direction the camera is facing
        const deltaX = (forwardMovement * sinY) + (strafeMovement * cosY);
        const deltaZ = (forwardMovement * cosY) - (strafeMovement * sinY);
  
        const rigPosition = rig.getAttribute('position');
        rig.setAttribute('position', {
          x: rigPosition.x + deltaX,
          y: rigPosition.y,
          z: rigPosition.z + deltaZ
        });
      }
    }
  });