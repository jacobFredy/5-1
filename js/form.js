document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('orderForm');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const data = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showToast("Замовлення відправлено 🔥");
                form.reset();
            } else {
                showToast("Помилка відправки ❌");
            }
        })
        .catch(() => {
            showToast("Помилка мережі ❌");
        });
    });

    function showToast(text) {
        const toast = document.getElementById('toast');
        toast.textContent = text;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

});