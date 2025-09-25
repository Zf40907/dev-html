document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const notification = document.getElementById('notification');
    
    const API_URL = 'http://localhost:8000/api/products.php';
    
    // Render products
    async function renderProducts() {
        try {
            const response = await fetch(API_URL);
            const products = await response.json();
            
            productList.innerHTML = '';
            
            if (products.length === 0) {
                productList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <h3>No Products Found</h3>
                        <p>Add your first product using the form on the left to get started.</p>
                    </div>
                `;
                return;
            }
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image || 'https://via.placeholder.com/300x200?text=Product+Image'}" alt="${product.name}">
                        <button class="delete-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="product-details">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
            
            // Add delete event listeners
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    deleteProduct(id);
                });
            });
        } catch (error) {
            console.error('Error loading products:', error);
            showNotification('Failed to load products', true);
        }
    }
    
    // Add new product
    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const category = document.getElementById('productCategory').value;
        const description = document.getElementById('productDescription').value;
        const image = document.getElementById('productImage').value;
        
        if (!name || !price || !category) {
            showNotification('Please fill in all required fields', true);
            return;
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    price,
                    category,
                    description,
                    image
                })
            });
            
            const result = await response.json();
            
            if (result.id) {
                showNotification('Product added successfully!');
                renderProducts();
                productForm.reset();
            } else {
                showNotification('Failed to add product', true);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showNotification('Failed to add product', true);
        }
    });
    
    // Delete product
    async function deleteProduct(id) {
        try {
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Product deleted successfully!');
                renderProducts();
            } else {
                showNotification('Failed to delete product', true);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Failed to delete product', true);
        }
    }
    
    // Show notification
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.className = 'notification';
        
        if (isError) {
            notification.classList.add('error');
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Initialize the page
    renderProducts();
});