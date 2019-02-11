import Selector from '../utils/Selector.js';
import Creator from '../utils/Creator.js';

export default class SelectBuilder {

	constructor() {
		this.$ = new Selector();
		this.creator = new Creator();
		this.addEventListenerToElement(document.getElementsByTagName('body')[0], 'click', this.onSelectFocusOut, [this]);
	}

	build() {
		const selects = this.$.getElements('select');
		selects.forEach((select)  => {
			this.creator.createAttribute(select, 'tabindex', -1);
			const wrapSelect = this.createWrapSelect(select);
			const createdUISelect = this.createUISelect(select);
			this.insertCreatedUISelect(createdUISelect, wrapSelect);
			this.setSelectedOption(select);
			this.createSelectedOptsDisplay(select);
			this.resolveEventsToUiSelect(wrapSelect);
		});
	}

	resolveEventsToUiSelect(wrapSelect) {
		this.addEventListenerToElement(wrapSelect, 'click', this.onToggleSelectClick, [this]);
		const options = wrapSelect.querySelectorAll('.option-class');
		if(options.length) {
			options.forEach((opt) => {
				this.addEventListenerToElement(opt, 'click', this.onSelectItem, [this, wrapSelect]);
			});
		}
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
		const isMultiple = (select.hasAttribute('multiple'));
		if(options.length) {
			options.forEach((opt, i) => {
				if( (opt.hasAttribute('selected') && opt.getAttribute('selected') !== 'false') ) {
					divOptions[i].classList.add('selected');
				} else if(!isMultiple && (opt.value === select.value)) {
					divOptions[i].classList.add('selected');
				}
			});
		}
		if(isMultiple){
			const SelectedDivOptions = this.$.getElements('.option-class.selected', select.parentElement);
			if(!SelectedDivOptions) {
				this.creator.createAttribute(options[0], 'selected', true);
				divOptions[0].classList.add('selected');
			} else {
				options[0].removeAttribute('selected');
				divOptions[0].classList.remove('selected');
			}
		}
		
	}

	getSelectedOptions(select) {
		const divOptions = this.$.getElements('.option-class.selected', select.parentElement);
		if(divOptions) {
			return divOptions;
		}
		return null;
	}

	createSelectedOptsDisplay(select) {
		const wrapSelect = select.parentNode;
		const selectedOptions = this.getSelectedOptions(select);
		const displayContainer = {
			name: 'DIV',
			class: ['display-class'],
			children: {
				elements: []
			}
		};
		if(selectedOptions && selectedOptions.length) {
			selectedOptions.forEach((opt) => {
				displayContainer.children.elements.push(this.createSelectedOptionsObj(opt));
			});
		}

		

		const displayedOpts =  this.creator.createElements([displayContainer], wrapSelect);
		this.resolveEventsToUiOptions(wrapSelect);
		return displayedOpts;
	}

	updateSelectedOptsDisplay(select) {
		const wrapSelect = select.parentNode;
		const existedDisplays = wrapSelect.querySelector('.display-class');
		existedDisplays.innerHTML = '';
		const selectedOptions = this.getSelectedOptions(select);
		const arr = [];
		if(selectedOptions && selectedOptions.length) {
			selectedOptions.forEach((opt) => {
				arr.push(this.createSelectedOptionsObj(opt));
			});
		}
		const displayedOpts =  this.creator.createElements(arr, existedDisplays);
		this.resolveEventsToUiOptions(wrapSelect);
		return displayedOpts;
	}

	resolveEventsToUiOptions(wrapSelect) {
		if(wrapSelect.classList.contains('multiple')) {
			const displayedOpts = wrapSelect.querySelectorAll('.displayed-class');
			if(displayedOpts.length) {
				displayedOpts.forEach((opt) => {
					this.addEventListenerToElement(opt, 'click', this.onDeselectItem, [this, wrapSelect]);
				});
			}
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

	addEventListenerToElement(element, eventName, callback, arrayArgs) {
		if(element) {
			element.addEventListener(eventName, callback.bind(element, arrayArgs));
		}
	}

	closeWrapSelects() {
		const wrapSelects =  document.querySelectorAll('.wrap-select.opened');
		if(wrapSelects.length) {
			wrapSelects.forEach((wrapSelect) => {
				wrapSelect.classList.remove('opened');
				wrapSelect.querySelector('.container-class').style.height = 0;
			});
		}
	}

	openWrapSelect(wrapSelect) {
		wrapSelect.classList.add('opened');
		const items = wrapSelect.querySelectorAll('.item-class');
		let heightAll = 0;
		if(items.length) {
			items.forEach((item) => {
				heightAll = heightAll + item.clientHeight;
			});
		}
		wrapSelect.querySelector('.container-class').style.height = heightAll + 'px';
	}

	resetNonMultipleSelect(select, wrapSelect) {
		const divSelectedOpts = wrapSelect.querySelectorAll('.option-class.selected');
		const opts = select.querySelectorAll('option');
		if(opts.length) {
			opts.forEach((opt) => {
				opt.removeAttribute('selected');
			});
		}
		if(divSelectedOpts) {
			divSelectedOpts.forEach((opt) => {
				opt.classList.remove('selected');
			});
		}
		select.value = '';
	}

	onToggleSelectClick(args) {
		arguments[(arguments.length - 1)].stopPropagation();
		if(this.classList.contains('opened')) {
			args[0].closeWrapSelects();
		} else {
			args[0].closeWrapSelects();
			args[0].openWrapSelect(this);
		}
	}

	onSelectFocusOut(args) {
		args[0].closeWrapSelects();
	}

	onSelectItem(args) {
		arguments[(arguments.length - 1)].stopPropagation();
		const self = args[0];
		const wrapSelect = args[1];
		const val = this.getAttribute('data-value');
		const optByVal = wrapSelect.querySelector('[value="' + val + '"]');
		const select = wrapSelect.querySelector('select');
		if(!select.hasAttribute('multiple')) {
			self.resetNonMultipleSelect(select, wrapSelect);
			select.value = val;
			self.closeWrapSelects();
		} else {
			this.classList.add('selected');
		}
		if(optByVal) {
			optByVal.selected = 'selected';
		}
		self.setSelectedOption(select);
		self.updateSelectedOptsDisplay(select);
	}

	onDeselectItem(args) {
		arguments[(arguments.length - 1)].stopPropagation();
		const self = args[0];
		const wrapSelect = args[1];
		const val = this.getAttribute('data-value');
		const optByVal = wrapSelect.querySelector('[value="' + val + '"]');
		const UIoptByVal = wrapSelect.querySelector('.option-class[data-value="' + val + '"]');
		const select = wrapSelect.querySelector('select');
		if(optByVal) {
			optByVal.removeAttribute('selected');
		}
		if(UIoptByVal) {
			UIoptByVal.classList.remove('selected');
		}
		self.setSelectedOption(select);
		self.updateSelectedOptsDisplay(select);
	}
}