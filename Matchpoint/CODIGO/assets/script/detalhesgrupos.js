document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar os detalhes do grupo
    function loadGroupDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const grupoNome = urlParams.get('grupo');

        // Buscar o grupo pelo nome no localStorage
        const gruposJSON = localStorage.getItem('grupos');
        const grupos = gruposJSON ? JSON.parse(gruposJSON) : [];
        const grupo = grupos.find(g => g.nome === grupoNome);

        if (grupo) {
            // Exibir os detalhes do grupo na página
            const grupoDetailsContent = document.getElementById('grupo-details-content');
            
            // Construir a URL da imagem baseada no esporte e no valor da imagem
            const imgUrl = `assets/img/${grupo.esporte}${grupo.imagem}.png`;

            // Montar a lista de participantes incluindo o criador
            const participantes = [grupo.Criador, ...grupo.participantes];

            grupoDetailsContent.innerHTML = `
                <p><strong><span style="color: #f36f21;">Nome: </strong></span><span style="color: white;"> ${grupo.nome}</span></p>
                <p><strong><span style="color: #f36f21;">Data e Horário:</strong></span><span style="color: white;"> ${grupo.data}</span></p>
                <p><strong><span style="color: #f36f21;">Criador:</strong></span><span style="color: white;"> ${grupo.Criador}</span></p>
                <p><strong><span style="color: #f36f21;">Local:</strong></span><span style="color: white;"> ${grupo.local}</span></p>
                <p><strong><span style="color: #f36f21;">Esporte:</strong></span><span style="color: white;"> ${grupo.esporte}</span></p>
                <p><strong><span style="color: #f36f21;">Participantes:</strong> </span><span style="color: white;">${participantes.join(', ')}</span></p>
                <p><strong><span style="color: #f36f21;">Descrição:</strong> </span><span style="color: white;">${grupo.descricao}</span></p>
                <img src="${imgUrl}" alt="Imagem do grupo ${grupo.nome}">
            `;
        
        
            // Verificar se o usuário atual é o criador do grupo
            const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;
            const isCriador = grupo.Criador === user;

            // Adicionar botão de deletar apenas se o usuário for o criador
            if (isCriador) {
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Deletar';
                deleteButton.className = 'btn btn-danger btn-deletar';
                deleteButton.addEventListener('click', function() {
                    // Mostrar confirmação de deletar
                    showConfirmDelete(grupoDetailsContent, grupo, deleteButton);
                });
                grupoDetailsContent.appendChild(deleteButton);
            }
        } else {
            // Se o grupo não for encontrado, exibir mensagem de erro
            const grupoDetailsContent = document.getElementById('grupo-details-content');
            grupoDetailsContent.innerHTML = '<p>Grupo não encontrado.</p>';
        }
    }

    function showConfirmDelete(grupoDetailsContent, grupo, deleteButton) {
        const confirmDelete = document.createElement('div');
        confirmDelete.className = 'confirm-delete';

        const confirmText = document.createElement('p');
        confirmText.textContent = 'Tem certeza que deseja deletar este grupo?';

        const confirmYes = document.createElement('button');
        confirmYes.className = 'confirm-yes';
        confirmYes.textContent = 'Sim';
        confirmYes.addEventListener('click', function() {
            // Implementar a lógica para deletar o grupo
            deleteGroup(grupo);
        });

        const confirmNo = document.createElement('button');
        confirmNo.className = 'confirm-no';
        confirmNo.textContent = 'Não';
        confirmNo.addEventListener('click', function() {
            // Cancelar a deleção
            cancelDelete(confirmDelete, deleteButton);
        });

        confirmDelete.appendChild(confirmText);
        confirmDelete.appendChild(confirmYes);
        confirmDelete.appendChild(confirmNo);

        grupoDetailsContent.appendChild(confirmDelete);
        deleteButton.disabled = true;
    }

    function deleteGroup(grupo) {
        // Remover grupo do localStorage
        const gruposJSON = localStorage.getItem('grupos');
        let grupos = gruposJSON ? JSON.parse(gruposJSON) : [];
        const index = grupos.findIndex(g => g.nome === grupo.nome);
        grupos.splice(index, 1);
        localStorage.setItem('grupos', JSON.stringify(grupos));

        // Redirecionar para a página inicial ou outra página apropriada após deletar
        window.location.href = 'pagina_inicial.html';
    }

    function cancelDelete(confirmDelete, deleteButton) {
        confirmDelete.parentNode.removeChild(confirmDelete);
        deleteButton.disabled = false;
    }

    loadGroupDetails();
});
