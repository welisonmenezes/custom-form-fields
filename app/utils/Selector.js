export default class Selector {

	constructor() {}
	
	getElements(query, parent) {
		if(query){
			const parent = (parent) ? parent : document;
			const nodes = parent.querySelectorAll(query);
			return (nodes.length) ? nodes : null;
		}
		return null;
	}

}