import { auth } from './Firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email_admin');
  const passwordInput = document.getElementById('password_admin');
  const successNotification = document.getElementById('successNotification');

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid email format!");
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login Success:", user);

      successNotification.classList.add('show');

      setTimeout(() => {
        window.location.href = "../HTML/Pemesanan.html";
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);

      const messages = {
        "auth/user-not-found": "Account not registered yet.",
        "auth/wrong-password": "Wrong password.",
      };

      alert(messages[error.code] || error.message);
    }
  });

  // Social login placeholder
  const handleSocialClick = (platform) =>
    alert(`${platform} login not implemented.`);

  document.querySelector('.google')?.addEventListener('click', () => handleSocialClick('Google'));
  document.querySelector('.facebook')?.addEventListener('click', () => handleSocialClick('Facebook'));
  document.querySelector('.apple')?.addEventListener('click', () => handleSocialClick('Apple'));
});
