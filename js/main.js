document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.product-row');
    const cartCountElem = document.getElementById('cart-count');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    updateCartCount();

    // Отримуємо category із URL (для сторінки категорії)
    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get('category'); // наприклад: ?category=jeans

    fetch('data/products.json')
        .then(res => res.json())
        .then(products => {
            // Якщо ми на сторінці категорії, фільтруємо товари
            let displayProducts = products;
            if (currentCategory) {
                displayProducts = products.filter(p => p.category === currentCategory);
            }

            displayProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'card reveal';

                // images
                let imagesHTML = '';
                product.images.forEach((img, i) => {
                    imagesHTML += `<img src="${img}" class="${i === 0 ? 'visible' : 'hidden'}">`;
                });
                if (product.images.length > 1) {
                    imagesHTML += `
                        <div class="arrow left">&#10094;</div>
                        <div class="arrow right">&#10095;</div>
                    `;
                }

                // card html
                card.innerHTML = `
                    <div class="badge">NEW</div>
                    <div class="sale">-20%</div>
                    <div class="wishlist">♡</div>

                    <a href="product.html?id=${product.id}" class="product-images">
                        ${imagesHTML}
                    </a>

                    <h3>${product.name}</h3>
                    <p class="price">${product.price} грн</p>

                    <div class="quick-add" data-id="${product.id}">Quick add</div>
                `;

                productContainer.appendChild(card);

                // click на всю картку
                card.addEventListener('click', () => {
                    window.location.href = `product.html?id=${product.id}`;
                });

                // quick-add не відкриває сторінку
                card.querySelector('.quick-add').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = e.target.dataset.id;
                    const productData = products.find(p => p.id == id);
                    cart.push(productData);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    showToast("Товар доданий у корзину!");
                });

                // slider
                if (product.images.length > 1) {
                    const images = card.querySelectorAll('img');
                    let current = 0;

                    const showImage = (index) => {
                        images.forEach((img, i) => {
                            img.classList.toggle('visible', i === index);
                            img.classList.toggle('hidden', i !== index);
                        });
                    };

                    card.querySelector('.arrow.left').addEventListener('click', (e) => {
                        e.stopPropagation();
                        current = (current - 1 + images.length) % images.length;
                        showImage(current);
                    });

                    card.querySelector('.arrow.right').addEventListener('click', (e) => {
                        e.stopPropagation();
                        current = (current + 1) % images.length;
                        showImage(current);
                    });
                }
            });
        });

    function updateCartCount() {
        if (cartCountElem) cartCountElem.textContent = cart.length;
    }

    function showToast(text) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position:fixed;
                bottom:30px;
                left:50%;
                transform:translateX(-50%);
                background:#111;
                color:#fff;
                padding:12px 25px;
                border-radius:30px;
                z-index:3000;
                display:none;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 2500);
    }

    // reveal анімація
    function revealOnScroll() {
        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 100) el.classList.add('active');
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // виклик одразу, якщо щось вже видно

    // ===== SIDEBAR =====
    const logo = document.getElementById('logo');
    const sidebar = document.getElementById('sidebar');

    // overlay
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.3);
        display:none;
        z-index:1500;
    `;
    document.body.appendChild(overlay);

    const openSidebar = () => {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
    };
    const closeSidebar = () => {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    };

    // відкриття по hover
    logo.addEventListener('mouseenter', openSidebar);
    logo.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!sidebar.matches(':hover')) closeSidebar();
        }, 200);
    });

    sidebar.addEventListener('mouseenter', openSidebar);
    sidebar.addEventListener('mouseleave', closeSidebar);

    // закриття при кліку на overlay
    overlay.addEventListener('click', closeSidebar);
});