import Check from './Check.js';
export default class Creator {

	constructor() {
		this.check = new Check();
	}

	createElements(elements, parentTree) {
		if( elements && Array.isArray(elements) ) {
			const tempEls = [];
			let parent = document.createElement('DIV');
			if(this.check.isHTMLElement(parentTree)) {
				parent = parentTree;
			} else if (parentTree && parentTree.name) {
				parent = this.createASingleElement(parentTree);
			}
			elements.forEach((element) => {
				if( element && element.name ) {
					const tempEl = this.createASingleElement(element);
					tempEls.push(tempEl);
				}
			});
			let lastEl, i;
			const total = tempEls.length;
			for(i = 0; i < total; i++) {
				parent.appendChild(tempEls[i]);
			}
			return parent;
		}
	}

	createASingleElement(element) {
		const tempEl = document.createElement(element.name);
		if(element.class && Array.isArray(element.class)) {
			element.class.forEach((cls) => {
				tempEl.classList.add(cls);
			});
		}
		if(element.attributes && Array.isArray(element.attributes)) {
			element.attributes.forEach((attr) => {
				this.createAttribute(tempEl, attr.name, attr.value);
			});
		}
		if(element.text) {
			const tempText = document.createTextNode(element.text);
			tempEl.appendChild(tempText);
		}
		if(element.children && element.children.elements) {
			const parentTree = (element.children.parentTree) ? element.children.parentTree : tempEl;
			const tempChild = this.createElements(element.children.elements, parentTree);
			if(element.children.parentTree) tempEl.appendChild(tempChild);
		}
		return tempEl;
	}

	createAttribute(element, attrName, attrValue) {
		const tempAtt = document.createAttribute(attrName);
		tempAtt.value = attrValue
		element.setAttributeNode(tempAtt);
	}
}