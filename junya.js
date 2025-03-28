function updateScene() {
    const camera = document.querySelector("a-camera");
    const textContainer = document.getElementById("scene-text");
    const headerContainer = document.querySelector(".fixed-left-text"); // Header that changes

    if (!camera || !textContainer || !headerContainer) {
        console.error("Missing elements:", { camera, textContainer, headerContainer });
        return;
    }

    const position = camera.object3D.position;
    console.log("Camera Z Position:", position.z); // Depbugging check

    // Select text images by ID
    const texts = {
        a: document.querySelector('[src="#text-a"]'),
        b: document.querySelector('[src="#text-b"]'),
        c: document.querySelector('[src="#text-c"]'),
        d: document.querySelector('[src="#text-d"]'),
        e: document.querySelector('[src="#text-e"]'),
        f: document.querySelector('[src="#text-f"]'),
        g: document.querySelector('[src="#text-g"]'),
        h: document.querySelector('[src="#text-h"]'),
        i: document.querySelector('[src="#text-i"]'),
        j: document.querySelector('[src="#text-j"]'),
    };

    // Hide all text images by default
    Object.values(texts).forEach(text => {
        if (text) text.setAttribute("visible", "false");
    });

    // Default to empty text
    headerContainer.textContent = "";
    textContainer.textContent = "";

    // Update text and show correct image at the right Z position (no gaps)
    if (position.z >= 0 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 1993";
        headerContainer.textContent = "ORIGINS AND PATTERNMAKING";
        if (texts.a) texts.a.setAttribute("visible", "true");
    } else if (position.z >= -40 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 2000";
        headerContainer.textContent = "TECHNO COUTURE";
        if (texts.b) texts.b.setAttribute("visible", "true");
    } else if (position.z >= -80 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 2003";
        headerContainer.textContent = "CLASSIC CLOTHING INTERPRETTED IN MY OWN WAY";
        if (texts.c) texts.c.setAttribute("visible", "true");
    } else if (position.z >= -123 && position.z ) {
        textContainer.textContent = "SPRING/SUMMER 2006";
        headerContainer.textContent = "THE MAD CAPSULE MARKETS";
        if (texts.d) texts.d.setAttribute("visible", "true");
    } else if (position.z >= -162 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 2006";
        headerContainer.textContent = "DECONSTRUCTION AND RECONSTRUCTION";
        if (texts.e) texts.e.setAttribute("visible", "true");
    } else if (position.z >= -200 && position.z ) {
        textContainer.textContent = "SPRING/SUMMER 2011";
        headerContainer.textContent = "TOKYO DOLL";
        if (texts.f) texts.f.setAttribute("visible", "true");
    } else if (position.z >= -242 && position.z ) {
        textContainer.textContent = "SPRING/SUMMER 2015";
        headerContainer.textContent = "GRAPHIC MARCHING";
        if (texts.g) texts.g.setAttribute("visible", "true");
    } else if (position.z >= -283 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 2016";
        headerContainer.textContent = "GEOMETRIES AND GRACE NOTES";
        if (texts.h) texts.h.setAttribute("visible", "true");
    } else if (position.z >= -320 && position.z ) {
        textContainer.textContent = "SPRING/SUMMER 2017";
        headerContainer.textContent = "SPONTANEOUS PUNK CREATIVITY";
        if (texts.i) texts.i.setAttribute("visible", "true");
    } else if (position.z >= -365 && position.z ) {
        textContainer.textContent = "AUTUMN/WINTER 2021";
        headerContainer.textContent = "FUTURE UTILITY";
        if (texts.j) texts.j.setAttribute("visible", "true");
    }

    console.log("Header Updated:", headerContainer.textContent); // Debugging
}



// Ensure script runs after the page loads
window.onload = function() {
    setInterval(updateScene, 200);
    setInterval(updateZIndicator, 200);
};



