const warnings = JSON.parse(localStorage.getItem('warnings')) || {};
    const webhookURL = 'https://discord.com/api/webhooks/1221053194826944674/SDJbKS0l5JAONMwlf5KWAVjn_DLbsu82ADlV3WpCpCWhUBIW3b5Zn3hCDkskUCgCfaXC';

    const userIdInput = document.getElementById('user-id');
    const reasonInput = document.getElementById('reason');
    const addWarningButton = document.getElementById('add-warning');
    const warningsTable = document.getElementById('warnings-table');

    const updateWarningsTable = () => {
      warningsTable.innerHTML = '';
      for (const userId in warnings) {
        const warningCount = warnings[userId].length;
        const isThirdWarning = warningCount % 3 === 0 && warningCount !== 0;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${userId}</td>
          <td>
            ${warnings[userId]
              .map((w, index) => `${index + 1}: ${w.reason}`)
              .join('<br>')}
            ${isThirdWarning ? '<p class="third-warning">This is their third warning!</p>' : ''}
          </td>
        `;
        warningsTable.appendChild(row);
      }
    };

    const sendToWebhook = (data) => {
      fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).catch((err) => console.error('Webhook error:', err));
    };

    addWarningButton.addEventListener('click', () => {
      const userId = userIdInput.value.trim();
      const reason = reasonInput.value.trim();

      if (!userId || !reason) {
        alert('Please fill out both fields.');
        return;
      }

      if (!warnings[userId]) {
        warnings[userId] = [];
      }

      warnings[userId].push({ reason, timestamp: new Date().toISOString() });
      localStorage.setItem('warnings', JSON.stringify(warnings));

      sendToWebhook({ userId, reason, warningsCount: warnings[userId].length });

      userIdInput.value = '';
      reasonInput.value = '';

      updateWarningsTable();
    });

    // Initialize the warnings table on page load
    updateWarningsTable();
