const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
}

document.addEventListener('DOMContentLoaded', () => {
      fetchReminders();

      document.getElementById('reminderForm').addEventListener('submit', function (e) {
            e.preventDefault();
            submitReminder();
      });

      document.getElementById('reminderDate').addEventListener('input', validateDate);
});

function fetchReminders() {
      document.querySelector('#loading').style.display = 'block';
      fetch('/reminders')
            .then(response => response.json())
            .then(data => {
                  let logDate = new Date(data.logDate).toLocaleString('en-US', options);
                  document.querySelector('#logDate').textContent = logDate;
                  document.querySelector('#logDate').style.display = 'block';

                  const activeReminders = document.getElementById('active-reminders');
                  const completedReminders = document.getElementById('completed-reminders');

                  activeReminders.innerHTML = '';
                  completedReminders.innerHTML = '';

                  const now = new Date();
                  const reminders = data.reminders;
                  reminders.forEach(reminder => {
                        const reminderDate = new Date(reminder.date);
                        const li = document.createElement('li');
                        li.className = 'list-group-item d-flex align-items-center border-0 mb-2 rounded';
                        li.style.backgroundColor = '#f4f6f7';

                        if (reminderDate > now && !reminder.completed) {
                              li.textContent = `${reminder.details} | ${new Date(reminder.date).toLocaleString('en-US', options)}`;
                              const completeButton = document.createElement('button');
                              completeButton.textContent = 'Running...';
                              completeButton.className = 'btn btn-sm ms-2';
                              completeButton.addEventListener('click', () => markAsComplete(reminder.id));
                              li.appendChild(completeButton);
                              activeReminders.appendChild(li);
                        } else {
                              li.innerHTML = `<s>${reminder.details} | ${new Date(reminder.date).toLocaleString('en-US', options)}</s>`;
                              completedReminders.appendChild(li);
                              showNotification(reminder.details, reminder.date);
                        }
                  });
                  document.querySelector('#loading').style.display = 'none';
            })
            .catch(error => {
                  console.error('Error fetching reminders:', error);
                  document.querySelector('#loading').style.display = 'none';
            });
}

function openModal() {
      document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
      document.getElementById('myModal').style.display = 'none';
      document.getElementById('reminderForm').reset();
      document.getElementById('errorMessage').style.display = 'none';
}

function validateDate() {
      const dateInput = document.getElementById('reminderDate');
      const dateValue = new Date(dateInput.value);
      const now = new Date();

      if (dateValue < now) {
            dateInput.setCustomValidity('The reminder date cannot be in the past.');
      } else {
            dateInput.setCustomValidity('');
      }
}

function submitReminder() {
      const dateInput = document.getElementById('reminderDate');
      const detailsInput = document.getElementById('reminderDetails');

      const date = dateInput.value;
      const details = detailsInput.value;

      if (!dateInput.checkValidity()) {
            dateInput.reportValidity();
            return;
      }

      const reminderData = {
            date: date,
            details: details
      };

      fetch('/add-reminders', {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json'
            },
            body: JSON.stringify(reminderData)
      })
            .then(response => {
                  if (response.ok) {
                        closeModal();
                        fetchReminders();
                  } else {
                        throw new Error('Failed to submit reminder');
                  }
            })
            .catch(error => {
                  document.getElementById('errorMessage').style.display = 'block';
                  console.error('Error submitting reminder:', error);
            });
}

function markAsComplete(reminderId) {
      fetch(`/api/reminders/${reminderId}/complete`, {
            method: 'POST'
      })
            .then(response => {
                  if (response.ok) {
                        fetchReminders();
                  } else {
                        throw new Error('Failed to mark reminder as complete');
                  }
            })
            .catch(error => console.error('Error marking reminder as complete:', error));
}

function showNotification(details, date) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.style.position = 'fixed';
      notification.style.bottom = '10px';
      notification.style.right = '10px';
      notification.style.backgroundColor = '#28a745';
      notification.style.color = 'white';
      notification.style.padding = '15px';
      notification.style.borderRadius = '5px';
      notification.textContent = `Reminder: "${details}" scheduled for ${new Date(date).toLocaleString('en-US', options)} is completed.`;

      document.body.appendChild(notification);

      setTimeout(() => {
            document.body.removeChild(notification);
      }, 5000);
}
