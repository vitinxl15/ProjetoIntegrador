function showPopup(message, title = '') {
  return new Promise((resolve) => {
    // se já existir, não duplicar
    if (document.getElementById('globalPopup')) {
      const content = document.getElementById('globalPopupMessage')
      content.textContent = message
      document.getElementById('globalPopupTitle').textContent = title
      document.getElementById('globalPopup').style.display = 'block'
      return
    }

    const overlay = document.createElement('div')
    overlay.id = 'globalPopup'
    overlay.style.position = 'fixed'
    overlay.style.left = 0
    overlay.style.top = 0
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.background = 'rgba(0,0,0,0.5)'
    overlay.style.display = 'flex'
    overlay.style.alignItems = 'center'
    overlay.style.justifyContent = 'center'
    overlay.style.zIndex = 2000

    const box = document.createElement('div')
    box.style.background = '#fff'
    box.style.padding = '20px'
    box.style.borderRadius = '8px'
    box.style.maxWidth = '400px'
    box.style.width = '90%'
    box.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'

    const t = document.createElement('h3')
    t.id = 'globalPopupTitle'
    t.style.marginTop = '0'
    t.style.marginBottom = '10px'
    t.textContent = title

    const msg = document.createElement('p')
    msg.id = 'globalPopupMessage'
    msg.textContent = message

    const btn = document.createElement('button')
    btn.textContent = 'OK'
    btn.style.marginTop = '12px'
    btn.className = 'btn'
    btn.addEventListener('click', () => {
      overlay.style.display = 'none'
      resolve()
    })

    box.appendChild(t)
    box.appendChild(msg)
    box.appendChild(btn)
    overlay.appendChild(box)
    document.body.appendChild(overlay)
  })
}
