AFRAME.registerComponent('hover-spin-rise', {
    schema: {
        riseHeight: { type: 'number', default: 0.3 }, // How much it rises
        spinSpeed: { type: 'number', default: 360 }, // Degrees of spin
        duration: { type: 'number', default: 300 } // Animation speed (ms)
    },

    init: function () {
        let el = this.el;
        let originalPosition = el.getAttribute('position') || { x: 0, y: 0, z: 0 };
        let originalRotation = el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };

        el.addEventListener('mouseenter', function () {
            // Rise up
            el.setAttribute('animation__rise', {
                property: 'position',
                to: `${originalPosition.x} ${originalPosition.y + 0.3} ${originalPosition.z}`,
                dur: 300,
                easing: 'easeOutQuad'
            });

            // Spin
            el.setAttribute('animation__spin', {
                property: 'rotation',
                to: `${originalRotation.x} ${originalRotation.y + 360} ${originalRotation.z}`,
                dur: 1000,
                easing: 'linear',
                loop: true
            });
        });

        el.addEventListener('mouseleave', function () {
            // Move back down
            el.setAttribute('animation__rise', {
                property: 'position',
                to: `${originalPosition.x} ${originalPosition.y} ${originalPosition.z}`,
                dur: 300,
                easing: 'easeOutQuad'
            });

            // Stop spinning
            el.removeAttribute('animation__spin');
        });
    }
});
