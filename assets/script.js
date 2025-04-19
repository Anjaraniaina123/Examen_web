document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  const message = document.getElementById('message');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.querySelector('.password-toggle i');

  passwordToggle.addEventListener('click', function() {
    if (passwordInput.type == 'password') {
        passwordInput.type = 'text';
        passwordToggle.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordToggle.classList.replace('fa-eye-slash', 'fa-eye')
    }
  });


  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
      lastName: document.getElementById('lastname').value.trim(),
      firstName: document.getElementById('firstname').value.trim(),
      email: document.getElementById('email').value.trim(),
      dob: document.getElementById('dob').value,
      password: document.getElementById('password').value
  };

  if (!Object.values(formData).every(Boolean)) {
      showMessage('Please fill in all fields', 'error');
      return;
  }

  if (formData.password.length < 8) {
      showMessage('Password must be at least 8 characters', 'error');
      return;
  }

  localStorage.setItem('typingTestUser', JSON.stringify(formData));
  
  showMessage('Registration successful! Redirecting...', 'success');
  setTimeout(() => window.location.href = "test.html", 1500);
  });
  function showMessage(msg, type) {
    const message = document.getElementById('message');
    message.textContent = msg;
    message.style.color = type === 'success' ? '#27ae60' : '#f44336';
    message.style.display = 'block';
    
    if (type === 'success') {
      setTimeout (() => {
        window.location.href = "test.html";
      }, 1500);
    } else {
      setTimeout(() => {
        message.style.display = 'none';
      }, 3000);
    }
  }
});