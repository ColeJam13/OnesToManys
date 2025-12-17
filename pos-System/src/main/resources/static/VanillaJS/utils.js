export function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

export function createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

export function showError(message) {
    alert(`Error: ${message}`);
    console.error(message);
}

export function createLoadingIndicator() {
    return createElement('div', 'loading-indicator', '<p>Loading. . .</p>');
}

export function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}