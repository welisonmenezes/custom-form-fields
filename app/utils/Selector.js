export default class Selector {

	constructor() {}

	/**
	 * Get HTML elements from given query 
	 * @param { String } query - A valid css selector
	 * @param { HTMLElement } parent - A Html element on wath will be applied the query (document is the default)
	 * @returns { NodeList } The query's result or null
	 */
	getElements(query, parent) {
		if (query) {
			const wrap = (parent) ? parent : document;
			const nodes = wrap.querySelectorAll(query);
			return (nodes.length) ? nodes : null;
		}
		return null;
	}

	/**
	 * Get HTML element from given query (always will return one element, the first)
	 * @param { String } query - A valid css selector
	 * @param { HTMLElement } parent - A Html element on wath will be applied the query (document is the default)
	 * @returns { HTMLElement } The query's result or null
	 */
	getElement(query, parent) {
		if (query) {
			const wrap = (parent) ? parent : document;
			const node = wrap.querySelector(query);
			return (node) ? node : null;
		}
		return null;
	}

}