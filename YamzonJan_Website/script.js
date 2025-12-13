// --- Global Data Store for Products ---
// This map stores all product data, crucial for compatibility checks and total calculation.
// Key: Item ID (e.g., 'cpu-amd-5600x'), Value: { name, price, type, compatibilityGroup }
const products = {
    // Processors (CPUs)
    'cpu-amd-5600x': { name: 'AMD Ryzen 5 5600X', price: 8500, type: 'CPU', compatibilityGroup: 'AMD' },
    'cpu-intel-13600k': { name: 'Intel Core i5-13600K', price: 9200, type: 'CPU', compatibilityGroup: 'Intel' },
    'cpu-amd-5700x': { name: 'AMD Ryzen 7 5700X', price: 12500, type: 'CPU', compatibilityGroup: 'AMD' },

    // RAM (Memory) - Note: DDR4 and DDR5 are their own groups for compatibility
    'ram-ddr4-16gb': { name: '16GB DDR4 RAM', price: 3500, type: 'RAM', compatibilityGroup: 'DDR4' },
    'ram-ddr4-32gb': { name: '32GB DDR4 RAM', price: 6500, type: 'RAM', compatibilityGroup: 'DDR4' },
    'ram-ddr5-16gb': { name: '16GB DDR5 RAM', price: 5200, type: 'RAM', compatibilityGroup: 'DDR5' },

    // Storage
    'storage-nvme-500gb': { name: '500GB NVMe SSD', price: 2800, type: 'Storage', compatibilityGroup: 'Universal' },
    'storage-sata-1tb': { name: '1TB SATA SSD', price: 4500, type: 'Storage', compatibilityGroup: 'Universal' },
    'storage-hdd-2tb': { name: '2TB HDD', price: 2200, type: 'Storage', compatibilityGroup: 'Universal' },

    // Graphics Cards (GPUs)
    'gpu-rtx-3050': { name: 'NVIDIA RTX 3050', price: 12000, type: 'GPU', compatibilityGroup: 'Universal' },
    'gpu-rx-6600': { name: 'AMD RX 6600', price: 14500, type: 'GPU', compatibilityGroup: 'Universal' },
    'gpu-rtx-3060': { name: 'NVIDIA RTX 3060', price: 18000, type: 'GPU', compatibilityGroup: 'Universal' },

    // Custom Builds (Treated as single items, no compatibility check needed for these)
    'build-entry': { name: 'Entry-Level Gaming Build', price: 25000, type: 'Build', compatibilityGroup: 'Build' },
    'build-high': { name: 'High-Performance Gaming Build', price: 40000, type: 'Build', compatibilityGroup: 'Build' },
    'build-ultimate': { name: 'Ultimate Gaming Build', price: 60000, type: 'Build', compatibilityGroup: 'Build' }
};

// Shopping Cart State
let cart = []; // Array of { id: '...', name: '...', price: number, type: '...' }

// --- Utility Functions ---

/**
 * Checks for basic CPU and RAM compatibility issues.
 * @returns {string|null} An error message if a conflict is found, otherwise null.
 */
function checkCompatibility() {
    const cpuItems = cart.filter(item => item.type === 'CPU');
    const ramItems = cart.filter(item => item.type === 'RAM');

    // Rule 1: Only one CPU allowed
    if (cpuItems.length > 1) {
        return "Error: Only one **CPU** can be in the cart at a time.";
    }

    // Rule 2: Check RAM type against the single CPU (if present)
    if (cpuItems.length === 1) {
        const cpuGroup = cpuItems[0].compatibilityGroup; // 'AMD' or 'Intel'
        const ramGroups = [...new Set(ramItems.map(item => item.compatibilityGroup))]; // 'DDR4' or 'DDR5'

        // Compatibility Logic (Simplified for a basic project):
        // Assumption: AMD (e.g., Ryzen 5000 series) uses DDR4. Intel (e.g., 13th Gen) can use DDR4 or DDR5.
        // The script simplifies this:
        // - If an **AMD** CPU is present, only **DDR4** is allowed.
        // - If an **Intel** CPU is present, both DDR4 and DDR5 are allowed.
        
        if (cpuGroup === 'AMD') {
            if (ramGroups.includes('DDR5')) {
                return "Error: An **AMD Ryzen 5000 Series CPU** is typically compatible only with **DDR4 RAM**. Remove DDR5 RAM.";
            }
        }
        
        // This is a basic check; real compatibility is much more complex (motherboard, socket, chipset).
        // For a school project, this simplified logic shows understanding of *component types*.
    }
    
    // Rule 3: Only one type of RAM generation (DDR4 or DDR5) allowed
    if (ramItems.length > 0) {
        const hasDDR4 = ramItems.some(item => item.compatibilityGroup === 'DDR4');
        const hasDDR5 = ramItems.some(item => item.compatibilityGroup === 'DDR5');

        if (hasDDR4 && hasDDR5) {
            return "Error: You cannot mix **DDR4** and **DDR5** RAM in a single build.";
        }
    }

    return null; // No compatibility conflict
}


/**
 * Renders the current state of the cart and total to the HTML.
 */
function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalP = document.getElementById('cart-total');
    let total = 0;

    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalP.innerHTML = '<strong>Total: ₱0</strong>';
        return;
    }

    const compatibilityError = checkCompatibility();
    
    // Create a list to display items
    const ul = document.createElement('ul');
    ul.className = 'cart-list';

    // Group items by ID to show quantity
    const itemCounts = cart.reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || { count: 0, item: item });
        acc[item.id].count++;
        total += item.price;
        return acc;
    }, {});

    // Render each unique item
    Object.values(itemCounts).forEach(({ count, item }) => {
        const li = document.createElement('li');
        const itemSubtotal = count * item.price;

        li.innerHTML = `
            ${count}x ${item.name} (${item.type}) 
            <span class="price-span">₱${itemSubtotal.toLocaleString()}</span> 
            <button class="remove-btn" data-id="${item.id}">Remove One</button>
        `;
        ul.appendChild(li);
    });

    // Display the list of items
    cartItemsDiv.appendChild(ul);
    
    // Display the total price
    cartTotalP.innerHTML = `<strong>Total: ₱${total.toLocaleString()}</strong>`;
    
    // Display compatibility error if one exists
    if (compatibilityError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'compatibility-error';
        errorDiv.innerHTML = `<p style="color: red; font-weight: bold;">⚠️ Compatibility Warning:</p><p style="color: red; margin-left: 10px;">${compatibilityError}</p>`;
        cartItemsDiv.prepend(errorDiv); // Place error at the top of the cart
    }
    
    // Attach event listeners to the new "Remove One" buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
}

/**
 * Handles adding an item to the cart.
 * @param {string} id - The ID of the product to add (e.g., 'cpu-amd-5600x').
 */
function handleAddItem(id) {
    const product = products[id];
    if (product) {
        // Simple one-item-per-category check for CPUs, GPUs, etc.
        // This is a common feature in PC building sites to force single selection.
        if (product.type !== 'RAM' && product.type !== 'Storage' && cart.some(item => item.type === product.type)) {
             alert(`You can only add one item of type "${product.type}" to the cart. Please remove the existing one first.`);
             return;
        }
        
        // Add the item to the cart
        cart.push({
            id: id,
            name: product.name,
            price: product.price,
            type: product.type,
            compatibilityGroup: product.compatibilityGroup
        });
        
        renderCart();
    }
}

/**
 * Handles removing a single instance of an item from the cart.
 * @param {Event} event - The click event from the "Remove One" button.
 */
function handleRemoveItem(event) {
    const idToRemove = event.target.dataset.id;
    
    // Find the index of the first item with the matching ID
    const index = cart.findIndex(item => item.id === idToRemove);
    
    if (index !== -1) {
        cart.splice(index, 1); // Remove one item
        renderCart();
    }
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Convert all "Buy Now" buttons into "Add to Cart" functionality
    document.querySelectorAll('.buy-btn').forEach(button => {
        // Extract the product name from the title attribute of the anchor tag
        // e.g., 'Buy AMD Ryzen 5 5600X' -> 'AMD Ryzen 5 5600X'
        const rawName = button.title.replace('Buy ', '');
        
        // Find the product ID by looking up the name in the products map
        // This is a reverse lookup, more complex but necessary since the HTML is static
        const itemId = Object.keys(products).find(key => products[key].name === rawName);

        if (itemId) {
            button.textContent = 'Add to Cart';
            // Set the ID as a data attribute for easy access in the handler
            button.dataset.id = itemId;
            
            // Add the click listener
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link action (e.g., scrolling to top)
                handleAddItem(event.target.dataset.id);
            });
        }
    });

    // 2. Initial cart render
    renderCart();
});