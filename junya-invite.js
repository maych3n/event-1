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

// Set up multiplayer
document.addEventListener('DOMContentLoaded', () => {
  if (typeof NAF !== 'undefined') {
    setupNetworkedWorld('junya-invite', '/Assets/junya-invite-avatar.glb')
  }
})
