function updateScene() {
    const camera = document.querySelector("a-camera");
    const textContainer = document.getElementById("scene-text");

    // Select text images by ID
    const texts = {
        a: document.querySelector('[src="#text-a"]'),
   /*     b: document.querySelector('[src="#text-b"]'),
        c: document.querySelector('[src="#text-c"]'),
        d: document.querySelector('[src="#text-d"]'),
        e: document.querySelector('[src="#text-e"]'),
        f: document.querySelector('[src="#text-f"]'),
        g: document.querySelector('[src="#text-g"]'),
        h: document.querySelector('[src="#text-h"]'),
        i: document.querySelector('[src="#text-i"]'),
        j: document.querySelector('[src="#text-j"]'),

        */
    };

    if (camera && textContainer) {
        const position = camera.object3D.position;
        console.log("Camera Z Position:", position.z); // Debugging check

        // Hide all text images by default
        Object.values(texts).forEach(text => {
            if (text) text.setAttribute("visible", "false");
        });

        // Update text and show correct image at the right Z position
        if (position.z > 0 && position.z < 50) {
            textContainer.textContent = "Autumn/Winter 1993";
            if (texts.a) texts.a.setAttribute("visible", "true");
       } else if (position.z > -40 && position.z < -1) {
            textContainer.textContent = "Autumn/Winter 2000";
            if (texts.b) texts.b.setAttribute("visible", "true");
        } else if (position.z > -80 && position.z < -41) {
            textContainer.textContent = "Autumn/Winter 2003";
            if (texts.c) texts.c.setAttribute("visible", "true");
        } else if (position.z > -123 && position.z < -81) {
            textContainer.textContent = "Spring/Summer 2006";
            if (texts.d) texts.d.setAttribute("visible", "true");
        } else if (position.z > -162 && position.z < -124) {
            textContainer.textContent = "Autumn/Winter 2006";
            if (texts.e) texts.e.setAttribute("visible", "true");
        } else if (position.z > -200 && position.z < -163) {
            textContainer.textContent = "Spring/Summer 2011";
            if (texts.f) texts.f.setAttribute("visible", "true");
        } else if (position.z > -242 && position.z < -201) {
            textContainer.textContent = "Spring/Summer 2015";
            if (texts.g) texts.g.setAttribute("visible", "true");
        } else if (position.z > -283 && position.z < -243) {
            textContainer.textContent = "Autumn/Winter 2016";
            if (texts.h) texts.h.setAttribute("visible", "true");
        } else if (position.z > -320 && position.z < -284) {
            textContainer.textContent = "Spring/Summer 2017";
            if (texts.i) texts.i.setAttribute("visible", "true");
        } else if (position.z > -365 && position.z < -321) {
            textContainer.textContent = "Autumn/Winter 2021";
            if (texts.j) texts.j.setAttribute("visible", "true");
            
        }
    }
}

// Function to update the Z-position indicator
function updateZIndicator() {
    const camera = document.querySelector("a-camera");
    const zIndicator = document.getElementById("z-indicator");

    if (camera && zIndicator) {
        const position = camera.object3D.position;
        zIndicator.textContent = `Z: ${position.z.toFixed(2)}`;
    }
}

// Run updates every 200ms
setInterval(updateZIndicator, 200);
setInterval(updateScene, 200);




        // Function to toggle the sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
  }
  
  // Function to handle the fixed button click
  function buttonClicked() {
    alert('Button clicked!');
  }

  console.log("scrollY", window.scrollY);

  const progressbar=document.querySelector(".progress-bar");

  window.onscroll= function(){ 
progressbar.style.transform=`scale(1, ${window.scrollY*0.0001})`;

console.log("string")
  }