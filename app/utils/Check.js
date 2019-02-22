export default class Check {

	constructor() {}

	isHTMLElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }

    isObject(obj) {
		return (obj != false && typeof obj === 'object' && obj instanceof Object && (typeof obj !== 'function'));
	}

	isDigit(value) {
        return (/^[a-zA-Z0-9]+$/.test(value));
    }

    isSingleDigit(value) {
        return (/^[a-zA-Z0-9]+$/.test(value)) && (value.length === 1);
    }
	
}