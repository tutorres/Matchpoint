// Dados de exemplo simulando usuário logado e lista de logins
const user = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;

// Atualiza o nome de usuário no dropdown
document.getElementById('userNameDropdown').textContent = user;
