export default class Selector {

	constructor() {}

	getElements(query, parent) {
		//console.log(parent)
		if(query){
			const wrap = (parent) ? parent : document;
			//console.log(wrap)
			const nodes = wrap.querySelectorAll(query);
			return (nodes.length) ? nodes : null;
		}
		return null;
	}

}