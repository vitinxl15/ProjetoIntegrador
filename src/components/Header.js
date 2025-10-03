export default function Header() {
const header = document.createElement('header');

header.innerHTML = `
  <header>
    <div class="headerContainer">
      <div class="logo">
        <img src="../public/assets/img/logo.png" class="logoImg" alt="Logo" />
        <h1>Focinho Gelado</h1>
      </div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary" style="background-image: url(img/fundo.png) ; border-radius: 10px;">
  <div class="container-fluid">
    <a class="navbar-brand" style="display: none;" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#/home">Inico</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/cadastro">Cadastro</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/login">Login</a>
        </li>

      </ul>
    </div>
  </div>
</nav>
    </div>

  </header>
`
return header;
}
