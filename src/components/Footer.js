export default function Footer() {

const footer = document.createElement('footer');

footer.innerHtml = `
  <footer style="position: relative; bottom: 0; width: 100%; left: 0; justify-content: center; display: flex;">
    <p>&copy; Focinho Gelado - 2025</p>
  </footer>
`
return footer;
}
