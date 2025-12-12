import { sortMap } from '../lib/sort.js';

export function initSorting(columns) {
    return (query, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // Запоминаем выбранный режим сортировки
            action.dataset.value = sortMap[action.dataset.value]; // Сохраним и применим как текущее следующее состояние из карты
            field = action.dataset.field; // Информация о сортируемом поле есть также в кнопке
            order = action.dataset.value; // Направление заберём прямо из датасета для точности
            // Сбрасываем сортировки остальных колонок
            columns.forEach((column) => {
                // Перебираем элементы (в columns у нас массив кнопок)
                if (column.dataset.field !== action.dataset.field) {
                    // Если это не та кнопка, что нажал пользователь
                    column.dataset.value = 'none'; // Тогда сбрасываем её в начальное состояние
                }
            });
        } else {
            // Получаем выбранный режим сортировки
            columns.forEach((column) => {
                // Перебираем все наши кнопки сортировки
                if (column.dataset.value !== 'none') {
                    // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
                    field = column.dataset.field; // Сохраняем в переменных поле
                    order = column.dataset.value; // Направление сортировки
                }
            });
        }

        // Сохраним в переменную параметр сортировки в виде field:direction
        const sort = field && order !== 'none' ? `${field}:${order}` : null;

        // По общему принципу, если есть сортировка, добавляем, если нет, то не трогаем query
        return sort ? Object.assign({}, query, { sort }) : query;
    };
}