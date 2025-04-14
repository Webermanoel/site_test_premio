const container = document.querySelector('.moedas-container');

    function criarMoeda() {
        const moeda = document.createElement('div');
        moeda.classList.add('moeda');

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        moeda.style.left = `${x}px`;
        moeda.style.top = `${y}px`;

        container.appendChild(moeda);
    }

    
    for (let i = 0; i < 40 ; i++) {
        criarMoeda();
    }

