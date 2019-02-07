export default class Creator {

	constructor() {}

	createElements(elements) {
		if( Array.isArray(elements) ) {
			const tempEls = [];

			elements.forEach((element) => {

				if( element.name ) {
					const tempEl = document.createElement(element.name);

					if(element.class && Array.isArray(element.class)) {
						element.class.forEach((cls) => {
							tempEl.classList.add(cls);
						});
					}

					if(element.attributes && Array.isArray(element.attributes)) {
						element.attributes.forEach((attr) => {
							const tempAtt = document.createAttribute(attr.name);
							tempAtt.value = attr.value;
							tempEl.setAttributeNode(tempAtt);
						});
					}

					if(element.text) {
						const tempText = document.createTextNode(element.text);
						tempEl.appendChild(tempText);
					}

					tempEls.push(tempEl);
				}

			});

			const total = tempEls.length;
			let i;
			let lastEl;
			for(i = (total - 1); i >= 0; i--) {
				if(i > 0) {
					tempEls[i - 1].appendChild(tempEls[i]);
					lastEl = tempEls[i - 1];
				}
			}
			return lastEl;
		}
	}

}