import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    if (elements.searchBySeller && indexes.searchBySeller) {
        const sellerSelect = elements.searchBySeller;

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Все продавцы';
        sellerSelect.appendChild(defaultOption);

        // проверяем что это массив
        if (Array.isArray(indexes.searchBySeller)) {
            indexes.searchBySeller.forEach(seller => {
                const option = document.createElement('option');
                option.value = seller;
                option.textContent = seller;
                sellerSelect.appendChild(option);
            });
        } else if (typeof indexes.searchBySeller === 'object') {
            // Если это объект, используем Object.keys()
            Object.keys(indexes.searchBySeller).forEach(seller => {
                const option = document.createElement('option');
                option.value = seller;
                option.textContent = seller;
                sellerSelect.appendChild(option);
            });
        }
    }

    return (data, state, action) => {
        let result = [...data];
        
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            if (action.dataset.field === 'seller') {
                elements.searchBySeller.value = '';
            }
        } 

        // @todo: #4.3 — настроить компаратор
        const compare = createComparison(defaultRules);

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}