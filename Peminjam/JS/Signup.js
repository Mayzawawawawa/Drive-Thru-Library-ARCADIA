import { auth, db } from "./Firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    const emailInput = document.getElementById("email_peminjam");
    const usernameInput = document.getElementById("user_peminjam");
    const namaInput = document.getElementById("nama_peminjam");
    const passwordInput = document.getElementById("password_peminjam");
    const successNotification = document.getElementById("successNotification");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const nama = namaInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !username || !nama || !password) {
            alert("Please fill in all fields!");
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;

            await set(ref(db, "peminjam/" + user.uid), {
                nama_peminjam: nama,
                email_peminjam: email,
                user_peminjam: username,
                pass_peminjam: password,
                tgl_daftar: new Date().toISOString().slice(0, 10),
                status_peminjam: true
            });

            successNotification.classList.add("show");

            setTimeout(() => {
                window.location.href = "../HTML/Login.html";
            }, 2000);

        } catch (error) {
            console.error("Signup Error:", error);

            const messages = {
                "auth/email-already-in-use": "Email sudah terdaftar!",
                "auth/weak-password": "Password harus minimal 6 karakter!",
                "auth/invalid-email": "Email tidak valid!"
            };

            alert(messages[error.code] || error.message);
        }
    });
});
