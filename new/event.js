const modal = document.getElementById('modal');
    const eventContainer = document.getElementById('event-container');
    const participateBtn = document.getElementById('participate-btn');
    const lockedBtn = document.getElementById('locked-btn');
    const profileLink = document.getElementById('profile-link');
  

    function showModal() {
      modal.classList.add('open');
      eventContainer.classList.add('blurred');
      if (!loggedIn) {
        participateBtn.style.display = 'none';
        lockedBtn.style.display = 'block';
      } else {
        participateBtn.style.display = 'block';
        lockedBtn.style.display = 'none';
      }
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    function closeModal() {
      modal.classList.remove('open');
      eventContainer.classList.remove('blurred');
    }
        function checkToken() {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.slice(1));
        const token = params.get('access_token');
        if (token) {
          localStorage.setItem('discord_token', token);
          fetchUserInfo(token);
          fetchUserGuilds(token);
        }
      }
    }

    async function fetchUserInfo(token) {
      try {
        const response = await fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await response.json();
        wname.textContent = user.username

        profileLink.querySelector('a').innerHTML = `<img src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%;"> ${user.username}`;
        loginBtn.style.display = 'none';
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    }

    async function fetchUserGuilds(token) {
      try {
        const response = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const guildMember = await response.json();

        if (guildMember.roles.includes(MOD_ROLE_ID)) {
          adminLabel.style.display = 'block';
        }
      } catch (err) {
        console.error('Error fetching user guild info:', err);
      }
    }

    
    window.addEventListener('DOMContentLoaded', () => {
      
      const token = localStorage.getItem('discord_token');
      if (token) loggedIn = true;
    });
