function cards(searchTerm = '') {
    // Obter a lista de usuários cadastrados do armazenamento local
    let usuariosCadastrados = JSON.parse(localStorage.getItem("login")).contatos;
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")).usuario;

    // Selecionar o elemento onde os cards serão adicionados
    let container = document.getElementById("container-dos-cards");

    // Limpar o container antes de adicionar os novos cards
    container.innerHTML = '';

    // Iterar sobre a lista de usuários cadastrados
    for (let usuario of usuariosCadastrados) {
        // Verificar se o usuário não é o usuário logado e se corresponde ao termo de busca
        if (usuario.nome !== usuarioLogado && usuario.nome.toLowerCase().includes(searchTerm.toLowerCase())) {
            // Criar elementos do card
            let cardDiv = `
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="assets/img/perfil${usuario.foto}.jpg" class="img-fluid rounded-start" alt="Foto de perfil">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">@${usuario.nome}</h5>
                                <p class="card-text">${usuario.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>`;

            // Criar o link para o perfil escolhido
            let link = `<a href="perfilescolhido.html?id=${usuario.nome}" class="text-decoration-none text-dark">${cardDiv}</a>`;

            // Adicionar o card ao container
            container.insertAdjacentHTML('beforeend', link);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    cards();

    // Adicionar evento ao botão de busca
    document.querySelector('.search-button').addEventListener('click', function() {
        var searchTerm = document.querySelector('.search-input').value;
        cards(searchTerm);
    });

    // Adicionar evento para filtrar conforme o usuário digita
    document.querySelector('.search-input').addEventListener('input', function() {
        var searchTerm = document.querySelector('.search-input').value;
        cards(searchTerm);
    });
});