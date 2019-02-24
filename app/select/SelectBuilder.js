export default class SelectBuilder {

	/**
	 * The constructor
	 * @param { Object } userConfigurations - The user configurations
	 * @param { Object } Selector - An instance of the Selector
	 * @param { Object } Creator - An instance of the Creator
	 * @param { Object } Check - An instance of the Check
	 * @param { Object } Utils - An instance of the Utils
	 */
	constructor(userConfigurations, Selector, Creator, Check, Utils) {
		this.$ = Selector;
		this.creator = Creator;
		this.check = Check;
		this.utils = Utils;
		this.addEventListenerToElement(document.getElementsByTagName('body')[0], 'click', this.onSelectFocusOut, [this]);
		this._setConfiguration(userConfigurations);
	}

	/**
	 * Build UI selects from default selects
	 */
	build() {
		const selects = this.$.getElements(this.config.element);
		const wrapSelects = [];
		this.callCallbackFunction(this.config.callbacks.beforeBuildSelect, this, selects);
		if (selects) {
			selects.forEach((select)  => {
				this.callCallbackFunction(this.config.callbacks.beforeEachBuildSelect, this, select);
				this.creator.createAttribute(select, 'tabindex', -1);
				const wrapSelect = this.createWrapSelect(select);
				const createdUISelect = this.createUISelect(select);
				this.insertCreatedUISelect(createdUISelect, wrapSelect);
				this.setSelectedOption(select);
				this.createSelectedOptsDisplay(select);
				this.resolveEventsToUiSelect(wrapSelect);
				wrapSelects.push(wrapSelect);
				this.callCallbackFunction(this.config.callbacks.afterEachBuildSelect, this, wrapSelect);
			});
		}
		this.callCallbackFunction(this.config.callbacks.afterBuildSelect, this, wrapSelects);
	}

	/**
	 * Sets configurations by merging user configurations with default configurations
	 * @param {Object} userConfigurations - The user configurations
	 */
	_setConfiguration(userConfigurations) {
		this.config = {
			element: 'select',
			selectByArrows: true,
			selectByDigit: true,
			autoHeight: true,
			autoPositioning: true,
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
			},
			callbacks: {
				beforeBuildSelect: null,
				afterBuildSelect: null,
				beforeEachBuildSelect: null,
				afterEachBuildSelect: null,
				beforeAddNewOption: null,
				afterAddNewOption: null,
				beforeOpenSelect: null,
				afterOpenSelect: null,
				beforeCloseSelects: null,
				afterCloseSelects: null,
				beforeSelectItem: null,
				afterSelectItem: null,
				beforeDeselectItem: null,
				afterDeselectItem: null
			}
		};
		this.config = this.utils.mergeObjectsDeeply({}, this.config, userConfigurations);
	}

	/**
	 * Add event listeners to ui selects and your ui options
	 * @param { HTMLElement || HTMLFormElement } wrapSelect - The ui select container
	 */
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

	/**
	 * Add new option to normal select
	 * @param { String } value - The value of the option
	 * @param { String } text - The text of the option
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the option
	 */
	addNewOption(value, text, select) {
		if (select && this.check.isHTMLElement(select)) {
			const optObj = {
				name: 'OPTION',
				class: [],
				attributes: [
					{name: 'value', value: value}
				],
				text: text
			};
			const opt = this.creator.createASingleElement(optObj);
			this.callCallbackFunction(this.config.callbacks.beforeAddNewOption, this, opt);
			if (opt) {
				select.append(opt);
				this.addNewUiOption(select, opt);
			}
		}
	}

	/**
	 * Add new option to ui select and add yor corresponding event
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the option
	 * @param { HTMLElement || HTMLFormElement } newOpt - The new opt that was created
	 */
	addNewUiOption(select, newOpt) {
		if (select) {
			const wrapSelect = select.parentElement;
			if (wrapSelect) {
				const uiOptContainer = wrapSelect.querySelector('.' + this.config.selectors.containerOptions);
				if (uiOptContainer) {
					const uiOpt = this.creator.createASingleElement(this.createOptionObj(newOpt));
					if (uiOpt) {
						uiOptContainer.append(uiOpt);
						this.addEventListenerToElement(uiOpt, 'click', this.onSelectItem, [this, wrapSelect]);
						this.callCallbackFunction(this.config.callbacks.afterAddNewOption, this, uiOpt);
					}
				}
			}
		}
	}

	/**
	 * Create the ui select container and insert on page
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the option
	 * @returns { HTMLElement } the ui select container that was created
	 */
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

	/**
	 * Create the ui select
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the option
	 * @returns { HTMLElement } the ui select that was created
	 */
	createUISelect(select) {
		let childObj;
		const divParent = {
			name: 'DIV',
			class: [this.config.selectors.containerOptions]
		};
		const optsArr = this.createOptionsAndGroupsObj(select);
		return this.creator.createElements(optsArr, divParent);
	}

	/**
	 * Create an array of object that will be used to create the ui options
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the options
	 * @returns { Array } An array with the configurations to create ui options
	 */
	createOptionsAndGroupsObj(select) {
		const optsArr = [];
		const children = select.children;
		if (children.length) {
			const total = children.length;
			let i, child;
			for (i = 0; i < total; i++) {
				child = children[i];
				if (child.tagName === 'OPTION') {
					optsArr.push(this.createOptionObj(child));
				} else if (child.tagName === 'OPTGROUP') {
					optsArr.push(this.createGroupObj(child));
				}
			}
		}
		return optsArr;
	}

	/**
	 * Create an object that will be used to create an ui option
	 * @param { HTMLElement || HTMLFormElement } optionElement - The option element
	 * @returns { Object } An object that will be used to creat an ui option
	 */
	createOptionObj(optionElement) {
		return {
			name: 'DIV',
			class: [this.config.selectors.uiItemSelect, this.config.selectors.uiOption],
			text: optionElement.innerHTML,
			attributes: [
				{name: 'data-value', value: optionElement.value}
			]
		};
	}

	/**
	 * Create an object that will be used to create an ui optgroup
	 * @param { HTMLElement || HTMLFormElement } groupElement - The group element
	 * @returns { Object } An object that will be used to creat an ui optgroup
	 */
	createGroupObj(groupElement) {
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
			const grupOptsArr = this.createOptionsAndGroupsObj(groupElement);
			if (grupOptsArr.length) {
				grupOptsArr.forEach((optObj) => {
					group.children.elements.push(optObj);
				});
			}
		}
		return group;
	}

	/**
	 * Insert the created ui select into ui container select
	 * @param { HTMLElement || HTMLFormElement } createdUISelect - The created ui select
	 * @param { HTMLElement || HTMLFormElement } wrapSelect - The ui select container
	 * @returns { HTMLElement } the ui select that was created
	 */
	insertCreatedUISelect(createdUISelect, wrapSelect) {
		if (createdUISelect && wrapSelect) {
			wrapSelect.appendChild(createdUISelect);
		}
	}

	/**
	 * Set the selected option (also ui option)
	 * @param { HTMLElement || HTMLFormElement } select - The select element
	 */
	setSelectedOption(select) {
		const options = this.$.getElements('option', select);
		const divOptions = this.$.getElements('.' + this.config.selectors.uiOption, select.parentElement);
		if(options && divOptions) {
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
	}

	/**
	 * Get the selected ui option
	 * @param { HTMLElement || HTMLFormElement } select - The select element
	 * @returns { HTMLElement || null } The selected ui option if exists or null
	 */
	getSelectedOptions(select) {
		const divOptions = this.$.getElements('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected, select.parentElement);
		if (divOptions) {
			return divOptions;
		}
		return null;
	}

	/**
	 * Create selected options display (What will be shown as selected) - And add events
	 * @param { HTMLElement || HTMLFormElement } select - The select element
	 * @returns { HTMLElement || null } The display of selected ui options if exists or null
	 */
	createSelectedOptsDisplay(select) {
		const wrapSelect = select.parentNode;
		const selectedOptions = this.getSelectedOptions(select);
		if (wrapSelect && selectedOptions) {
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
			this.resolveEventsToUiSelectedDisplay(wrapSelect);
			return displayedOpts;
		}
		return null;
	}

	/**
	 * Create selected options object that will be used to create the display
	 * @param { HTMLElement } uiSelectedOption - The ui selected option
	 * @returns { Object } The object that will be used to create the display
	 */
	createSelectedOptionsObj(uiSelectedOption) {
		return {
			name: 'DIV',
			class: [this.config.selectors.selectedDisplayed],
			text: uiSelectedOption.innerHTML,
			attributes: [
				{name: 'data-value', value: uiSelectedOption.getAttribute('data-value')}
			]
		};
	}

	/**
	 * Update the ui selected options
	 * @param { HTMLElement } select - The select element
	 * @returns { HTMLElement || null } The new ui options selected if exist or null
	 */
	updateSelectedOptsDisplay(select) {
		const wrapSelect = select.parentNode;
		if (wrapSelect) {
			const existedDisplays = wrapSelect.querySelector('.' + this.config.selectors.containerSelected);
			if (existedDisplays) {
				existedDisplays.innerHTML = '';
				const selectedOptions = this.getSelectedOptions(select);
				const arr = [];
				if (selectedOptions && selectedOptions.length) {
					selectedOptions.forEach((opt) => {
						arr.push(this.createSelectedOptionsObj(opt));
					});
				}
				const displayedOpts =  this.creator.createElements(arr, existedDisplays);
				this.resolveEventsToUiSelectedDisplay(wrapSelect);
				return displayedOpts;
			}
		}
		return null;
	}

	/**
	 * Add events to ui selected options on display
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 */
	resolveEventsToUiSelectedDisplay(wrapSelect) {
		if (wrapSelect.classList.contains('multiple')) {
			const displayedOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.selectedDisplayed);
			if (displayedOpts.length) {
				displayedOpts.forEach((opt) => {
					this.addEventListenerToElement(opt, 'click', this.onDeselectItem, [this, wrapSelect]);
				});
			}
		}
	}

	/**
	 * Add given event to given element
	 * @param { HTMLElement } element - The element that will receive the event
	 * @param { String } eventName - The event's name
	 * @param { Function } callback - The callback function that will be called by event
	 * @param { Array } arrayArgs - Params to be passed to callback function
	 */
	addEventListenerToElement(element, eventName, callback, arrayArgs) {
		if (element) {
			element.addEventListener(eventName, callback.bind(element, arrayArgs));
		}
	}

	/**
	 * Close the ui select
	 */
	closeWrapSelects() {
		const wrapSelects =  document.querySelectorAll('.' + this.config.selectors.wrapSelect + '.' + this.config.selectors.opened);
		if (wrapSelects.length) {
			this.callCallbackFunction(this.config.callbacks.beforeCloseSelects, this, wrapSelects);
			wrapSelects.forEach((wrapSelect) => {
				wrapSelect.classList.remove(this.config.selectors.opened);
				if (this.config.autoHeight) {
					wrapSelect.querySelector('.' + this.config.selectors.containerOptions).style.height = 0;
				}
			});
			this.callCallbackFunction(this.config.callbacks.afterCloseSelects, this, wrapSelects);
		}
	}

	/**
	 * Open the ui select
	 * @param { HTMLElement } wrapSelect - The ui select container
	 */
	openWrapSelect(wrapSelect) {
		this.callCallbackFunction(this.config.callbacks.beforeOpenSelect, this, wrapSelect);
		wrapSelect.classList.add(this.config.selectors.opened);
		const items = wrapSelect.querySelectorAll('.' + this.config.selectors.uiItemSelect);
		let heightAll = 0;
		if (items.length) {
			items.forEach((item) => {
				heightAll = heightAll + item.clientHeight;
			});
		}
		if (this.config.autoHeight) {
			this.setHeightOptionContainer(wrapSelect, heightAll);
		}
		if (this.config.autoPositioning) {
			this.setContainerOptsPosition(wrapSelect);
		}
		this.callCallbackFunction(this.config.callbacks.afterOpenSelect, this, wrapSelect);
	}

	/**
	 * Reset the selects that is not a multiple select
	 * @param { HTMLElement } select - The select element
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 */
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

	/**
	 * Change selected option by arrow key navigation
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 * @param { String } direction - ['top', 'bottom'] To indicates what key was pressed
	 * @param { Event } event - The event object that was fired
	 */
	changeSelectedOptionByArrowKey(wrapSelect, direction, event) {
		let selected = wrapSelect.querySelectorAll('.' + this.config.selectors.selected);
		const uiOpts = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption);
		const opts = wrapSelect.querySelectorAll('option');
		let oldSelected;
		if (selected && uiOpts && opts) {
			if (wrapSelect.classList.contains(this.config.selectors.multiple)) {
				if (direction === 'top') {
					oldSelected = selected[0];
				} else if (direction === 'bottom') {
					oldSelected = selected[(selected.length -1)];
				}
				if (!event.shiftKey) {
					uiOpts.forEach((opt, ind) => {
						opts[ind].removeAttribute('selected');
						opt.classList.remove(this.config.selectors.selected);
					});
				}
			} else {
				oldSelected = selected[0];
			}
			const index = Array.prototype.indexOf.call(uiOpts, oldSelected);
			const total = uiOpts.length;
			let newIndex;
			if (direction === 'top') {
				newIndex = (index > 0) ? (index - 1) : (total - 1);
			} else if (direction === 'bottom') {
				newIndex = (index < (total - 1)) ? (index + 1) : 0;
			}
			const newSelected = uiOpts[newIndex];
			if (newSelected) {
				newSelected.click();
			}
		}
	}

	/**
	 * Change selected option by digit key navigation
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 * @param { Event } event - The event object that was fired
	 */
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

	/**
	 * The callback to click ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onToggleSelectClick(args) {
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		// this is the element
		if (this.classList.contains(args[0].config.selectors.opened)) {
			args[0].closeWrapSelects();
		} else {
			args[0].closeWrapSelects();
			args[0].openWrapSelect(this);
		}
	}

	/**
	 * The callback to keyup ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onKeyupSelect(args) {
		const self = args[0]; // args[0] is the context
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

	/**
	 * The callback to focus in ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onFocusInSelect(args) {
		args[0].utils.disableScroll();
	}

	/**
	 * The callback to foucs out ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onFocusOutSelect(args) {
		args[0].utils.enableScroll();
	}

	/**
	 * The callback to body click event (except the ui select element itself) 
	 * @param { Array } args - Params received by callback
	 */
	onSelectFocusOut(args) {
		args[0].closeWrapSelects();
	}

	/**
	 * The callback to ui option click event
	 * @param { Array } args - Params received by callback
	 */
	onSelectItem(args) {
		const self = args[0];
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		const wrapSelect = args[1];
		self.callCallbackFunction(self.config.callbacks.beforeSelectItem, self, wrapSelect);
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
		self.callCallbackFunction(self.config.callbacks.afterSelectItem, self, wrapSelect);
	}

	/**
	 * The callback to ui option selected on display click event
	 * @param { Array } args - Params received by callback
	 */
	onDeselectItem(args) {
		const self = args[0];
		const event = arguments[(arguments.length - 1)];
		event.stopPropagation();
		const wrapSelect = args[1];
		self.callCallbackFunction(self.config.callbacks.beforeDeselectItem, self, wrapSelect);
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
		self.callCallbackFunction(self.config.callbacks.afterDeselectItem, self, wrapSelect);
	}

	/**
	 * Get height to be used in ui option container after opened
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 * @param { Integer } heightAllOpts - The height of summing of the all ui options
	 */
	getHeigthOptionContainer(wrapSelect, heightAllOpts) {
		const winH = this.utils.getWindowHeight();
		const halfWinH = (winH / 2) - (wrapSelect.clientHeight / 2);
		return (heightAllOpts > halfWinH) ? halfWinH : heightAllOpts;
	}

	/**
	 * Set height in ui option container after opened
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 * @param { Integer } heightAllOpts - The height of summing of the all ui options
	 */
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

	/**
	 * Set bottom or top position to ui container option after opened
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 */
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

	/**
	 * Calls de callback functions
	 * @param { Function } callback - The callback method
	 * @param { Object } ref - The new reference
	 * @param { HTMLElement || HTMLFormElement || HTMLInputElement } element - The container or field that will be validated
	 * @param { String || Number || Array } otherParams - The params that can be used by callback
	 */
	callCallbackFunction(callback, ref, element, otherParams) {
		if (this.check.isFunction(callback)) {
			callback.call(ref, element, otherParams);
		}
	}

	/**
	 * Select item programmatically
	 * @param { Integer } itemIndex - The index of the option that will be selected
	 * @param { HTMLElement } select - the select element
	 */
	selectItem(itemIndex, select) {
		if (this.check.isInteger(itemIndex) && select && this.check.isHTMLElement(select)) {
			const wrapSelect = select.parentElement;
			if (wrapSelect) {
				const items = wrapSelect.querySelectorAll('.' + this.config.selectors.uiOption);
				if (items) {
					const total = items.length;
					let i;
					for(i = 0; i < total; i++) {
						if (i === itemIndex) {
							items[i].click();
							break;
						}
					}
				}
			}
		}
	}
}