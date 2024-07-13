function loadData() {
    console.log('Loading data...');
    let profileData = JSON.parse(localStorage.getItem('usuarioLogado')) || {
        "usuario": "user1",
    };

    let loginData = JSON.parse(localStorage.getItem('login'));

    let index = loginData.contatos.findIndex(contato => contato.nome === profileData.usuario);
    if (index !== -1) {
        profileData.bio = loginData.contatos[index].bio;
    }

    return { profileData, loginData, index };
}

function saveProfileData(profileData, loginData) {
    localStorage.setItem('usuarioLogado', JSON.stringify(profileData));
    localStorage.setItem('login', JSON.stringify(loginData));
}

function exibirFotoUsuario() {
    const { profileData, loginData, index } = loadData();

    if (index !== -1) {
        const fotoIndex = loginData.contatos[index].foto;
        const fotoElement = document.getElementById('userPhoto');
        
        if (fotoElement) {
            fotoElement.src = `assets/img/perfil${fotoIndex}.jpg`; // Nome da foto baseado no índice
        } else {
            console.error("Element with ID 'userPhoto' not found");
        }
    } else {
        console.error("User not found in loginData");
    }
}

function abrirSeletorDeImagens() {
    const { loginData, index } = loadData();
    const fotoIndex = loginData.contatos[index].foto;

    const photoSelector = document.getElementById('photoSelector');
    const photoOptions = document.getElementById('photoOptions');

    photoOptions.innerHTML = ''; // Limpa as opções anteriores

    for (let i = 0; i < 8; i++) {
        if (i !== fotoIndex) {
            const imgOption = document.createElement('img');
            imgOption.src = `assets/img/perfil${i}.jpg`;
            imgOption.classList.add('photo-option');
            imgOption.dataset.index = i; // Armazena o índice da imagem
            imgOption.addEventListener('click', selecionarImagem);
            photoOptions.appendChild(imgOption);
        }
    }

    photoSelector.style.display = 'block';
    photoSelector.style.position = 'fixed';
    photoSelector.style.top = '50%';
    photoSelector.style.left = '50%';
    photoSelector.style.transform = 'translate(-50%, -50%)'; // Mostra o seletor de imagens
}

function selecionarImagem(event) {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        selectedPhoto.classList.remove('selected');
    }
    event.target.classList.add('selected');
}

function confirmarImagem() {
    const selectedPhoto = document.querySelector('.photo-option.selected');
    if (selectedPhoto) {
        const newPhotoIndex = selectedPhoto.dataset.index;
        const { profileData, loginData, index } = loadData();

        // Atualiza o índice da foto no objeto de loginData se o usuário estiver presente nos contatos
        if (index !== -1) {
            loginData.contatos[index].foto = parseInt(newPhotoIndex, 10);
            saveProfileData(profileData, loginData); // Salva os dados atualizados no localStorage
            exibirFotoUsuario(); // Atualiza a foto exibida
            alert("Foto alterada com sucesso!");
        }
    }

    const photoSelector = document.getElementById('photoSelector');
    photoSelector.style.display = 'none'; // Esconde o seletor de imagens
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Document loaded');
    loadProfile();
    exibirFotoUsuario(); // Chama a função para exibir a foto do usuário

    const editPhotoButton = document.getElementById('editPhotoButton');
    editPhotoButton.addEventListener('click', abrirSeletorDeImagens);

    const confirmPhotoButton = document.getElementById('confirmPhotoButton');
    confirmPhotoButton.addEventListener('click', confirmarImagem);
});

function loadProfile() {
    const { profileData, loginData, index } = loadData();

    console.log('Loaded profile data:', profileData);

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = profileData.usuario; // Exibir o nome de usuário
    } else {
        console.error("Element with ID 'usernameDisplay' not found");
    }

    const passwordDisplay = document.getElementById('passwordDisplay');
    if (passwordDisplay) {
        passwordDisplay.textContent = "*********"; // Ajuste conforme necessário
    } else {
        console.error("Element with ID 'passwordDisplay' not found");
    }

    const bioElement = document.getElementById('bio');
    if (bioElement) {
        if (index !== -1) {
            bioElement.innerText = loginData.contatos[index].bio;
        } else {
            bioElement.innerText = "Bio não encontrada";
        }
    } else {
        console.error("Element with ID 'bio' not found");
    }

    const commentsList = document.getElementById('commentsList');
    if (commentsList) {
        commentsList.innerHTML = ''; // Limpa a lista de comentários antes de recarregar
    }
}

function saveBio() {
    const { profileData, loginData } = loadData();
    const newBio = document.getElementById('bio').textContent;

    const index = loginData.contatos.findIndex(contato => contato.nome === profileData.usuario);
    if (index !== -1) {
        loginData.contatos[index].bio = newBio;
    }

    saveProfileData(profileData, loginData); // Salva os dados atualizados no localStorage

    alert("Bio salva com sucesso!");
}



function updatePasswordInContacts(username, newPassword, loginData) {
    loginData.contatos = loginData.contatos.map(contato => {
        if (contato.nome === username) {
            return { ...contato, senha: newPassword };
        }
        return contato;
    });
}



function changePassword() {
    const { profileData, loginData } = loadData();
    const newPassword = prompt("Digite sua nova senha:");

    if (newPassword) {
        profileData.senha = newPassword;

        updatePasswordInContacts(profileData.usuario, newPassword, loginData);

        saveProfileData(profileData, loginData);

        const passwordDisplay = document.getElementById('passwordDisplay');
        if (passwordDisplay) {
            passwordDisplay.textContent = "*********";
        }

        alert("Senha alterada com sucesso!");
    }
}
