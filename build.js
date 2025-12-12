document.addEventListener('DOMContentLoaded', () => {
    // --- Build PC Data ---
    const partsData = {
        cpu: [
            { name: "Intel i5", price: 200, socket: "LGA1200" },
            { name: "Intel i7", price: 350, socket: "LGA1200" },
            { name: "AMD Ryzen 5", price: 220, socket: "AM4" },
            { name: "AMD Ryzen 7", price: 400, socket: "AM4" }
        ],
        motherboard: [
            { name: "ASUS LGA1200 Board", price: 150, socket: "LGA1200" },
            { name: "Gigabyte AM4 Board", price: 130, socket: "AM4" }
        ],
        ram: [
            { name: "16GB DDR4", price: 80 },
            { name: "32GB DDR4", price: 150 }
        ],
        gpu: [
            { name: "NVIDIA RTX 3060", price: 400 },
            { name: "NVIDIA RTX 4070", price: 600 }
        ],
        storage: [
            { name: "1TB SSD", price: 70 },
            { name: "2TB HDD", price: 50 }
        ],
        psu: [
            { name: "650W PSU", price: 80 },
            { name: "750W PSU", price: 100 }
        ],
        case: [
            { name: "Mid Tower", price: 70 },
            { name: "Full Tower", price: 120 }
        ],
        cooling: [
            { name: "Air Cooler", price: 50 },
            { name: "Liquid Cooler", price: 120 }
        ]
    };

    const selectedParts = {
        cpu: null,
        motherboard: null,
        ram: null,
        gpu: null,
        storage: null,
        psu: null,
        case: null,
        cooling: null
    };

    const totalPriceElem = document.querySelector('.total-value');
    const warningElem = document.querySelector('.compatibility-check');
    const buildItemsContainer = document.querySelector('.build-items');

    // --- Render selected build items ---
    function renderBuildItems() {
        buildItemsContainer.innerHTML = '';
        Object.keys(selectedParts).forEach(part => {
            const item = selectedParts[part];
            if (item) {
                const div = document.createElement('div');
                div.classList.add('build-item');
                div.textContent = `${part.toUpperCase()}: ${item.name} - $${item.price}`;
                buildItemsContainer.appendChild(div);
            }
        });
    }

    // --- Populate dropdowns ---
    Object.keys(partsData).forEach(part => {
        const selectElem = document.querySelector(`select[data-part="${part}"]`);
        if (selectElem) {
            selectElem.innerHTML = `<option value="">Select ${part.toUpperCase()}</option>`;
            partsData[part].forEach(item => {
                selectElem.innerHTML += `<option value="${item.name}">${item.name} - $${item.price}</option>`;
            });

            selectElem.addEventListener('change', () => {
                const selectedName = selectElem.value;
                selectedParts[part] = partsData[part].find(p => p.name === selectedName) || null;
                checkCompatibility();
                updateTotalPrice();
                renderBuildItems();
            });
        }
    });

    // --- Check CPU & Motherboard compatibility ---
    function checkCompatibility() {
        const cpu = selectedParts.cpu;
        const motherboard = selectedParts.motherboard;

        if (cpu && motherboard && cpu.socket !== motherboard.socket) {
            warningElem.style.background = '#ffcccc';
            warningElem.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Incompatible CPU and Motherboard!`;
        } else if (cpu && motherboard) {
            warningElem.style.background = '#d4edda';
            warningElem.innerHTML = `<i class="fa-solid fa-check"></i> CPU and Motherboard compatible`;
        } else {
            warningElem.style.background = '#f8f9fa';
            warningElem.innerHTML = 'Add components to check compatibility';
        }
    }

    // --- Update total price of build ---
    function updateTotalPrice() {
        let total = 0;
        Object.values(selectedParts).forEach(p => {
            if (p) total += p.price;
        });
        totalPriceElem.textContent = `$${total.toFixed(2)}`;
    }

    // --- CART FUNCTIONALITY ---
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElem = document.querySelector('.cart-total');
    let cart = [];
    let cartTotal = 0;

    // Add event listener to Buy Now buttons
    const buyButtons = document.querySelectorAll('.buy-btn:not(.disabled)');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.getAttribute('data-name');
            const price = parseInt(btn.getAttribute('data-price'));

            if (!name || isNaN(price)) return;

            cart.push({ name, price });
            renderCart();
        });
    });

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        cartTotal = 0;

        if(cart.length === 0){
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach((item, index) => {
                const div = document.createElement('div');
                div.classList.add('cart-item');
                div.innerHTML = `
                    <p>${item.name} - $${item.price}</p>
                    <button class="remove-btn" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(div);
                cartTotal += item.price;
            });
        }

        cartTotal = car.reduce((sum, item) => sum + item.price, 0);
        cartTotalElem.textContent = cartTotal;
    }

    // Remove items from cart
    cartItemsContainer.addEventListener('click', e => {
        if(e.target.classList.contains('remove-btn')){
            const index = parseInt(e.target.getAttribute('data-index'));
            if(!isNaN(index)){
                cartTotal -= cart[index].price;
                cart.splice(index,1);
                renderCart();
            }
        }
    });

    // Initial render
    renderBuildItems();
    renderCart();
});
