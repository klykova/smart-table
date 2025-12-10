import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();
    
    let pageCount;

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        // переносим код, который делали под @todo: #2.6
        if (action && action.type) {
            switch(action.type) {
                case 'first':
                    page = 1;
                    break;
                case 'prev':
                    page = Math.max(page - 1, 1);
                    break;
                case 'next':
                    page = Math.min(page + 1, pageCount || 9999);
                    break;
                case 'last':
                    page = pageCount || 1;
                    break;
                case 'page':
                    if (action.pageNumber) {
                        page = action.pageNumber;
                    }
                    break;
            }
        }

        return Object.assign({}, query, { // добавим параметры к query, но не изменяем исходный объект
            limit,
            page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        // переносим код, который делали под @todo: #2.4
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        // переносим код, который делали под @todo: #2.5 (обратите внимание, что rowsPerPage заменена на limit)
        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min((page * limit), total);
        totalRows.textContent = total;
    }

    return {
        updatePagination,
        applyPagination
    };
};