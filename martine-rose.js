AFRAME.registerComponent('spin', {
    schema: { speed: { type: 'number', default: 50 } },
  
    tick: function (time, timeDelta) {
      // Convert speed to smooth rotation per frame
      this.el.object3D.rotation.y += (this.data.speed * timeDelta) / 1000;
    }
  });

