document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("sort");
    const productsContainer = document.querySelector(".products");

    const sortProducts = () => {
        const products = Array.from(productsContainer.children);

        products.sort((a, b) => {
            const priceA = parseInt(a.querySelector("p").textContent.replace(/\D/g, ""), 10);
            const priceB = parseInt(b.querySelector("p").textContent.replace(/\D/g, ""), 10);

            if (sortSelect.value === "new") {
                return priceB - priceA;
            } else if (sortSelect.value === "priceLow") {
                return priceA - priceB;
            } else if (sortSelect.value === "priceHigh") {
                return priceB - priceA;
            }
        });

        productsContainer.innerHTML = "";
        products.forEach(product => productsContainer.appendChild(product));
    };

    sortSelect.addEventListener("change", sortProducts);

    sortProducts();
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:5000/goods")
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.querySelector(".products");

            productsContainer.innerHTML = "";

            data.forEach(product => {
                const productHTML = `
                    <div class="product">
                        <img src="${product.url}" alt="${product.product_name}">
                        <h2>${product.product_name}</h2>
                        <p>${product.product_price} руб.</p>
                        <p>${product.product_description}</p>
                        <button class="add-to-cart" data-id="${product.id}">Добавить</button>
                    </div>
                `;
                productsContainer.insertAdjacentHTML("beforeend", productHTML);
            });

            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", (event) => {
                    const productId = event.target.dataset.id;
                    const product = data.find(item => item.id === productId);

                    addToCart(product);
                });
            });
        })
        .catch(error => console.error("Ошибка загрузки товаров:", error));

    function addToCart(product) {
        const order = {
            product_name: product.product_name,
            product_price: product.product_price,
            id: product.id,
            customerName: "Клиент"
        };

        fetch("http://localhost:5000/add-orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => alert(data.text))
        .catch(error => console.error("Ошибка добавления в корзину:", error));
    }
});


