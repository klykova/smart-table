export function initSearching(searchField) {

    return (query, state, action) => {
        return state[searchField] ? Object.assign({}, query, { // Проверяем, что в поле поиска было что-то введено
            search: state[searchField] // Устанавливаем в query параметр
        }) : query; // Если поле с поиском пустое, просто возвращаем query без изменений
    }
}