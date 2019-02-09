import Selector from '../utils/Selector.js';
import Creator from '../utils/Creator.js';

export default class SelectBuilder {

	constructor() {
		this.$ = new Selector();
		this.creator = new Creator();
	}

	build() {
		const selects = this.$.getElements('select');
		selects.forEach((select)  => {
			const wrapSelect = this.createWrapSelect(select);
			const createdUISelect = this.createUISelect(select);
			this.insertCreatedUISelect(createdUISelect, wrapSelect);
		});
	}

	createWrapSelect(select) {
		const wrapArr = [
			{
				name: 'DIV',
				class: ['wrap-select']
			}
		];
		const parentSelect = this.creator.createElements(wrapArr, select.parentNode);
		const wrapSelect = this.$.getElement('div.wrap-select', parentSelect);
		if(wrapSelect) {
			wrapSelect.insertAdjacentElement('afterbegin', select);
		}
		return wrapSelect;
	}

	createUISelect(select) {
		let childObj;
		const divParent = {
			name: 'DIV',
			class: ['container-class']
		};
		const optsArr = this.createSelectObj(select);
		const createdEl = this.creator.createElements(optsArr, divParent);
		return createdEl;
	}

	insertCreatedUISelect(createdUISelect, wrapSelect) {
		if(createdUISelect && wrapSelect) {
			wrapSelect.appendChild(createdUISelect);
		}
	}

	createSelectObj(containerOptions) {
		const optsArr = [];
		const children = containerOptions.children;
		if(children.length) {
			const total = children.length;
			let i, child;
			for(i = 0; i < total; i++){
				child = children[i];
				if(child.tagName === 'OPTION') {
					optsArr.push(this.createOptionsObj(child));
				} else if (child.tagName === 'OPTGROUP') {
					optsArr.push(this.createGroupsObj(child));
				}
			}
		}
		return optsArr;
	}

	createOptionsObj(optionElement) {
		return {
			name: 'DIV',
			class: ['item-class', 'option-class'],
			text: optionElement.innerHTML,
			attributes: [
				{name: 'data-value', value: optionElement.value}
			]
		};
	}

	createGroupsObj(groupElement) {
		const group = {
			name: 'DIV',
			class: ['group-class'],
			children: {
				elements: [
					{
						name: 'DIV',
						class: ['item-class', 'title-class'],
						text: groupElement.getAttribute('label')
					}
				]
			}
		};
		if(groupElement.children.length) {
			const grupOptsArr = this.createSelectObj(groupElement);
			if(grupOptsArr.length) {
				grupOptsArr.forEach((optObj) => {
					group.children.elements.push(optObj);
				});
			}
		}
		return group;
	}
}