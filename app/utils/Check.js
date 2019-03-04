export default class Check {

	constructor() {}

    /**
     * Checks if value a Html Element
     * @param { Any } element The value that will be validated
     * @returns { Boolean } if is valid (true
     */
	isHTMLElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }

    /**
     * Checks if value an Object
     * @param { Any } object The value that will be validated
     * @returns { Boolean } if is valid (true)
     */
    isObject(obj) {
		return (obj != false && typeof obj === 'object' && obj instanceof Object && (typeof obj !== 'function'));
	}

    /**
     * Checks if value is a valid digit
     * @param { String } value The value that will be validated
     * @returns { Boolean } if is valid (true)
     */
	isDigit(value) {
        return (/^[a-zA-Z0-9]+$/.test(value));
    }

    /**
     * Checks if value is a valid single digit
     * @param { String } value The value that will be validated
     * @returns { Boolean } if is valid (true)
     */
    isSingleDigit(value) {
        return (/^[a-zA-Z0-9]+$/.test(value)) && (value.length === 1);
    }

    /**
     * Checks if value a Function
     * @param { Any } fn The value that will be validated
     * @returns { Boolean } if is valid (true)
     */
    isFunction(fn) {
        return Object.prototype.toString.call(fn) == '[object Function]';
    }

    /**
     * Checks if value is (or can be) a valid Integer
     * @param { String } value The value that will be validated
     * @returns { Boolean } if is valid (true)
     */
    isInteger(value) {
        return (/^[0-9]+$/.test(value));
    }

    /**
     * Checks if element is an input of type radio
     * @param { Any } element - The object the will be verified
     * @returns { Boolean } if is an input of type radio (true)
     */
    isInputRadio(element) {
        return (element && element.tagName === 'INPUT' && element.getAttribute('type') === 'radio');
    }

    /**
     * Checks if element is an input of type checkbox
     * @param { Any } element - The object the will be verified
     * @returns { Boolean } if is an input of type checkbox (true)
     */
    isInputCheckbox(element) {
        return (element && element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox');
    }
	
    /**
     * Checks if element is checked
     * @param { HTMLElement } element - The element the will be verified
     * @returns { Boolean } if the element is checked (true)
     */
    isElementChecked(element) {
        return (element && element.checked);
    }

    isElementDisabled(element) {
        return (element && element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false');
    }
}