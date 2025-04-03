function updateCountdown() {
  const releaseDate = new Date('2025-04-11T00:09:00') // Adjust your next release date
  const now = new Date()
  const diff = releaseDate - now

  if (diff <= 0) {
    const message = 'Next Release: Released!'
    document
      .querySelectorAll('.countdown-marquee span')
      .forEach((span) => (span.textContent = message))
    return
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  const countdownMessage =
    `Next Release: ${days} days ${hours.toString().padStart(2, '0')} hours ` +
    `${minutes.toString().padStart(2, '0')} minutes ${seconds
      .toString()
      .padStart(2, '0')} seconds`

  document
    .querySelectorAll('.countdown-marquee span')
    .forEach((span) => (span.textContent = countdownMessage))
}

updateCountdown()
setInterval(updateCountdown, 1000)

// Cursor Logic
document.addEventListener('DOMContentLoaded', function () {
  let cursor = document.createElement('div')
  cursor.id = 'custom-cursor'
  document.body.appendChild(cursor)

  document.addEventListener('mousemove', function (event) {
    let mouseX = event.clientX
    let mouseY = event.clientY

    cursor.style.left = `${mouseX}px`
    cursor.style.top = `${mouseY}px`
  })

  // Store different cursor images for each link
  const cursors = {
    link1: '/Assets/landing/EVENT-cursors--08.png',
    link2: '/Assets/landing/EVENT-cursors--06.png',
    link3: '/Assets/landing/EVENT-cursors-01.png',
    link4: '/Assets/landing/EVENT-cursors-marc.png',
    link5: '/Assets/landing/EVENT-cursors--07.png',
    link6: '/Assets/landing/EVENT-cursors--07.png',
  }

  // Add event listeners to change cursor on hover
  document.querySelectorAll('.link-container a').forEach((link) => {
    link.addEventListener('mouseenter', function () {
      let className = [...this.classList].find((cls) => cursors[cls]) // Find matching class
      if (className) {
        cursor.style.backgroundImage = `url(${cursors[className]})`
        cursor.classList.add('active') // Trigger scaling animation
      }
    })

    link.addEventListener('mouseleave', function () {
      cursor.classList.remove('active') // Hide cursor with animation
    })
  })
})
