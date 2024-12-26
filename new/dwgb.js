    const form = document.getElementById('registration-form');
    const popup = document.getElementById('confirmation-popup');
    const emailField = document.getElementById('email');
    const userEmail = document.getElementById('user-email');
    const teamFieldsContainer = document.getElementById('team-fields');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      userEmail.textContent = emailField.value;
      popup.classList.add('visible');

      const teamFields = Array.from(teamFieldsContainer.children).map((field) => {
        return {
          title: field.querySelector('.team-title')?.value,
          name: field.querySelector('.team-name')?.value,
        };
      });

      const formData = {
        serverInvite: document.getElementById('server-invite').value,
        team: teamFields,
        email: emailField.value,
        gameLink: document.getElementById('game-link').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
      };

      const webhookUrl = 'https://discord.com/api/webhooks/1221053194826944674/SDJbKS0l5JAONMwlf5KWAVjn_DLbsu82ADlV3WpCpCWhUBIW3b5Zn3hCDkskUCgCfaXC';
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [{ description: JSON.stringify(formData, null, 2) }] }),
      });
    });

    function closePopup() {
      popup.classList.remove('visible');
      form.reset();
    }

    function addTeamField() {
      const newField = document.createElement('div');
      newField.className = 'form-group';
      newField.innerHTML = `
        <label for="team-title">Team Member Title</label>
        <input type="text" class="team-title" placeholder="e.g., Lead Developer">
        <label for="team-name">Team Member Name</label>
        <input type="text" class="team-name" placeholder="e.g., John Doe">
      `;
      teamFieldsContainer.appendChild(newField);
    }
