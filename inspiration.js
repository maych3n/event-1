const hoverObjects = document.querySelectorAll('.hover-object');

hoverObjects.forEach(item => {
    item.addEventListener('mouseenter', () => {
        hideAllModels();
        const targetModel = document.getElementById(item.dataset.target);
        if (targetModel) {
            targetModel.setAttribute('visible', 'true');
        }
    });

    item.addEventListener('mouseleave', () => {
        hideAllModels();
    });
});

function hideAllModels() {
    document.querySelectorAll('a-entity').forEach(model => {
        model.setAttribute('visible', 'false');
    });
}


