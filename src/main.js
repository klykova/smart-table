import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";
import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initSearching} from "./components/searching.js";


// Исходные данные используемые в render()
const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // Количество страниц к числу
    const page = parseInt(state.page ?? 1);                // Номер страницы по умолчанию 1 

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState(); // Состояние полей из таблицы
    let query = {}; // Здесь будут формироваться параметры запроса
    query = applyPagination(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySearching(query, state, action);
    query = applySorting(query, state, action);

    const { total, items } = await api.getRecords(query); // Запрашиваем данные с собранными параметрами

    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search','header', 'filter'],
    after: ['pagination']
}, render);

import {initFiltering} from './components/filtering';

const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

import {initSorting} from './components/sorting.js';
const applySorting = initSorting([  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация пагинации
import {initPagination} from './components/pagination.js';
const { applyPagination, updatePagination } = initPagination(
    sampleTable.pagination.elements, // Передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => { // Колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);
// Инициализация поиска
const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);