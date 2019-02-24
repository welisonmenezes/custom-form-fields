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
	
}