const menuBtn = document.getElementById("menu-btn");
const navbar = document.querySelector(".navbar");

const newArrivalbtn = document.getElementById("newarrivals");
const bestSellerbtn = document.getElementById("bestsellers");

const newbooks = document.querySelector(".books-new");
const bestbooks = document.querySelector(".books-best");

const books = document.querySelectorAll(".book");
const totalamt = document.querySelector(".total");

if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => {
        navbar.classList.toggle("active");

        // Icon toggle
        menuBtn.innerHTML = navbar.classList.contains("active")
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });
};

document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

window.addEventListener("load", () => {
    const content = document.querySelector(".content");

    if (content) {
        content.classList.add("load");
    }
});

if (newArrivalbtn && bestSellerbtn && newbooks && bestbooks) {
    newArrivalbtn.addEventListener("click", () => {
        newArrivalbtn.classList.add("active");
        bestSellerbtn.classList.remove("active");

        newbooks.classList.add("show");
        newbooks.classList.remove("hidden");

        bestbooks.classList.add("hidden");
        bestbooks.classList.remove("show");
    });

    bestSellerbtn.addEventListener("click", () => {
        bestSellerbtn.classList.add("active");
        newArrivalbtn.classList.remove("active");

        bestbooks.classList.add("show");
        bestbooks.classList.remove("hidden");

        newbooks.classList.add("hidden");
        newbooks.classList.remove("show");
    });
};

const endDate = new Date("Feb 10, 2026 23:59:59").getTime();

const timer = setInterval(() => {
    const now = new Date().getTime();
    const distance = endDate - now;
    if(distance < 0) {
        clearInterval(timer);

        const countdownEl = document.querySelector(".countdown");

        if (countdownEl) {
            countdownEl.innerHTML = "Offer Ended!";
        }
        // document.querySelector(".countdown").innerHTML = "Offer Ended!";
        return;
    };

    const days =  Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mint = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const sec = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minEl = document.getElementById("min");
    const secEl = document.getElementById("sec");

    if (daysEl && hoursEl && minEl && secEl) {
        daysEl.innerText = days;
        hoursEl.innerText = hours;
        minEl.innerText = mint;
        secEl.innerText = sec;
    };
    
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updatetotal();
    loadBookDetails();

    const addBtn = document.querySelector("#bookdetails button");

    if (addBtn) {
        addBtn.addEventListener("click", () => {
            const params = new URLSearchParams(window.location.search);
            const bookId = params.get("id");

            fetch("books.json")
                .then(res => res.json())
                .then(data => {
                    const book = data.find(b => b.id == bookId);
                    if (book) addtoCart(book);
                });
        });
    };
});

let bookList = [];

const updatetotal = () => {
   const tbody = document.querySelector("tbody");
    const totalEl = document.querySelector(".total");

    if (!tbody || !totalEl) return;

    let totalPrice = 0;

    tbody.querySelectorAll("tr").forEach(tr => {
        const subTotalEl = tr.querySelector(".sub-total");
        const subTotal = parseFloat(subTotalEl.textContent.replace(/[^0-9.]/g, '')) || 0;
        totalPrice += subTotal;
    });

    totalEl.textContent = `$${totalPrice.toFixed(2)}`;
    document.querySelector(".final").textContent = `$${totalPrice.toFixed(2)}`
};

// Remove item function
const removeCartItem = (bookToRemove) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(book => book.name !== bookToRemove.name); // remove by name
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart(); // reload cart
};

const displayBooks = (books, container) => {
    if (!container) return;

    container.innerHTML = "";
    books.forEach(book => {
        const bookcard = document.createElement("div");
        bookcard.classList.add("book");

        bookcard.innerHTML = `
        <img src="${book.image}" alt="" srcset="">
                <h4>${book.name}</h4>
                <h5>${book.author}</h5>
                <div class="book-footer">
                    <div class="star">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <div class="footer-row">
                        <span>Rs: ${book.price}</span>
                        <button class="cart-btn">
                            <i class="fa-solid fa-cart-arrow-down"></i>
                        </button>
                    </div>
                </div>
        `;

        container.appendChild(bookcard);

        bookcard.addEventListener("click", () => {
            window.location.href = `sbook.html?id=${book.id}`;
        });

        const cartbtn = bookcard.querySelector(".cart-btn");
        cartbtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addtoCart(book);
        });
    });
};

const addtoCart = (book, qty = 1) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    book.price = parseFloat(book.price.toString().replace(/[^0-9.]/g, '')) || 0;

    // Check if book is already in cart
    const existingBook = cart.find(b => b.id === book.id);

    if (existingBook) {
        // Increase quantity
        existingBook.quantity = (existingBook.quantity || 1) + qty;
    } else {
        // Add new book with quantity
        cart.push({ ...book, quantity: qty });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
    alert("Item added to cart!");
}

const loadCart = () => {
    const tbody = document.querySelector("tbody");
    const totalEl = document.querySelector(".total");

    if (!tbody || !totalEl) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Clear tbody first
    tbody.innerHTML = "";

    cart.forEach(book => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><a href="#" class="remove-item"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${book.image}" alt=""></td>
            <td>${book.name}</td>
            <td>${book.price}</td>
            <td><input type="number" value="1" min="1"></td>
            <td class="sub-total">${book.price}</td>
        `;

        tbody.appendChild(tr);

        // Quantity change listener
        const qtyInput = tr.querySelector("input");
        const subTotalEl = tr.querySelector(".sub-total");
        const price = parseFloat(book.price);

        qtyInput.value = book.quantity || 1; // set current quantity
        subTotalEl.textContent = ((book.quantity || 1) * price).toFixed(2);

        qtyInput.addEventListener("change", () => {
            const qty = parseInt(qtyInput.value) || 1;
            subTotalEl.textContent = (price * qty).toFixed(2);

            book.quantity = qty;
            localStorage.setItem("cart", JSON.stringify(cart));

            updatetotal(); // recalc total whenever quantity changes
        });

        // Remove item listener
        const removeBtn = tr.querySelector(".remove-item");
        removeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            removeCartItem(book);
        });
    });

    // Initial total calculation
    updatetotal();
};

const loadBookDetails = () => {
    // 1. Get book id from URL
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");
    if (!bookId) return;

    // 2. Fetch all books (you can combine new arrivals + best sellers + others)
    fetch("books.json")
        .then(res => res.json())
        .then(data => {
            const book = data.find(b => b.id == bookId);
            if (!book) return;

            // 3. Build image container
            const imgContainer = document.getElementById("detail-img-container");
            imgContainer.innerHTML = `<img src="${book.image}" alt="${book.name}" width="100%">`;

            // 4. Build details container
            const detailsContainer = document.getElementById("detail-info");
            detailsContainer.innerHTML = `
                <h4>${book.name}</h4>
                <h5>${book.author}</h5>
                <h3>Rs: ${book.price}</h3>
                <input type="number" value="1" min="1" id="book-qty">
                <button id="add-cart-btn">Add To Cart</button>
                <h4>Description</h4>
                <span>${book.Description}</span>
            `;

            // 5. Add to cart logic
            document.getElementById("add-cart-btn").addEventListener("click", () => {
                const qty = parseInt(document.getElementById("book-qty").value) || 1;
                addtoCart(book, qty);
                alert("Item added to cart!");
            });
        });
};

const init = () => {
    fetch("books.json").then
    (response => response.json()).then
    (data => {
        bookList = data;

        // Homepage
        if (newbooks && bestbooks) {
            const newBooks = bookList.filter(book => book.category === "new");
            const bestBooks = bookList.filter(book => book.bestseller === true);

            displayBooks(newBooks, newbooks);
            displayBooks(bestBooks, bestbooks);
        }
        
        
        // Shop page
        const shopContainer = document.querySelector(".books-container");
        if (shopContainer) {
            displayBooks(bookList, shopContainer);
        }
    });
}

init();

