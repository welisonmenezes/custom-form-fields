export default class Creator {

	/**
     * The constructor
     * @param { Check } An instance of the Check class
     */
	constructor(Check) {
		this.check = Check;
	}

	/**
     * Create HTML elements from given params
     * @param { Array } An array of objects that configure the criation of new element
     *
     *	eg.: [{
	 *			name: 'DIV',
	 *			class: ['class-div'],
	 *			attributes: [
	 *				{name: 'data-value', value: 'value-test'},
	 *				{name: 'id', value: 'div-id'}
	 *			],
	 *			text: 'Div text',
	 *			children: {
	 *				elements: [
	 *					{
	 *						name: 'P',
	 *						class: ['class-1', 'class-2'],
	 *						attributes: [
	 *							{name: 'data-value', value: 'value-test'},
	 *							{name: 'data-target', value: 'target-test'}
	 *						],
	 *						text: 'P text',
	 *						children: {
	 *							elements: [
	 *								{
	 *									name: 'LABEL',
	 *									children: {
	 *										elements: [
	 *											{
	 *												name: 'SPAN',
	 *												text: 'inside all'
	 *											}
	 *										]
	 *									}
	 *								},
	 *								{
	 *									name: 'INPUT',
	 *									class: ['form-control', 'input-cls'],
	 *									attributes: [
	 *										{name: 'value', value: 'email@email'},
	 *										{name: 'type', value: 'email'}
	 *									]
	 *								}
	 *							],
	 *							parentTree: {
	 *								name: 'SPAN',
	 *								class: ['class-span'],
	 *								attributes: [{name: 'id', value: 'span-id-parent'}]
	 *							}
	 *						}
	 *					},
	 *					{
	 *						name: 'P',
	 *						text: 'Paragraph'
	 *					}
	 *				]
	 *			}
	 *		},
	 *		{
	 *			name: 'SPAN',
	 *			text: 'SPAN text'
	 *		}]
	 *
	 * @param { Object } parentTree - An object that configure the parent of new element,
	 * if not was passed a DIV element will be created by default.
	 *
	 * eg.: {
	 *			name: 'DIV',
	 *			class: ['class-div'],
	 *			attributes: [{name: 'id', value: 'div-id-parent'}]
	 *		}
	 *
     * @returns { HTMLElement } The parentTree with the new created element into or null 
     */
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
		return null;
	}

	/**
	 * Create a single HTML element
	 * @param { Object } element - An object that cofigure the creation of the new element
	 * eg.: {
	 *			name: 'SPAN',
	 *			text: 'SPAN text'
	 *		}
	 *
	 * @returns { HTMLElement } The new created element
	 */
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

	/**
	 * Create HTML attribute with given name and value to given element
	 * @param { HTMLElement } select - The select element
	 * @param { String } attrName - The attribute's name
	 * @param { String } attrValue - The attribute's value
	 */
	createAttribute(element, attrName, attrValue) {
		const tempAtt = document.createAttribute(attrName);
		tempAtt.value = attrValue
		element.setAttributeNode(tempAtt);
	}

	/**
	 * Remove a given HTML attribute of a given element
	 * @param { HTMLElement } element - The element that your attribute will be removed
	 * @param { String } attrName - The attribute's name
	 */
	removeAttribute(element, attrName) {
		if (element.hasAttribute(attrName)) {
			element.setAttribute(attrName, 'false'); // to make works in ie
			element.removeAttribute(attrName);
		}
	}
}