export default class Selector {

	constructor() {}

	getElements(query, parent) {
		if(query){
			const wrap = (parent) ? parent : document;
			const nodes = wrap.querySelectorAll(query);
			return (nodes.length) ? nodes : null;
		}
		return null;
	}

	getElement(query, parent) {
		if(query){
			const wrap = (parent) ? parent : document;
			const node = wrap.querySelector(query);
			return (node) ? node : null;
		}
		return null;
	}

}