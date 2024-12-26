const loginPopup = document.getElementById('login-popup');
    const cookiePopup = document.getElementById('cookie-popup');

    function showPopup() {
      loginPopup.classList.add('visible');
      setTimeout(() => closePopup(), 5000); // Auto-close after 5 seconds
    }

    function closePopup() {
      loginPopup.classList.remove('visible');
    }

    function acceptCookies() {
      cookiePopup.classList.remove('visible');
      localStorage.setItem('cookiesAccepted', 'true');
    }

    window.addEventListener('DOMContentLoaded', () => {
      if (!localStorage.getItem('cookiesAccepted')) {
        cookiePopup.classList.add('visible');
      }

      const token = localStorage.getItem('discord_token');
      if (token) {
        showPopup();
      }
    });
  </script>
  <script>
    const DISCORD_CLIENT_ID = '1227271362264043681';
    const DISCORD_REDIRECT_URI = 'https://saphireshop.xyz';
    const GUILD_ID = '1194870692647293009';
    const MOD_ROLE_ID = '1319962253453430804';

    const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=token&scope=identify%20guilds%20guilds.members.read`;

    const loginBtn = document.getElementById('login-btn');
    const staffr = document.getElementById('staff');
    const profileLink = document.getElementById('profile-link');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const adminLabel = document.getElementById('admin-label');
    const logoutBtn = document.getElementById('logout-btn');
    const wname = document.getElementById('welname');
      

    loginBtn.addEventListener('click', () => {
      window.location.href = DISCORD_AUTH_URL;
    });

    profileLink.addEventListener('click', () => {
      dropdownMenu.classList.toggle('dropdown-visible');
    });

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
        wname.textContent = `welcome back ${user.username} 👋`

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
          staffr.style.display = 'block';
        }
      } catch (err) {
        console.error('Error fetching user guild info:', err);
      }
    }

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('discord_token');
      window.location.reload();
    });

    window.addEventListener('DOMContentLoaded', () => {
      const token = localStorage.getItem('discord_token');
      if (token) {
        fetchUserInfo(token);
        fetchUserGuilds(token);
      } else {
        checkToken();
      }
    });
