const form = document.getElementById('registerForm');
const message = document.getElementById('message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nom = document.getElementById('lastname').value.trim();
  const prenom = document.getElementById('firstname').value.trim();
  const email = document.getElementById('email').value.trim();
  const dob = document.getElementById('dob').value;
  const password = document.getElementById('password').value;

  // if (!nom || !prenom || !email || !dob || !password) {
  //   message.textContent = "Veuillez remplir tous les champs.";
  //   message.style.color = "red";
  //   return;
  // }

  message.style.color = "lightgreen";
  message.textContent = "Inscription réussie ! Redirection...";
  
  setTimeout(() => {
    window.location.href = "test.html";
  }, 1000);
});