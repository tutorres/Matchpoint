document.addEventListener("DOMContentLoaded", function() {
    const gruposContainer = document.getElementById('grupos-row');
    const emptyMessage = document.getElementById('empty-message');

    function loadGroups() {
        gruposContainer.innerHTML = '';
        const gruposJSON = localStorage.getItem('grupos');
        let grupos = gruposJSON ? JSON.parse(gruposJSON) : [];
        const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;

        // Filtra os grupos onde o usuário não é o criador nem participante
        const gruposParticipante = grupos.filter(grupo => grupo.participantes.includes(user) && grupo.Criador !== user);
        const gruposNaoParticipante = grupos.filter(grupo => !grupo.participantes.includes(user) && grupo.Criador !== user);

        if (gruposParticipante.length === 0 && gruposNaoParticipante.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';

            // Mostrar grupos dos quais o usuário participa
            if (gruposParticipante.length > 0) {
                const participandoTitle = document.createElement('h2');
                participandoTitle.textContent = 'Grupos que você participa';
                participandoTitle.classList.add('participando-title');
                gruposContainer.appendChild(participandoTitle);

                gruposParticipante.forEach((grupo, index) => {
                    const col = document.createElement('div');
                    col.className = 'col-md-6';

                    const card = createGroupCard(grupo, true);

                    const leaveButton = card.querySelector('.btn-sair');
                    leaveButton.addEventListener('click', function() {
                        // Remover o usuário atual do array participantes do grupo específico
                        grupo.participantes = grupo.participantes.filter(member => member !== user);
                        // Atualizar o localStorage com o grupo modificado
                        localStorage.setItem('grupos', JSON.stringify(grupos));
                        // Recarregar os grupos para refletir a mudança
                        loadGroups();
                    });

                    col.appendChild(card);
                    gruposContainer.appendChild(col);
                });
            }

            // Mostrar grupos dos quais o usuário não participa
            if (gruposNaoParticipante.length > 0) {
                const disponiveisTitle = document.createElement('h2');
                disponiveisTitle.textContent = 'Grupos disponíveis';
                disponiveisTitle.classList.add('participando-title');
                gruposContainer.appendChild(disponiveisTitle);

                gruposNaoParticipante.forEach((grupo, index) => {
                    const col = document.createElement('div');
                    col.className = 'col-md-6';

                    const card = createGroupCard(grupo, false);

                    const followButton = card.querySelector('.btn-seguir');
                    followButton.addEventListener('click', function() {
                        // Encontrar o índice do grupo atual no array de grupos
                        const index = grupos.findIndex(g => g.nome === grupo.nome);
                        if (index !== -1 && grupo.participantes.length+1 < grupo.jogadores) {
                            // Adicionar o usuário atual ao array participantes do grupo encontrado
                            grupos[index].participantes.push(user);
                            // Atualizar o localStorage com o grupo modificado
                            localStorage.setItem('grupos', JSON.stringify(grupos));
                            // Recarregar os grupos para refletir a mudança
                            loadGroups();
                        } else {
                            alert(`O grupo atingiu o número máximo de participantes (${grupo.jogadores}).`);
                        }
                    });

                    col.appendChild(card);
                    gruposContainer.appendChild(col);
                });
            }
        }
    }

    function createGroupCard(grupo, isParticipante) {
        const card = document.createElement('div');
        card.className = 'card grupo';

        const title = document.createElement('h2');
        title.textContent = grupo.nome;

        const date = document.createElement('p');
        date.textContent = 'Data e Horário: ' + grupo.data;

        const Criador = document.createElement('p');
        Criador.textContent = `Criador: ${grupo.Criador}`;
        Criador.className = 'criador'; // Adicionando uma classe para estilização

        const location = document.createElement('p');
        location.textContent = `Local: ${grupo.local}`;

        const sport = document.createElement('p');
        sport.textContent = `Esporte: ${grupo.esporte}`;

        const participantsCount = document.createElement('p');
        participantsCount.textContent = `Participantes: ${grupo.participantes.length + 1}`;

        const imageNumber = grupo.imagem;
        let imageName;
        switch (grupo.esporte.toLowerCase()) {
            case "futebol":
                imageName = `futebol${imageNumber}.png`;
                break;
            case "volei":
                imageName = `volei${imageNumber}.png`;
                break;
            case "basquete":
                imageName = `basquete${imageNumber}.png`;
                break;
            default:
                imageName = `default.png`;
                break;
        }

        const img = document.createElement('img');
        img.src = `assets/img/${imageName}`;
        img.alt = grupo.esporte;
        img.className = 'card-img-top';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.appendChild(img);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'card-button-container';

        if (isParticipante) {
            // Botão de sair do grupo
            const leaveButton = document.createElement('button');
            leaveButton.textContent = 'Sair';
            leaveButton.className = 'btn btn-danger btn-sair';
            buttonContainer.appendChild(leaveButton);
            const participando = document.createElement('button');
            participando.textContent = 'Participando';
            participando.className = 'btn participando';
            buttonContainer.appendChild(participando);
        } else {
            // Botão de participar do grupo
            const followButton = document.createElement('button');
            followButton.textContent = 'Participar';
            followButton.className = 'btn btn-primary btn-seguir';
            buttonContainer.appendChild(followButton);
        }

        // Botão "Mais Detalhes" que leva para uma nova página
        const detalhesButton = document.createElement('a');
        detalhesButton.textContent = 'Mais Detalhes';
        detalhesButton.className = 'btn btn-info btn-detalhes';
        detalhesButton.href = `detalhes_grupo.html?grupo=${encodeURIComponent(grupo.nome)}`; // Link para detalhes do grupo
       

        buttonContainer.appendChild(detalhesButton);

        card.appendChild(imgContainer);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(Criador); // Adiciona o Criador antes de location e sport
        card.appendChild(location);
        card.appendChild(sport);
        card.appendChild(participantsCount); // Adiciona o contador de participantes
        card.appendChild(buttonContainer);

        return card;
    }

    loadGroups();
});
