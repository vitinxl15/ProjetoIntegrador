export default function Footer() {
const rodape = document.createElement('div');
rodape.innerHTML = `
  <footer style="position: relative; bottom: 0; width: 100%; left: 0; justify-content: center; display: flex;">
    <p>&copy; Focinho Gelado - 2025</p>
  </footer>
`
return rodape;
}
