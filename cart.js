document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector(".cart");
    const totalElement = document.querySelector(".total strong");
    const checkoutButton = document.querySelector(".checkout-button");
    const clearCartButton = document.querySelector(".clear-cart");

    const loadCartItems = () => {
        fetch("http://localhost:5000/orders")
            .then(response => response.json())
            .then(orders => {
                if (orders.length === 0) {
                    cartContainer.innerHTML = "<p>Ваша корзина пуста</p>";
                    totalElement.textContent = "0 руб.";
                } else {
                    let total = 0;
                    cartContainer.innerHTML = "";
                    orders.forEach(order => {
                        const productHTML = `
                            <div class="cart-item">
                                <span>${order.product_name}</span>
                                <span>1</span> <!-- Здесь можно добавить логику для отображения количества -->
                            </div>
                        `;
                        cartContainer.insertAdjacentHTML("beforeend", productHTML);
                        total += order.product_price;
                    });
                    totalElement.textContent = `${total} руб.`;
                }
            })
            .catch(error => console.error("Ошибка загрузки товаров в корзине:", error));
    };

    loadCartItems();

    checkoutButton.addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;

        if (!name || !phone || !address) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const orderData = {
            customerName: name,
            customerPhone: phone,
            customerAddress: address,
            products: JSON.parse(localStorage.getItem("cartItems")) || []
        };

        fetch("http://localhost:5000/add-orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.text);
            loadCartItems();
            window.location.reload();
        })
        .catch(error => console.error("Ошибка при оформлении заказа:", error));
    });

    clearCartButton.addEventListener("click", () => {
        fetch("http://localhost:5000/clear-cart", {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            alert(data.text);
            cartContainer.innerHTML = "";
            totalElement.textContent = "0 руб.";
        })
        .catch(error => console.error("Ошибка при очистке корзины:", error));
    });
});
