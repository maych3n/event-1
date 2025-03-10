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