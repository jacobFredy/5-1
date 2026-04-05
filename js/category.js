document.addEventListener('DOMContentLoaded', () => {

    const productContainer = document.querySelector('.product-row');
    const cartCountElem = document.getElementById('cart-count');
    const sizeFilter = document.getElementById('filter-size');
    const categoryFilter = document.getElementById('filter-category');
    const categoryTitle = document.getElementById('category-title');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let productsData = [];

    // Отримуємо category з URL
    const params = new URLSearchParams(window.location.search);
    const categoryType = params.get("type");
    categoryTitle.textContent = categoryType ? categoryType.toUpperCase() : 'ALL PRODUCTS';
    if(categoryType && categoryFilter) categoryFilter.value = categoryType;

    updateCartCount();

    // Завантажуємо продукти з JSON
    fetch('data/product.json')
        .then(res => res.json())
        .then(products => {
            productsData = products;
            renderProducts();
        });

    // Слухачі фільтрів
    sizeFilter.addEventListener('change', renderProducts);
    categoryFilter.addEventListener('change', renderProducts);

    function renderProducts() {
        productContainer.innerHTML = '';

        let filtered = productsData;

        // Фільтр за категорією
        if(categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter.value);
        }

        // Фільтр за розміром
        if(sizeFilter && sizeFilter.value !== 'all') {
            filtered = filtered.filter(p => p.sizes && p.sizes.includes(sizeFilter.value));
        }

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';

            // картинки
            let imagesHTML = '';
            product.img.forEach((img, i) => {
                imagesHTML += `<img src="${img}" class="product-img" alt="${product.name}" style="${i>0?'display:none;':''}">`;
            });

            // розміри
            let sizesHTML = '';
            ['S','M','L','XL'].forEach(sz => {
                sizesHTML += `<span class="${product.sizes && product.sizes.includes(sz)?'available':'unavailable'}">${sz}</span>`;
            });

            card.innerHTML = `
                <div class="badge">NEW</div>
                <div class="sale">-20%</div>
                <div class="wishlist">♡</div>

                <div class="product-link">
                    ${imagesHTML}
                </div>

                <h3>${product.name}</h3>
                <p class="price">${product.price} грн</p>

                <div class="size-options">
                    ${sizesHTML}
                </div>

                <div class="quick-add" data-id="${product.id}">Quick Add</div>
            `;

            productContainer.appendChild(card);

            // hover ефект картинок
            const imgs = card.querySelectorAll('.product-img');
            if(imgs.length > 1){
                imgs.forEach((img, i) => {
                    if(i > 0) img.style.display = 'none';
                });
                card.addEventListener('mouseenter', () => {
                    imgs[0].style.display='none';
                    imgs[1].style.display='block';
                });
                card.addEventListener('mouseleave', () => {
                    imgs[1].style.display='none';
                    imgs[0].style.display='block';
                });
            }

            // клік на картку
            card.querySelector('.product-link').addEventListener('click', () => {
                window.location.href = `./product.html?id=${product.id}`;
            });

            // quick add
            card.querySelector('.quick-add').addEventListener('click', e => {
                e.stopPropagation();
                addToCart(product.id);
            });
        });
    }

    function addToCart(id){
        const product = productsData.find(p => p.id==id);
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast("Товар доданий у корзину!");
    }

    function updateCartCount(){
        if(cartCountElem) cartCountElem.textContent = cart.length;
    }

    function showToast(text){
        let toast = document.getElementById('toast');
        toast.textContent = text;
        toast.style.display='block';
        toast.style.opacity = 0;
        setTimeout(()=>toast.style.opacity=1,50);
        setTimeout(()=>{ toast.style.opacity=0; setTimeout(()=>toast.style.display='none',400); },3000);
    }

});