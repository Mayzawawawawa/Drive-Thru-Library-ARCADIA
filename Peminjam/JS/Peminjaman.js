import { db } from "./Firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("bookList");
    const bookingBtn = document.getElementById("bookingBtn");
    const searchBar = document.getElementById("searchBar");

    let allBooks = [];
    let selectedBooks = [];

    // Ambil data buku dari Firebase
    const booksRef = ref(db, "Buku/");
    onValue(booksRef, (snapshot) => {
        bookList.innerHTML = "";
        allBooks = [];

        snapshot.forEach((child) => {
            const data = child.val();
            allBooks.push({ id: child.key, ...data });
        });

        renderBooks(allBooks);
    });

    // Render card buku
    function renderBooks(books) {
        bookList.innerHTML = "";

        books.forEach(book => {
            const card = document.createElement("div");
            card.classList.add("book-card");
            card.dataset.id = book.id;

            card.innerHTML = `
                <img src="${book.cover_buku}" alt="${book.judul_buku}" class="cover">
                <h3>${book.judul_buku}</h3>
                <p><b>Pengarang:</b> ${book.nama_pengarang}</p>
                <p><b>Penerbit:</b> ${book.nama_penerbit}</p>
                <p><b>Terbit:</b> ${book.tgl_terbit}</p>
            `;

            card.addEventListener("click", () => toggleSelect(card));
            bookList.appendChild(card);
        });
    }

    // Seleksi buku
    function toggleSelect(card) {
        const id = card.dataset.id;

        if (selectedBooks.includes(id)) {
            selectedBooks = selectedBooks.filter(b => b !== id);
            card.classList.remove("selected");
        } else {
            selectedBooks.push(id);
            card.classList.add("selected");
        }

        updateBookingButton();
    }

    function updateBookingButton() {
        bookingBtn.disabled = selectedBooks.length === 0;
        bookingBtn.classList.toggle("active", selectedBooks.length > 0);
    }

    // Search filter
    searchBar.addEventListener("input", () => {
        const keyword = searchBar.value.toLowerCase();
        const filtered = allBooks.filter(b =>
            b.judul_buku.toLowerCase().includes(keyword) ||
            b.nama_pengarang.toLowerCase().includes(keyword)
        );
        renderBooks(filtered);
    });

    // Simpan buku dan pindah halaman
    bookingBtn.addEventListener("click", () => {
        localStorage.setItem("selectedBooks", JSON.stringify(selectedBooks));
        window.location.href = "../HTML/FormBooking.html";
    });
});
