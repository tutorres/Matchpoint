document.addEventListener("DOMContentLoaded", function () {
    // Extrair o parâmetro 'nome' da URL
    const urlParams = new URLSearchParams(window.location.search);
    const nome = urlParams.get('id'); // Aqui 'nome' é o nome na URL

    // Verificar se o 'nome' foi encontrado na URL
    if (nome) {
        // Obter os dados do localStorage
        const loginData = JSON.parse(localStorage.getItem('login'));
        
        // Verificar se os dados existem e o perfil pode ser encontrado pelo nome
        if (loginData && loginData.contatos) {
            const perfil = loginData.contatos.find(contato => contato.nome === nome);

            // Verificar se o perfil foi encontrado
            if (perfil) {
                // Exibir os detalhes do perfil na página
                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `
                    <div class="profile">
                        <div class="profile-info">
                            <div class="profile-img">
                                <img src="assets/img/perfil${perfil.foto}.jpg" alt="Foto de perfil">
                            </div>
                            <div class="profile-details">
                                <h1>${perfil.nome}</h1>
                                <div class="bio-section">
                                    <p>${perfil.bio}</p>
                                </div>
                                <div class="seguidores-seguindo">
                                    <p>
                                        <span id="seguidoresCount" class="link-clickable">Seguidores (${perfil.seguidores.length})</span>
                                    </p>
                                    <div id="seguidoresLista" class="lista-seguidores hidden"></div>
                                    <p>
                                        <span id="seguindoCount" class="link-clickable">Seguindo (${perfil.seguindo.length})</span>
                                    </p>
                                    <div id="seguindoLista" class="lista-seguindo hidden"></div>
                                </div>
                                <div id="btnSeguirContainer">
                                    ${renderizarBotaoSeguir(perfil, loginData)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Adicionar evento ao botão de seguir
                document.addEventListener('click', function(event) {
                    const usuarioLogado = localStorage.getItem('usuarioLogado');
                    const nomeUsuarioLogado = usuarioLogado ? JSON.parse(usuarioLogado).usuario : null;

                    if (event.target.id === 'btnSeguir' && nomeUsuarioLogado) {
                        // Código para seguir o perfil
                        if (!perfil.seguidores.includes(nomeUsuarioLogado)) {
                            perfil.seguidores.push(nomeUsuarioLogado);
                            localStorage.setItem('login', JSON.stringify(loginData));

                            const usuarioLogadoPerfil = loginData.contatos.find(contato => contato.nome === nomeUsuarioLogado);
                            if (!usuarioLogadoPerfil.seguindo.includes(perfil.nome)) {
                                usuarioLogadoPerfil.seguindo.push(perfil.nome);
                                localStorage.setItem('login', JSON.stringify(loginData));

                                atualizarSeguidoresSeguindo();
                                atualizarBotoesSeguir();
                            }
                        } else {
                            alert(`Você já está seguindo ${perfil.nome}`);
                        }
                    } else if (event.target.id === 'btnDeixarSeguir' && nomeUsuarioLogado) {
                        // Código para deixar de seguir o perfil
                        const indexSeguidor = perfil.seguidores.indexOf(nomeUsuarioLogado);
                        if (indexSeguidor !== -1) {
                            perfil.seguidores.splice(indexSeguidor, 1);
                            localStorage.setItem('login', JSON.stringify(loginData));

                            const usuarioLogadoPerfil = loginData.contatos.find(contato => contato.nome === nomeUsuarioLogado);
                            const indexSeguindo = usuarioLogadoPerfil.seguindo.indexOf(perfil.nome);
                            if (indexSeguindo !== -1) {
                                usuarioLogadoPerfil.seguindo.splice(indexSeguindo, 1);
                                localStorage.setItem('login', JSON.stringify(loginData));

                                atualizarSeguidoresSeguindo();
                                atualizarBotoesSeguir();
                            }
                        }
                    } else if (event.target.classList.contains('link-clickable')) {
                        // Mostrar seguidores/seguindo
                        if (event.target.id === 'seguidoresCount') {
                            showFollowersOrFollowing('seguidores');
                        } else if (event.target.id === 'seguindoCount') {
                            showFollowersOrFollowing('seguindo');
                        }
                    }
                });

                function atualizarSeguidoresSeguindo() {
                    const seguidoresCount = document.getElementById('seguidoresCount');
                    const seguindoCount = document.getElementById('seguindoCount');

                    seguidoresCount.textContent = `Seguidores (${perfil.seguidores.length})`;
                    seguindoCount.textContent = `Seguindo (${perfil.seguindo.length})`;
                }

                function atualizarBotoesSeguir() {
                    const btnSeguirContainer = document.getElementById('btnSeguirContainer');
                    btnSeguirContainer.innerHTML = renderizarBotaoSeguir(perfil, loginData);
                }

                function renderizarBotaoSeguir(perfil, loginData) {
                    const usuarioLogado = localStorage.getItem('usuarioLogado');
                    const nomeUsuarioLogado = usuarioLogado ? JSON.parse(usuarioLogado).usuario : null;

                    if (!nomeUsuarioLogado) {
                        return '<p>Faça login para seguir.</p>';
                    }

                    if (perfil.seguidores.includes(nomeUsuarioLogado)) {
                        return `
                            <button id="btnDeixarSeguir" class="btnDeixarSeguir">Deixar de Seguir</button>
                            <button id="btnSeguindo" class="btnSeguindo">Seguindo</button>
                        `;
                    } else {
                        return `<button id="btnSeguir" class="btnSeguir">Seguir</button>`;
                    }
                }
            } else {
                // Caso o perfil não seja encontrado
                const perfilDetails = document.getElementById('perfil-details');
                perfilDetails.innerHTML = `<p>Perfil não encontrado.</p>`;
            }
        } else {
            // Caso os dados não existam no localStorage
            const perfilDetails = document.getElementById('perfil-details');
            perfilDetails.innerHTML = `<p>Dados de perfil não encontrados.</p>`;
        }
    } else {
        // Caso o parâmetro 'nome' não seja encontrado na URL
        const perfilDetails = document.getElementById('perfil-details');
        perfilDetails.innerHTML = `<p>Parâmetro 'nome' não encontrado na URL.</p>`;
    }
});


