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
AFRAME.registerComponent('custom-controls', {
    init: function () {
      const rig = this.el;
      const leftController = document.querySelector('[oculus-touch-controls="hand: left"]');
      const rightController = document.querySelector('[oculus-touch-controls="hand: right"]');
      const camera = document.querySelector('a-entity[camera]');
  
      // Enable thumbstick movement for Y-axis (left controller)
      leftController.addEventListener('thumbstickmoved', (e) => {
        if (e.detail.y) {
          rig.object3D.position.y += e.detail.y * -0.1;
        }
      });
  
      // Enable thumbstick movement for X and Z axes (right controller)
      rightController.addEventListener('thumbstickmoved', (e) => {
        if (e.detail.x || e.detail.y) {
          rig.object3D.position.x += e.detail.x * 0.1;
          rig.object3D.position.z += e.detail.y * 0.1;
        }
      });
  
      // Ensure WASD controls work on desktop
      camera.setAttribute('wasd-controls', 'fly: true; acceleration: 15');
    }
  });