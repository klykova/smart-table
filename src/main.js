import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {Object?} action
 */
function render(action = null) {
    let state = collectState();
    let result = [...data];

      //применяем фильтрацию 
    result = applyFiltering(result, state, action);
    // Применяем сортировку 
    result = applySorting(result, state, action);
    
    // Применяем пагинацию
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'], 
    after: ['pagination']
}, render);
 //Инициализация фильтрации
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers    // передаем массив продавцов для select
});

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
//  Добавляем обработчики кликов на кнопки сортировки
sampleTable.header.elements.sortByDate.addEventListener('click', function() {
    this.name = 'sort'; // Добавляем свойство name для идентификации действия
    render(this);
});

sampleTable.header.elements.sortByTotal.addEventListener('click', function() {
    this.name = 'sort'; // Добавляем свойство name для идентификации действия
    render(this);
});

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();