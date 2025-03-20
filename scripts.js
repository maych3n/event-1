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

  // cursor //
  document.addEventListener("DOMContentLoaded", function () {
    let cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", function (event) {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Store different cursor images for each link
    const cursors = {
        "link1": "/Assets/landing/EVENT-cursors-01.png",
        "link2": "/Assets/landing/EVENT-cursors-04.png",
        "link3": "/Assets/landing/EVENT-cursors-02.png",
        "link4": "/Assets/landing/EVENT-cursors-03.png",
        "link5": "/Assets/landing/EVENT-cursors-05.png",
        "link6": "/Assets/landing/EVENT-cursors-06.png"
    };

    // Add event listeners to change cursor on hover
    document.querySelectorAll(".link-container a").forEach(link => {
        link.addEventListener("mouseenter", function () {
            let className = [...this.classList].find(cls => cursors[cls]); // Find matching class
            if (className) {
                cursor.style.backgroundImage = `url(${cursors[className]})`;
                cursor.classList.add("active"); // Trigger scaling animation
            }
        });

        link.addEventListener("mouseleave", function () {
            cursor.classList.remove("active"); // Hide cursor with animation
        });
    });
});

