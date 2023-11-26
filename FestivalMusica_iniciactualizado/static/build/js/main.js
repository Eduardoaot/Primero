const cart = {
    items: {},
    totalProducts: 0,
    totalAmount: 0,
};

function addToCart(item, price) {
    if (cart.items[item]) {
        cart.items[item].quantity++;
    } else {
        cart.items[item] = {
            price: price,
            quantity: 1
        };
    }

    cart.totalProducts++;
    cart.totalAmount += price;

    updateCart();
}

function removeFromCart(item) {
    if (cart.items[item]) {
        const price = cart.items[item].price;
        const quantity = cart.items[item].quantity;

        if (quantity > 1) {
            cart.items[item].quantity--;
        } else {
            delete cart.items[item];
        }

        cart.totalProducts--;
        cart.totalAmount -= price;

        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const totalProducts = document.getElementById("total-products");
    const totalAmount = document.getElementById("total-amount");

    cartItems.innerHTML = '';
    totalProducts.textContent = cart.totalProducts;
    totalAmount.textContent = cart.totalAmount.toFixed(2);

    for (const item in cart.items) {
        const cartItem = document.createElement("li");
        cartItem.innerHTML = `${item} x${cart.items[item].quantity} - $${(cart.items[item].price * cart.items[item].quantity).toFixed(2)} 
        <span class="remove-item" onclick="removeFromCart('${item}')">(ELIMINAR)</span>`;
        cartItems.appendChild(cartItem);
    }
}
function purchaseAndGeneratePDF() {
    const cartItems = document.getElementById('cart-items').getElementsByTagName('li');
    const items = [];

    for (let i = 0; i < cartItems.length; i++) {
        const productName = cartItems[i].innerText.split(' x')[0].trim();
        const quantity = parseInt(cartItems[i].innerText.split(' x')[1]); // Obtener la cantidad seleccionada
        items.push(`${productName} X${quantity}`);
    }

    const totalProducts = document.getElementById('total-products').innerText;
    const totalAmount = document.getElementById('total-amount').innerText;
    const nombreUsuario = document.getElementById('username').value;

    document.getElementById('ticket-username').innerText = nombreUsuario;
    document.getElementById('nombre-comprador').value = nombreUsuario;
    document.getElementById('ticket-items').innerHTML = items.join('<br>');
    document.getElementById('ticket-total-products').innerText = totalProducts;
    document.getElementById('ticket-total-amount').innerText = totalAmount;

    document.getElementById('productos').value = items.join(', ');
    document.getElementById('total-productos').value = totalProducts;
    document.getElementById('total-pagar').value = totalAmount;

    generateAndDownloadPDF(nombreUsuario, items, totalProducts, totalAmount, () => {
        document.getElementById('compra-form').submit();
    });
}
function generateAndDownloadPDF(username, items, totalProducts, totalAmount, callback) {
    // Crear el contenido del ticket en HTML
    const ticketContent = `
        <h2>¡Gracias por su compra!</h2>
        <p>Nombre: ${username}</p>
        <p>Compra: <br>${generateTicketContent()}</p>
        <p>Total de productos: ${totalProducts}</p>
        <p>Total a pagar: $${totalAmount}</p>
        <div>
            <p>${new Date().toLocaleDateString()}</p>
            <p>MOSTRAR ESTE RECIBO IMPRESO PARA PODER ENTRAR AL FESTIVAL</p>
        </div>
    `;

    // Generar el PDF a partir del contenido del ticket
    const element = document.createElement("div");
    element.innerHTML = ticketContent;

    html2pdf(element, {
        margin: 10,
        filename: 'ticket.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).then(() => {
        // Llamar al callback después de completar la descarga del PDF
        if (callback && typeof callback === 'function') {
            callback();
        }
    });
}

function generateTicketContent() {
    let content = '';

    if (cart && cart.items) {
        for (const item in cart.items) {
            content += `${item} X${cart.items[item].quantity} - $${(cart.items[item].price * cart.items[item].quantity).toFixed(2)}<br>`;
        }
    } else {
        console.error('El objeto "cart" o sus propiedades no están definidos.');
    }

    return content;
}