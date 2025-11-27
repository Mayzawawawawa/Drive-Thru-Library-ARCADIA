import { auth, db } from "./Firebase.js";
import { ref, get, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
// Selected Books
    const selectedBooks = JSON.parse(localStorage.getItem("selectedBooks")) || [];
    const container = document.getElementById("selectedBooksContainer");

    if (selectedBooks.length === 0) {
        container.innerHTML = "<p>Tidak ada buku yang dipilih.</p>";
        return;
    }

// Form fields
    const namaInput = document.getElementById("nama_peminjam");
    const emailInput = document.getElementById("email_peminjam");
    const tglPinjam = document.getElementById("tgl_pinjam");
    const tglAmbil = document.getElementById("tgl_ambil");
    const tglKembali = document.getElementById("tgl_kembali");
    const bookingForm = document.getElementById("bookingForm");

// Load User Data
    auth.onAuthStateChanged(async (user) => {
        if (!user) return;

        emailInput.value = user.email;

        // Ambil nama lengkap dari database
        const userRef = ref(db, `peminjam/${user.uid}`);
        const userSnap = await get(userRef);

        if (userSnap.exists() && userSnap.val().nama_peminjam) {
            namaInput.value = userSnap.val().nama_peminjam;
        } else {
            namaInput.value = user.displayName || "Peminjam Arcadia";
        }
    });

// Load Selected Books Details
    const bookRef = ref(db, "Buku/");
    const snapshot = await get(bookRef);
    const allBooks = snapshot.val() || {};

    container.innerHTML = "";

    selectedBooks.forEach(id => {
        const b = allBooks[id];
        if (!b) return;

        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <img src="${b.cover_buku || ''}" alt="${b.judul_buku || ''}" class="cover">
            <h3>${b.judul_buku}</h3>
            <p><b>Pengarang:</b> ${b.nama_pengarang}</p>
            <p><b>Penerbit:</b> ${b.nama_penerbit}</p>
        `;

        container.appendChild(card);
    });

// Set Max Return Date
    const today = new Date();
    tglPinjam.value = today.toISOString().slice(0, 10); // YYYY-MM-DD

    tglAmbil.addEventListener("change", () => {
        const ambil = new Date(tglAmbil.value);
        if (isNaN(ambil)) return;

        const kembali = new Date(ambil);
        kembali.setDate(kembali.getDate() + 30);

        tglKembali.value = kembali.toISOString().slice(0, 16); // datetime-local format
    });

// Handling Form Submission
    bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!tglAmbil.value || !tglKembali.value) {
        alert("Tanggal ambil & kembali harus diisi!");
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const peminjamanRef = ref(db, "peminjaman/");
    const newPinjamRef = push(peminjamanRef);
    const kodePeminjaman = newPinjamRef.key;

    // Simpan ke db/peminjaman/
    await set(newPinjamRef, {
        tanggal_pesan: tglPinjam.value,
        tanggal_ambil: tglAmbil.value,
        tanggal_wajibkembali: tglKembali.value,
        tanggal_kembali: "",
        status_pinjam: 1,
        id_peminjam: user.uid
    });

    // Simpan ke detil_peminjaman untuk setiap buku
    for (const id_buku of selectedBooks) {
        const detilRef = ref(db, "detil_peminjaman/");
        const newDetail = push(detilRef);

        await set(newDetail, {
            kode_peminjaman: kodePeminjaman,
            id_buku: id_buku
        });
    }

    // SHOW POPUP
    const popup = document.getElementById("popupSuccess");
    const close = document.getElementById("closePopup");

    console.log("Popup found?", popup); // Debug check

    popup.classList.remove("hide");

    close.addEventListener("click", () => {
        popup.classList.add("hide");
        localStorage.removeItem("selectedBooks");
        window.location.href = "../HTML/Peminjaman.html";
    });
});

});
