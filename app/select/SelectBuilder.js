import Selector from '../utils/Selector.js';
import Creator from '../utils/Creator.js';

export default class SelectBuilder {

	constructor() {
		this.$ = new Selector();
		this.creator = new Creator();


		this.addEventListenerToSelect(document.getElementsByTagName('body')[0], 'click', this.onSelectFocusOut, [this]);
	}

	build() {
		const selects = this.$.getElements('select');
		selects.forEach((select)  => {
			this.creator.createAttribute(select, 'tabindex', -1);
			const wrapSelect = this.createWrapSelect(select);
			const createdUISelect = this.createUISelect(select);
			this.insertCreatedUISelect(createdUISelect, wrapSelect);

			this.setSelectedOption(select);
			this.createSelectedOptsDisplayS(select);

			this.addEventListenerToSelect(wrapSelect, 'click', this.onSelectClick, [this]);
		});
	}

	createWrapSelect(select) {
		const selectType = (select.hasAttribute('multiple')) ? 'multiple' : 'normal';
		const wrapArr = [
			{
				name: 'DIV',
				class: ['wrap-select', selectType]
			}
		];
		const parentSelect = this.creator.createElements(wrapArr, select.parentNode);
		const wrapSelect = this.$.getElement('div.wrap-select', parentSelect);
		if(wrapSelect) {
			wrapSelect.insertAdjacentElement('afterbegin', select);
		}
		this.creator.createAttribute(wrapSelect, 'tabindex', 0);
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

	setSelectedOption(select) {
		const options = this.$.getElements('option', select);
		const divOptions = this.$.getElements('.option-class', select.parentElement);
		if(options.length) {
			options.forEach((opt, i) => {
				if( (opt.value === select.value) || (opt.hasAttribute('selected') && opt.getAttribute('selected') !== 'false') ) {
					divOptions[i].classList.add('selected');
				}
			});
		}
	}

	getSelectedOptions(select) {
		const divOptions = this.$.getElements('.option-class.selected', select.parentElement);
		if(divOptions) {
			return divOptions;
		}
		return null;
	}

	createSelectedOptsDisplayS(select) {
		const selectedOptions = this.getSelectedOptions(select);
		const displayContainer = {
			name: 'DIV',
			class: ['display-class'],
			children: {
				elements: []
			}
		};
		if(selectedOptions.length) {
			selectedOptions.forEach((opt) => {
				displayContainer.children.elements.push(this.createSelectedOptionsObj(opt));
			});
		}
		const selectedDisplay = this.creator.createElements([displayContainer], select.parentNode);
		return selectedDisplay;
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

	createSelectedOptionsObj(selectedOption) {
		return {
			name: 'DIV',
			class: ['displayed-class'],
			text: selectedOption.innerHTML,
			attributes: [
				{name: 'data-value', value: selectedOption.getAttribute('data-value')}
			]
		};
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

	addEventListenerToSelect(element, eventName, callback, arrayArgs) {
		if(element) {
			element.addEventListener(eventName, callback.bind(element, arrayArgs));
		}
	}

	closeWrapSelects() {
		const wrapSelects =  document.querySelectorAll('.wrap-select');
		if(wrapSelects.length) {
			wrapSelects.forEach((wrapSelect) => {
				if(wrapSelect.classList.contains('opened')) {
					wrapSelect.classList.remove('opened');
					wrapSelect.querySelector('.container-class').style.height = 0;
				}
			});
		}
	}

	onSelectClick(args) {

		arguments[(arguments.length - 1)].stopPropagation();

		args[0].closeWrapSelects();

		this.classList.add('opened');
		const items = this.querySelectorAll('.item-class');
		let heightAll = 0;
		if(items.length) {
			items.forEach((item) => {
				heightAll = heightAll + item.clientHeight;
			});
		}
		this.querySelector('.container-class').style.height = heightAll + 'px';
	}

	onSelectFocusOut(args) {
		args[0].closeWrapSelects();
	}
}