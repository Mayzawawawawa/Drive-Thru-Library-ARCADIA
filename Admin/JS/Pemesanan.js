import { db } from "../firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const tableBody = document.getElementById("bookingBody");

// Referensi ke database
const bookingRef = ref(db, "peminjaman/");

// Listen data realtime
onValue(bookingRef, (snapshot) => {
    tableBody.innerHTML = ""; // reset tabel

    if (!snapshot.exists()) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center">Belum ada peminjaman</td></tr>`;
        return;
    }

    snapshot.forEach((child) => {
        const data = child.val();

        const row = `
            <tr>
                <td>${data.id_peminjam || "-"}</td>
                <td>${data.user_email || "-"}</td>
                <td>${Array.isArray(data.selectedBooks) ? data.selectedBooks.join(", ") : data.selectedBooks}</td>
                <td>${data.status_pinjam || "-"}</td>
                <td>${data.tanggal_ambil || "-"}</td>
                <td>${data.tanggal_wajibkembali || "-"}</td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });
});
