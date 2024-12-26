const gameSearchInput = document.getElementById('game-search');
    const searchResults = document.getElementById('search-results');
    const loader = document.getElementById('loader');
    const searchtext = document.getElementById('ns');
    // Example game data for search
    const games = [
      {
        name: 'Game 1',
        image: 'https://via.placeholder.com/100',
        discordLink: 'https://discord.gg/example1'
      },
      {
        name: 'Game 2',
        image: 'https://via.placeholder.com/100',
        discordLink: 'https://discord.gg/example2'
      },
      {
        name: 'Game 3',
        image: 'https://via.placeholder.com/100',
        discordLink: 'https://discord.gg/example3'
      }
    ];

    function displayGames(gameArray) {
      // Clear current results
      searchResults.innerHTML = '';
      

      gameArray.forEach(game => {
        // Create game card element
        const gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        
        // Add game image and details
        gameCard.innerHTML = `
          <img src="${game.image}" alt="${game.name}" />
          <div>
            <h3 style="color: #38bdf8;">${game.name}</h3>
            <a href="${game.discordLink}" target="_blank">
              <button>Join Discord</button>
            </a>
          </div>
        `;
        
        // Add game card to the results container
        searchResults.appendChild(gameCard);

        // Trigger the fade-in animation after a 1.5s delay
        setTimeout(() => {
          gameCard.style.opacity = 1;
          gameCard.style.transform = 'translateY(0)';
        }, 1500);
      });
    }

    function searchGames(query) {
      loader.style.display = 'block'; // Show loader while fetching
      setTimeout(() => {
        loader.style.display = 'none'; // Hide loader after 1.5s
        const filteredGames = games.filter(game => game.name.toLowerCase().includes(query.toLowerCase()));
        displayGames(filteredGames);
      }, 1500); // Wait 1.5 seconds to simulate the loader
    }

    gameSearchInput.addEventListener('input', () => {
      const query = gameSearchInput.value;
      if (query.length >= 2) {
        searchGames(query);
      } else {
        searchResults.innerHTML = ''; // Clear results if input is empty
      }
      if (query.length < 2){
        searchtext.textContent = "Search for a game👋";
        
      }
      else{
        searchtext.textContent = "";
      }
      
    });
