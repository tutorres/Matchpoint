document.addEventListener("DOMContentLoaded", function() {
    const gruposCriadosContainer = document.getElementById('grupos-criados-row');
    const gruposParticipandoContainer = document.getElementById('grupos-participando-row');
    const emptyCriadosMessage = document.getElementById('empty-criados-message');
    const emptyParticipandoMessage = document.getElementById('empty-participando-message');

    function loadGroups() {
        gruposCriadosContainer.innerHTML = '';
        gruposParticipandoContainer.innerHTML = '';

        const gruposJSON = localStorage.getItem('grupos');
        let grupos = gruposJSON ? JSON.parse(gruposJSON) : [];
        const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;

        // Filtrar grupos onde o dono é igual ao usuário logado
        const gruposCriados = grupos.filter(grupo => grupo.Criador === user);
        const gruposParticipando = grupos.filter(grupo => grupo.participantes && grupo.participantes.includes(user) && grupo.Criador !== user);

        // Carregar grupos criados pelo usuário
        if (gruposCriados.length === 0) {
            emptyCriadosMessage.style.display = 'block';
        } else {
            emptyCriadosMessage.style.display = 'none';
            gruposCriados.forEach((grupo, index) => {
                const col = document.createElement('div');
                col.className = 'col-md-6';

                const card = createGroupCard(grupo, false);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger btn-sair';
                deleteButton.textContent = 'Deletar';
                deleteButton.onclick = () => showConfirmDelete(card, index, deleteButton);

                card.appendChild(deleteButton);

                col.appendChild(card);
                gruposCriadosContainer.appendChild(col);
            });
        }

        // Carregar grupos em que o usuário participa
        if (gruposParticipando.length === 0) {
            emptyParticipandoMessage.style.display = 'block';
        } else {
            emptyParticipandoMessage.style.display = 'none';
            gruposParticipando.forEach((grupo, index) => {
                const col = document.createElement('div');
                col.className = 'col-md-6';

                const card = createGroupCard(grupo, true);

                const leaveButton = document.createElement('button');
                leaveButton.textContent = 'Sair';
                leaveButton.className = 'btn btn-danger btn-sair';
                leaveButton.addEventListener('click', function() {
                    // Remover o usuário atual do array participantes do grupo específico
                    grupo.participantes = grupo.participantes.filter(member => member !== user);
                    // Atualizar o localStorage com o grupo modificado
                    localStorage.setItem('grupos', JSON.stringify(grupos));
                    // Recarregar os grupos para refletir a mudança
                    loadGroups();
                });

                card.appendChild(leaveButton);

                col.appendChild(card);
                gruposParticipandoContainer.appendChild(col);
            });
        }
    }

    function createGroupCard(grupo, showCreator) {
        const card = document.createElement('div');
        card.className = 'card grupo';

        const title = document.createElement('h2');
        title.textContent = grupo.nome;

        const date = document.createElement('p');
        date.textContent = grupo.data;

        if (showCreator) {
            const creatorName = document.createElement('p');
            creatorName.textContent = `Criador: ${grupo.Criador}`;
            creatorName.className = 'creator-name'; // Adicionando uma classe para estilização
            card.appendChild(creatorName);
        }

        const location = document.createElement('p');
        location.textContent = grupo.local;

        const sport = document.createElement('p');
        sport.textContent = grupo.esporte;

        const participantsCount = document.createElement('p');
        participantsCount.textContent = `Participantes: ${grupo.participantes.length + 1}`;

        const imageNumber = grupo.imagem;
        let imageName;
        if (grupo.esporte.toLowerCase() === "futebol") {
            imageName = `futebol${imageNumber}.png`;
        } else if (grupo.esporte.toLowerCase() === "volei") {
            imageName = `volei${imageNumber}.png`;
        } else if (grupo.esporte.toLowerCase() === "basquete") {
            imageName = `basquete${imageNumber}.png`;
        } else {
            imageName = `default.png`;
        }

        const img = document.createElement('img');
        img.src = `assets/img/${imageName}`;
        img.alt = grupo.esporte;
        img.className = 'card-img-top';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';
        imgContainer.appendChild(img);

        card.appendChild(imgContainer);
        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(location);
        card.appendChild(sport);
        card.appendChild(participantsCount); // Adiciona o contador de participantes

        // Botão "Mais Detalhes"
        const detalhesButton = document.createElement('a');
        detalhesButton.textContent = 'Mais Detalhes';
        detalhesButton.className = 'btn btn-info btn-detalhes';
        detalhesButton.href = `detalhes_grupo.html?grupo=${encodeURIComponent(grupo.nome)}`; // Link para detalhes do grupo
        
        card.appendChild(detalhesButton);

        return card;
    }

    function showConfirmDelete(card, index, deleteButton) {
        const confirmDelete = document.createElement('div');
        confirmDelete.className = 'confirm-delete';

        const confirmText = document.createElement('p');
        confirmText.textContent = 'Tem certeza que deseja deletar este grupo?';

        const confirmYes = document.createElement('button');
        confirmYes.className = 'confirm-yes';
        confirmYes.textContent = 'Sim';
        confirmYes.onclick = () => deleteGroup(card, index, confirmDelete);

        const confirmNo = document.createElement('button');
        confirmNo.className = 'confirm-no';
        confirmNo.textContent = 'Não';
        confirmNo.onclick = () => cancelDelete(confirmDelete, deleteButton);

        confirmDelete.appendChild(confirmText);
        confirmDelete.appendChild(confirmYes);
        confirmDelete.appendChild(confirmNo);

        card.appendChild(confirmDelete);
        deleteButton.disabled = true;
    }

    function deleteGroup(card, index, confirmDelete) {
        // Remover grupo do localStorage
        const gruposJSON = localStorage.getItem('grupos');
        let grupos = gruposJSON ? JSON.parse(gruposJSON) : [];
        grupos.splice(index, 1);
        localStorage.setItem('grupos', JSON.stringify(grupos));

        // Remover card da interface
        card.parentNode.removeChild(card);

        // Esconder confirmação de deletar
        confirmDelete.parentNode.removeChild(confirmDelete);

        // Atualizar mensagem de grupos vazios se necessário
        if (gruposCriadosContainer.children.length === 0) {
            emptyCriadosMessage.style.display = 'block';
        }
        if (gruposParticipandoContainer.children.length === 0) {
            emptyParticipandoMessage.style.display = 'block';
        }
    }

    function cancelDelete(confirmDelete, deleteButton) {
        confirmDelete.parentNode.removeChild(confirmDelete);
        deleteButton.disabled = false;
    }

    loadGroups();
});
