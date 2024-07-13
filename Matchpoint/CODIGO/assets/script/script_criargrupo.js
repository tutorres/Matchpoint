document.addEventListener('DOMContentLoaded', function() {
    var dataInput = document.getElementById('data');
    var jogadoresInput = document.getElementById('jogadores');
    var esporteSelect = document.getElementById('esporte');
    var placeholder = document.querySelector('.foto-placeholder');
    var avisoEsporteNaoSelecionado = document.getElementById('avisoEsporteNaoSelecionado');
    var avisoDataInvalida = document.getElementById('avisoDataInvalida');
    //let Nomeusuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    limiteMaximoMensagem.style.display = 'none';

    

    // Verifica a data selecionada
    dataInput.addEventListener("change", function() {
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        var partesData = dataInput.value.split("-");
        var dataSelecionada = new Date(partesData[0], partesData[1] - 1, partesData[2]);

        if (dataSelecionada < hoje) {
            avisoDataInvalida.style.display = "block";
        } else {
            avisoDataInvalida.style.display = "none";
        }
    });

    // Verifica o número de jogadores
    jogadoresInput.addEventListener('input', function() {
        var avisoLimitemax = document.getElementById('avisoLimitemax');
        var jogadoresValue = parseInt(jogadoresInput.value, 10);

        if (jogadoresValue > 30) {
            avisoLimitemax.style.display = 'block';
        } else {
            avisoLimitemax.style.display = 'none';
        }
    });
    jogadoresInput.addEventListener('input', function() {
        var avisoLimitemin = document.getElementById('avisoLimitemin');
        var jogadoresValue = parseInt(jogadoresInput.value, 10);

        if (jogadoresValue < 2) {
            avisoLimitemin.style.display = 'block';
        } else {
            avisoLimitemin.style.display = 'none';
        }
    });

    // Atualiza as opções de imagem e comportamento do placeholder ao alterar o esporte selecionado
    esporteSelect.addEventListener('change', function() {
        var selectedSport = esporteSelect.value;

        if (selectedSport) {
            placeholder.onclick = function() {
                showImageSelection(selectedSport);
            };
            avisoEsporteNaoSelecionado.style.display = 'none';
        } else {
            placeholder.onclick = null;
            avisoEsporteNaoSelecionado.style.display = 'block';
        }

        var imageSelectionContainer = document.getElementById('imageSelection');
        imageSelectionContainer.innerHTML = '';

        if (selectedSport === 'volei') {
            criarOpcaoDeImagem('assets/img/volei1.png');
            criarOpcaoDeImagem('assets/img/volei2.png');
            criarOpcaoDeImagem('assets/img/volei3.png');
        } else if (selectedSport === 'futebol') {
            criarOpcaoDeImagem('assets/img/futebol1.png');
            criarOpcaoDeImagem('assets/img/futebol2.png');
            criarOpcaoDeImagem('assets/img/futebol3.png');
        } else if (selectedSport === 'basquete') {
            criarOpcaoDeImagem('assets/img/basquete1.png');
            criarOpcaoDeImagem('assets/img/basquete2.png');
            criarOpcaoDeImagem('assets/img/basquete3.png');
        }
    });

});

// Função para criar uma opção de imagem
function criarOpcaoDeImagem(imagePath) {
    var imageOption = document.createElement('div');
    imageOption.classList.add('image-option');
    imageOption.onclick = function() {
        selectImage(imagePath);
    };

    var img = document.createElement('img');
    img.src = imagePath;
    img.alt = 'Imagem';

    imageOption.appendChild(img);
    document.getElementById('imageSelection').appendChild(imageOption);
}

// Função para mostrar o contêiner de seleção de imagem
function showImageSelection(selectedSport) {
    var imageSelectionContainer = document.getElementById('imageSelectionContainer');
    imageSelectionContainer.style.display = 'flex';
    document.body.classList.add('modal-open');
    atualizarOpcoesDeImagem(selectedSport);
}

// Função para esconder o contêiner de seleção de imagem
function hideImageSelection(event) {
    if (event.target.id === 'imageSelectionContainer') {
        var imageSelectionContainer = document.getElementById('imageSelectionContainer');
        imageSelectionContainer.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Função para selecionar uma imagem
function selectImage(imagePath) {
    var placeholder = document.querySelector('.foto-placeholder');
    placeholder.style.backgroundImage = 'url(' + imagePath + ')';
    placeholder.style.backgroundSize = 'cover';
    placeholder.style.backgroundPosition = 'center';
    placeholder.style.border = 'none';
    placeholder.innerHTML = '';

    var imageNumber = imagePath.match(/\d+/)[0];
    document.getElementById('fotoInput').value = imageNumber;
    document.getElementById('removerImagemBtn').style.display = 'block';
    document.getElementById('imageSelectionContainer').style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Função para remover a imagem selecionada
function removerImagem() {
    var placeholder = document.querySelector('.foto-placeholder');
    placeholder.style.backgroundImage = 'none';
    document.getElementById('fotoInput').value = '';
    document.getElementById('removerImagemBtn').style.display = 'none';
}

// Função para salvar os valores do formulário em um objeto JSON
function salvarFormulario(event) {
    event.preventDefault();

    var dataInput = document.getElementById("data");
    var hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    var partesData = dataInput.value.split("-");
    var dataSelecionada = new Date(partesData[0], partesData[1] - 1, partesData[2]);

    if (dataSelecionada < hoje) {
        document.getElementById("avisoDataInvalida").style.display = "block";
        return;
    }

    var nome = document.getElementById('nome').value;
    var esporte = document.getElementById('esporte').value;
    var horario = document.getElementById('horario').value;
    var local = document.getElementById('local').value;
    var jogadoresInput = document.getElementById('jogadores');
    var descricao = document.getElementById('descricao').value;
    var fotoInput = document.getElementById('fotoInput').value;
    var Criador = JSON.parse(localStorage.getItem('usuarioLogado')).usuario;
    
    if (!nome || !esporte || !dataInput.value || !horario || !jogadores || !local || !descricao || !fotoInput) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    var grupos = JSON.parse(localStorage.getItem('grupos')) || [];
    var participantes = [];
    var jogadoresValue = parseInt(jogadoresInput.value);
    var formulario = {
        "Criador" : Criador,
        "nome": nome,
        "data": dataInput.value + " " + horario,
        "local": local,
        "jogadores" : jogadoresValue,
        "descricao" : descricao,
        "esporte": esporte,
        "imagem": parseInt(fotoInput),
        "participantes" : participantes
        
    };

    grupos.push(formulario);
    
    localStorage.setItem('grupos', JSON.stringify(grupos));

    document.getElementById('nome').value = '';
    document.getElementById('esporte').value = '';
    dataInput.value = '';
    document.getElementById('horario').value = '';
    document.getElementById('jogadores').value = '';
    document.getElementById('local').value = '';
    document.getElementById('descricao').value = '';
    removerImagem();

    alert("Grupo criado com sucesso!");
}

function exibirMensagemLimiteMaximo() {
    var limiteMaximoMensagem = document.getElementById('limiteMaximoMensagem');
    limiteMaximoMensagem.style.display = '';
}
function verMeusGrupos() {
    // Altera o URL para a página desejada
    window.location.href = 'MeusGrupos.html';
}
// Função para exibir o contêiner com a imagem do local
function exibirImagemLocal() {
    var localImageContainer = document.getElementById('localImageContainer');
    localImageContainer.style.display = 'block';
}

// Adicione isso ao script no final, antes do </script> que fecha o body
document.addEventListener('DOMContentLoaded', function() {
    var localInput = document.getElementById('local');

    localInput.addEventListener('click', function() {
        exibirImagemLocal();
    });
});
// script.js
document.addEventListener("DOMContentLoaded", function() {
    const areas = document.querySelectorAll(".hover-area");
    areas.forEach(area => {
        area.addEventListener("click", function(event) {
            event.preventDefault();
areas.forEach(a => a.classList.remove("selected"));
this.classList.add("selected");

const localSelecionado = this.getAttribute("data-local");
document.getElementById('local').value = localSelecionado;

            // Aqui você pode adicionar qualquer lógica adicional necessária
        });
    });
});
function ocultarLocalContainer() {
    document.getElementById('localImageContainer').style.display = 'none';
}
