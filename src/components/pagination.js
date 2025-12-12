import { getPages } from '../lib/utils.js';

export const initPagination = (
    { pages, fromRow, toRow, totalRows, rowsPerPage },
    createPage
) => {
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    let pageCount;

    const applyPagination = (query, state, action) => {
        let page = state.page;
        const limit = state.rowsPerPage;

        if (action)
            switch (action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;
                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;
                case 'first':
                    page = 1;
                    break;
                case 'last':
                    page = pageCount;
                    break;
            }

        return Object.assign({}, query, {
            // Добавим параметры к query, но не изменяем исходный объект
            limit,
            page,
        });
    };

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // Получим массив страниц, которые нужно показать, выводим только 5 страниц
        const visiblePages = getPages(page, pageCount, 5);
        // Перебираем их и создаём для них кнопку
        pages.replaceChildren(
            ...visiblePages.map((pageNumber) => {
                // Клонируем шаблон, который запомнили ранее
                const el = pageTemplate.cloneNode(true);
                // Вызываем колбэк из настроек, чтобы заполнить кнопку данными
                return createPage(el, pageNumber, pageNumber === page);
            })
        );

        // Обновляем статус пагинации
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min(page * limit, total);
        totalRows.textContent = total;
    };

    return {
        updatePagination,
        applyPagination,
    };
};