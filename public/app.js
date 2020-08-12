$(() => {
    const formatValue = value => {
        return new Intl.NumberFormat('ru-RU', {
            currency: 'rub',
            style: 'currency'
        }).format(value);
    };

    $('.price').each((index, node) => $(node).text(formatValue($(node).text())));
    // Корзина (удаление)
    const $cart = $('#cart');
    if ($cart) {
        $cart.on('click', ({
            target
        }) => {
            if (!$(target).hasClass('remove-course')) return;

            fetch(`/cart/remove/${event.target.dataset.id}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(cartData => {
                    if (cartData.courses.length) {
                        const idx = cartData.courses.findIndex(course => course.id === target.dataset.id);
                        const course = cartData.courses[idx];

                        /* Уменьшаем количество или удаляем полностью из корзины */
                        if (course && course.count) $(target).parents('.course-item').find('.course-count').text(course.count);
                        else $(target).parents('.course-item').remove();

                        // Форматируем окончательную стоимость содержимого корзины
                        $('.price').text(formatValue(cartData.price));
                    } else {
                        // Если закончились курсы
                        $cart.html('<p>Корзина пуста</p>');
                    }
                });
        });
    }
});