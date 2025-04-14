document.querySelector('#login').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const identificador = document.querySelector('#nome').value;
    const senha = document.querySelector('#senha').value;
  
    try {
      const response = await fetch('https://SEU-APP-RAILWAY/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identificador, senha })
      });
  
      const data = await response.json();
  
      if (data.sucesso) {
        window.location.href = `/conta.html?usuario=${data.dados.nome}`;
      } else {
        alert(data.mensagem);
      }
  
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao tentar fazer login.');
    }
  });
  