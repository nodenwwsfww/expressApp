$(() => {
    const toCurrency = value => {
        if (+value) {
            return new Intl.NumberFormat('ru-RU', {
                currency: 'rub',
                style: 'currency'
            }).format(value);
        } else return false;
    };

    const toDate = date => new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));

    {
        $('.price').each((index, node) => {
            $(node).text(toCurrency($(node).text()))
        });
    }
    $('.date').each((index, node) => $(node).text(toDate($(node).text())));
    // Корзина (удаление)
    const $card = $('#card');
    if ($card) {
        $card.on('click', ({
            target
        }) => {
            if (!$(target).hasClass('remove-course')) return;
            fetch(`/cart/remove/${event.target.dataset.id}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(cardData => {
                    if (cardData.courses.length) {
                        const idx = cardData.courses.findIndex(course => course.id === target.dataset.id);
                        const course = cardData.courses[idx];

                        /* Уменьшаем количество или удаляем полностью из корзины */
                        if (course && course.count) $(target).parents('.course-item').find('.course-count').text(course.count);
                        else $(target).parents('.course-item').remove();

                        // Форматируем окончательную стоимость содержимого корзины
                        $('.price').text(toCurrency(cardData.price));
                    } else {
                        // Если закончились курсы
                        $card.html('<p>Корзина пуста</p>');
                    }
                });
        });
    }

    /* Табы auth */
    M.Tabs.init(document.querySelectorAll('.tabs'), {});
});