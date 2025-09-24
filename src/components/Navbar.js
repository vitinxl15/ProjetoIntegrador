export default function Navbar() {
    /*DOM: Document Object Model: manipulado com JS*/
    const menu = document.createElement('div');

    /*Função innerHTML incorpora elemento HTML*/
    menu.innerHTML =
        `
        <nav class="navbar navbar-expand-lg" style="border-radius: 10px;">
            <div class="container-fluid">
                <a class="navbar-brand" style="display: none;" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="index.html">Inico</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="cadastro.html">Cadastro</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="login.html">Login</a>
                        </li>
                
                    </ul>
                </div>
            </div>
        </nav>
    `
    return menu;
}

