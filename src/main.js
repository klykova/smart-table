import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const api = initData(sourceData);

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
async function render(action) {
    let state = collectState();
    let query = {};

    // Применяем фильтрацию
    query = applyFiltering(query, state, action);
    
    // Применяем сортировку 
    query = applySorting(query, state, action);
    
    // Применяем пагинацию
    query = applyPagination(query, state, action);

    // Применяем поиск
    query = applySearching(query, state, action);
    
    const { total, items } = await api.getRecords(query);
    updatePagination(total, query); 
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['header', 'filter'], 
    after: ['pagination']
}, render);

// Инициализация поиска
const applySearching = initSearching('searchField');

// Инициализация фильтрации
const { applyFiltering, updateIndexes } = initFiltering(
    sampleTable.filter.elements,
    {} // временно пустой объект, заполнится в init()
);

// Инициализация пагинации
const { applyPagination, updatePagination } = initPagination(
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

// Добавляем обработчики кликов на кнопки сортировки
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

async function init() {
    const indexes = await api.getIndexes();

    // Обновляем индексы фильтрации
    updateIndexes({
        searchBySeller: indexes.sellers // передаем массив продавцов для select
    });
}

init().then(render);