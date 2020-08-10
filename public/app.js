$(() => {
    const formatValue = value => {
        return new Intl.NumberFormat('ru-RU', {
            currency: 'rub',
            style: 'currency'
        }).format(value);
    };

    $('.price').each((index, node) => $(node).text(formatValue($(node).text())));
    // Корзина (удаление)
    const $card = $('#card');
    if ($card) {
        $card.on('click', ({
            target
        }) => {
            if (!$(target).hasClass('remove-course')) return;

            fetch(`/card/remove/${event.target.dataset.id}`, {
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
                        $('.price').text(formatValue(cardData.price));
                    } else {
                        // Если закончились курсы
                        $card.html('<p>Корзина пуста</p>');
                    }
                });
        });
    }
});