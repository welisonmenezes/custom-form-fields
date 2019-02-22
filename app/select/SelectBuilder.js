export default class SelectBuilder {

	constructor(userConfigurations, Selector, Creator, Check, Utils) {
		this.$ = Selector;
		this.creator = Creator;
		this.check = Check;
		this.utils = Utils;
		this.addEventListenerToElement(document.getElementsByTagName('body')[0], 'click', this.onSelectFocusOut, [this]);
		this._setConfiguration(userConfigurations);
		console.log(this.config);
	}

	build() {
		const selects = this.$.getElements(this.config.element);
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

	_setConfiguration(userConfigurations) {
		this.config = {
			element: 'select',
			selectByArrows: true,
			selectByDigit: true,
			selectors: {
				selected: 'selected',
				opened: 'opened',
				multiple: 'multiple',
				uiOption: 'option-class',
				uiItemSelect: 'item-class',
				uiGroupClass: 'group-class',
				uiGroupTitle: 'title-class',
				wrapSelect: 'wrap-select',
				containerOptions: 'container-class',
				containerOptsOverlowed: 'overflowed',
				containerOptsOnTop: 'moved-to-top',
				containerSelected: 'display-class',
				selectedDisplayed: 'displayed-class'
			}
		};

		this.config = this.utils.mergeObjectsDeeply({}, this.config, userConfigurations);
	}

	resolveEventsToUiSelect(wrapSelect) {
		this.addEventListenerToElement(wrapSelect, 'click', this.onToggleSelectClick, [this]);
		this.addEventListenerToElement(wrapSelect, 'focusin', this.onFocusInSelect, [this]);
		this.addEventListenerToElement(wrapSelect, 'focusout', this.onFocusOutSelect, [this]);
		if (this.config.selectByArrows || this.config.selectByDigit) {
			this.addEventListenerToElement(wrapSelect, 'keyup', this.onKeyupSelect, [this]);
		}
		const options = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption);
		if (options.length) {
			options.forEach((opt) => {
				this.addEventListenerToElement(opt, 'click', this.onSelectItem, [this, wrapSelect]);
			});
		}
	}

	createWrapSelect(select) {
		const selectType = (select.hasAttribute('multiple')) ? this.config.selectors.multiple : 'non-' + this.config.selectors.multiple;
		const wrapArr = [
			{
				name: 'DIV',
				class: [this.config.selectors.wrapSelect, selectType]
			}
		];
		const parentSelect = this.creator.createElements(wrapArr, select.parentNode);
		const wrapSelect = this.$.getElement('.' + this.config.selectors.wrapSelect, parentSelect);
		if (wrapSelect) {
			wrapSelect.insertAdjacentElement('afterbegin', select);
		}
		this.creator.createAttribute(wrapSelect, 'tabindex', 0);
		return wrapSelect;
	}

	createUISelect(select) {
		let childObj;
		const divParent = {
			name: 'DIV',
			class: [this.config.selectors.containerOptions]
		};
		const optsArr = this.createSelectObj(select);
		const createdEl = this.creator.createElements(optsArr, divParent);
		return createdEl;
	}

	insertCreatedUISelect(createdUISelect, wrapSelect) {
		if (createdUISelect && wrapSelect) {
			wrapSelect.appendChild(createdUISelect);
		}
	}

	setSelectedOption(select) {
		const options = this.$.getElements('option', select);
		const divOptions = this.$.getElements('.' + this.config.selectors.uiOption, select.parentElement);
		const isMultiple = (select.hasAttribute('multiple'));
		options.forEach((opt, i) => {
			if ( (opt.hasAttribute('selected') && opt.getAttribute('selected') !== 'false' && isMultiple) ) {
				divOptions[i].classList.add(this.config.selectors.selected);
			} else if (!isMultiple && (opt.value === select.value)) {
				divOptions[i].classList.add(this.config.selectors.selected);
			}
		});
		if (isMultiple) {
			const SelectedDivOptions = this.$.getElements('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected, select.parentElement);
			if (!SelectedDivOptions) {
				this.creator.createAttribute(options[0], 'selected', 'true');
				divOptions[0].classList.add(this.config.selectors.selected);
			} else {
				if (SelectedDivOptions.length > 1) {
					options[0].removeAttribute('selected');
					divOptions[0].classList.remove(this.config.selectors.selected);
				}
			}
		}
	}

	getSelectedOptions(select) {
		const divOptions = this.$.getElements('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected, select.parentElement);
		if (divOptions) {
			return divOptions;
		}
		return null;
	}

	createSelectedOptsDisplay(select) {
		const wrapSelect = select.parentNode;
		const selectedOptions = this.getSelectedOptions(select);
		const displayContainer = {
			name: 'DIV',
			class: [this.config.selectors.containerSelected],
			children: {
				elements: []
			}
		};
		if (selectedOptions && selectedOptions.length) {
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
		const existedDisplays = wrapSelect.querySelector('.' + this.config.selectors.containerSelected);
		existedDisplays.innerHTML = '';
		const selectedOptions = this.getSelectedOptions(select);
		const arr = [];
		if (selectedOptions && selectedOptions.length) {
			selectedOptions.forEach((opt) => {
				arr.push(this.createSelectedOptionsObj(opt));
			});
		}
		const displayedOpts =  this.creator.createElements(arr, existedDisplays);
		this.resolveEventsToUiOptions(wrapSelect);
		return displayedOpts;
	}

	resolveEventsToUiOptions(wrapSelect) {
		if (wrapSelect.classList.contains('multiple')) {
			const displayedOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.selectedDisplayed);
			if (displayedOpts.length) {
				displayedOpts.forEach((opt) => {
					this.addEventListenerToElement(opt, 'click', this.onDeselectItem, [this, wrapSelect]);
				});
			}
		}
	}

	createSelectObj(containerOptions) {
		const optsArr = [];
		const children = containerOptions.children;
		if (children.length) {
			const total = children.length;
			let i, child;
			for (i = 0; i < total; i++) {
				child = children[i];
				if (child.tagName === 'OPTION') {
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
			class: [this.config.selectors.selectedDisplayed],
			text: selectedOption.innerHTML,
			attributes: [
				{name: 'data-value', value: selectedOption.getAttribute('data-value')}
			]
		};
	}

	createOptionsObj(optionElement) {
		return {
			name: 'DIV',
			class: [this.config.selectors.uiItemSelect, this.config.selectors.uiOption],
			text: optionElement.innerHTML,
			attributes: [
				{name: 'data-value', value: optionElement.value}
			]
		};
	}

	createGroupsObj(groupElement) {
		const group = {
			name: 'DIV',
			class: [this.config.selectors.uiGroupClass],
			children: {
				elements: [
					{
						name: 'DIV',
						class: [this.config.selectors.uiItemSelect, this.config.selectors.uiGroupTitle],
						text: groupElement.getAttribute('label')
					}
				]
			}
		};
		if (groupElement.children.length) {
			const grupOptsArr = this.createSelectObj(groupElement);
			if (grupOptsArr.length) {
				grupOptsArr.forEach((optObj) => {
					group.children.elements.push(optObj);
				});
			}
		}
		return group;
	}

	addEventListenerToElement(element, eventName, callback, arrayArgs) {
		if (element) {
			element.addEventListener(eventName, callback.bind(element, arrayArgs));
		}
	}

	closeWrapSelects() {
		const wrapSelects =  document.querySelectorAll('.' + this.config.selectors.wrapSelect + '.' + this.config.selectors.opened);
		if (wrapSelects.length) {
			wrapSelects.forEach((wrapSelect) => {
				wrapSelect.classList.remove(this.config.selectors.opened);
				wrapSelect.querySelector('.' + this.config.selectors.containerOptions).style.height = 0;
			});
		}
	}

	openWrapSelect(wrapSelect) {
		wrapSelect.classList.add(this.config.selectors.opened);
		const items = wrapSelect.querySelectorAll('.' + this.config.selectors.uiItemSelect);
		let heightAll = 0;
		if (items.length) {
			items.forEach((item) => {
				heightAll = heightAll + item.clientHeight;
			});
		}
		//wrapSelect.querySelector('.' + this.config.selectors.containerOptions).style.height = heightAll + 'px';
		
		this.setHeightOptionContainer(wrapSelect, heightAll);
		this.setContainerOptsPosition(wrapSelect);
	}

	resetNonMultipleSelect(select, wrapSelect) {
		const divSelectedOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected);
		const opts = select.querySelectorAll('option');
		if (opts.length) {
			opts.forEach((opt) => {
				opt.removeAttribute('selected');
			});
		}
		if (divSelectedOpts) {
			divSelectedOpts.forEach((opt) => {
				opt.classList.remove(this.config.selectors.selected);
			});
		}
		select.value = '';
	}

	changeSelectedOptionByArrowKey(wrapSelect, direction, event) {
		let selected = wrapSelect.querySelectorAll('.' + this.config.selectors.selected);
		const uiOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption);
		const opts = wrapSelect.querySelectorAll('option');
		let newSelected;
		if (selected && uiOpts) {
			if (wrapSelect.classList.contains(this.config.selectors.multiple)) {
				if (direction === 'top') {
					newSelected = selected[(0)];
				} else if (direction === 'bottom') {
					newSelected = selected[(selected.length -1)];
				}
				if (!event.shiftKey) {
					uiOpts.forEach((opt, ind) => {
						opts[ind].removeAttribute('selected');
						opt.classList.remove(this.config.selectors.selected);
					});
				}
			} else {
				newSelected = selected[0];
			}
			const index = Array.prototype.indexOf.call(uiOpts, newSelected);
			const total = uiOpts.length;
			let newIndex;
			if (direction === 'top') {
				newIndex = (index > 0) ? (index - 1) : (total - 1);
			} else if (direction === 'bottom') {
				newIndex = (index < (total - 1)) ? (index + 1) : 0;
			}
			const newEl = uiOpts[newIndex];
			if (newEl) {
				newEl.click();
			}
		}
	}

	changeSelectedOptionByDigitKey(wrapSelect, event) {
		const digit = event.key.toLowerCase();
		if (this.check.isSingleDigit(digit)) {
			const uiOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption);
			if (uiOpts) {
				const total = uiOpts.length;
				let i;
				for (i = 0; i < total; i++) {
					const firstLetter = uiOpts[i].innerHTML.charAt(0).toLowerCase();
					const value = uiOpts[i].getAttribute('data-value');
					if (digit === firstLetter && value !== '') {
						uiOpts[i].click();
						break;
					}
				}
			}
		}
	}

	onToggleSelectClick(args) {
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		if (this.classList.contains(args[0].config.selectors.opened)) {
			args[0].closeWrapSelects();
		} else {
			args[0].closeWrapSelects();
			args[0].openWrapSelect(this);
		}
	}

	onKeyupSelect(args) {
		const self = args[0];
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		if (event.key === 'ArrowUp') {
			if (self.config.selectByArrows) {
				self.changeSelectedOptionByArrowKey(this, 'top', event);
			}
		} else if (event.key === 'ArrowDown') {
			if (self.config.selectByArrows) {
				self.changeSelectedOptionByArrowKey(this, 'bottom', event);
			}
		} else {
			if (self.config.selectByDigit) {
				self.changeSelectedOptionByDigitKey(this, event);
			}
		}
	}

	onFocusInSelect(args) {
		const self = args[0];
		self.utils.disableScroll();
	}

	onFocusOutSelect(args) {
		const self = args[0];
		self.utils.enableScroll();
	}

	onSelectFocusOut(args) {
		args[0].closeWrapSelects();
	}

	onSelectItem(args) {
		const self = args[0];
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		const wrapSelect = args[1];
		const val = this.getAttribute('data-value');
		const optByVal = wrapSelect.querySelector('[value="' + val + '"]');
		const select = wrapSelect.querySelector('select');
		if (!select.hasAttribute('multiple')) {
			self.resetNonMultipleSelect(select, wrapSelect);
			select.value = val;
			self.closeWrapSelects();
		} else {
			this.classList.add(self.config.selectors.selected);
		}
		if (optByVal) {
			self.creator.createAttribute(optByVal, 'selected', 'true');
		}
		self.setSelectedOption(select);
		self.updateSelectedOptsDisplay(select);
	}

	onDeselectItem(args) {
		const self = args[0];
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		const wrapSelect = args[1];
		const val = this.getAttribute('data-value');
		const optByVal = wrapSelect.querySelector('[value="' + val + '"]');
		const UIoptByVal = wrapSelect.querySelector('.' + self.config.selectors.uiOption + '[data-value="' + val + '"]');
		const select = wrapSelect.querySelector('select');
		if (optByVal) {
			optByVal.removeAttribute('selected');
		}
		if (UIoptByVal) {
			UIoptByVal.classList.remove(self.config.selectors.selected);
		}
		self.setSelectedOption(select);
		self.updateSelectedOptsDisplay(select);
	}

	getHeigthOptionContainer(wrapSelect, heightAllOpts) {
		const winH = this.utils.getWindowHeight();
		const halfWinH = (winH / 2) - (wrapSelect.clientHeight / 2);
		return (heightAllOpts > halfWinH) ? halfWinH : heightAllOpts;
	}

	setHeightOptionContainer(wrapSelect, heightAllOpts) {
		const newH = this.getHeigthOptionContainer(wrapSelect, heightAllOpts);
		const containerOptions = wrapSelect.querySelector('.' + this.config.selectors.containerOptions);
		if (containerOptions) {
			containerOptions.style.height = (newH + 1) + 'px';
			if (heightAllOpts > newH) {
				containerOptions.classList.add(this.config.selectors.containerOptsOverlowed);
			} else {
				containerOptions.classList.remove(this.config.selectors.containerOptsOverlowed);
			}
		}
	}

	setContainerOptsPosition(wrapSelect) {
		const containerOptions = wrapSelect.querySelector('.' + this.config.selectors.containerOptions);
		if (containerOptions) {
			const relativeTop = this.utils.getWindowPositonElement(wrapSelect);
			const winH = this.utils.getWindowHeight();
			if (relativeTop < (winH / 2)) {
				containerOptions.classList.remove(this.config.selectors.containerOptsOnTop);
			} else {
				containerOptions.classList.add(this.config.selectors.containerOptsOnTop);
			}
		}
	}
}