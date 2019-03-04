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
		this.config = userConfigurations;
		this.$ = Selector;
		this.creator = Creator;
		this.check = Check;
		this.utils = Utils;
		this.utils.addEventListenerToElement(document.getElementsByTagName('body')[0], 'click', this.onSelectFocusOut, [this]);
	}

	/**
	 * Build UI selects from default selects
	 */
	build() {
		const selects = this.$.getElements(this.config.element);
		const wrapSelects = [];
		this.utils.callCallbackFunction(this.config.callbacks.beforeBuildSelects, this, selects);
		if (selects) {
			const total = selects.length;
			let i;
			for (i = 0; i < total; i++) {
				wrapSelects.push(this.constroy(selects[i]));
			}
		}
		this.utils.callCallbackFunction(this.config.callbacks.afterBuildSelects, this, wrapSelects);
	}

	/**
	 * Constroy ui select from default select
	 * @param { HTMLElement } select - The select that ui be transformed
	 * @return { HTMLElement || null } The new UI select or null
	 */
	constroy(select) {
		const parent = select.parentElement;
		if(parent && parent.classList.contains(this.config.selectors.wrapSelect)) {
			return null;
		}
		this.utils.callCallbackFunction(this.config.callbacks.beforeConstroySelect, this, select);
		this.creator.createAttribute(select, 'tabindex', -1);
		const wrapSelect = this.createWrapSelect(select);
		const createdUISelect = this.createUISelect(select);
		this.insertCreatedUISelect(createdUISelect, wrapSelect);
		this.setSelectedOption(select);
		this.createSelectedOptsDisplay(select);
		this.resolveEventsToUiSelect(wrapSelect);
		this.utils.callCallbackFunction(this.config.callbacks.afterConstroySelect, this, wrapSelect);
		return wrapSelect;
	}

	/**
	 * Destroy the ui select 
	 * @param { HTMLElement } select - The select element
	 */
	destroy(select) {
		if (select && this.check.isHTMLElement(select)) {
			const wrapSelect = select.parentElement;
			if (wrapSelect && wrapSelect.classList.contains(this.config.selectors.wrapSelect)) {
				const target = wrapSelect.parentElement;
				if (target) {
					this.utils.callCallbackFunction(this.config.callbacks.beforeDestroySelect, this, wrapSelect);
					target.appendChild(select);
					target.removeChild(wrapSelect);
					this.utils.callCallbackFunction(this.config.callbacks.afterDestroySelect, this, select);
				}
			}
		}
	}

	/**
	 * Add event listeners to ui selects and your ui options
	 * @param { HTMLElement || HTMLFormElement } wrapSelect - The ui select container
	 */
	resolveEventsToUiSelect(wrapSelect) {
		this.utils.addEventListenerToElement(wrapSelect, 'click', this.onToggleSelectClick, [this]);
		this.utils.addEventListenerToElement(wrapSelect, 'focusin', this.onFocusInSelect, [this]);
		this.utils.addEventListenerToElement(wrapSelect, 'focusout', this.onFocusOutSelect, [this]);
		if (this.config.selectByArrows || this.config.selectByDigit) {
			this.utils.addEventListenerToElement(wrapSelect, 'keyup', this.onKeyupSelect, [this]);
		}
		const options = this.$.getElements('.' + this.config.selectors.uiOption, wrapSelect);
		if (options && options.length) {
			const total = options.length;
			let i;
			for (i = 0; i < total; i++) {
				this.utils.addEventListenerToElement(options[i], 'click', this.onSelectItem, [this, wrapSelect]);
			}
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
			if (!this.check.isElementDisabled(select)) {
				const optObj = {
					name: 'OPTION',
					class: [],
					attributes: [
						{name: 'value', value: value}
					],
					text: text
				};
				const opt = this.creator.createASingleElement(optObj);
				this.utils.callCallbackFunction(this.config.callbacks.beforeAddNewOption, this, opt);
				if (opt) {
					select.appendChild(opt);
					this.addNewUiOption(select, opt);
				}
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
				const uiOptContainer = this.$.getElement('.' + this.config.selectors.containerOptions, wrapSelect);
				if (uiOptContainer) {
					const uiOpt = this.creator.createASingleElement(this.createOptionObj(newOpt));
					if (uiOpt) {
						uiOptContainer.appendChild(uiOpt);
						this.utils.addEventListenerToElement(uiOpt, 'click', this.onSelectItem, [this, wrapSelect]);
						this.utils.callCallbackFunction(this.config.callbacks.afterAddNewOption, this, uiOpt);
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
		const selectType = (select.hasAttribute('multiple')) ? this.config.selectors.multiple : this.config.selectors.single;
		const wrapArr = [
			{
				name: 'DIV',
				class: [this.config.selectors.wrapSelect, selectType]
			}
		];
		if (this.check.isElementDisabled(select)) {
			wrapArr[0].class.push(this.config.selectors.disabled);
		}
		const parentSelect = this.creator.createElements(wrapArr, select.parentNode);
		const wrapSelect = this.$.getElement('.' + this.config.selectors.wrapSelect, parentSelect);
		if (wrapSelect) {
			wrapSelect.insertAdjacentElement('afterbegin', select);
		}
		
		if (this.check.isElementDisabled(select)) {
			this.creator.createAttribute(wrapSelect, 'aria-disabled', true);
		} else {
			this.creator.createAttribute(wrapSelect, 'tabindex', 0);
		}
		return wrapSelect;
	}

	/**
	 * Create the ui select
	 * @param { HTMLElement || HTMLFormElement } select - The select that will receive the option
	 * @returns { HTMLElement } the ui select that was created
	 */
	createUISelect(select) {
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
		const optClasses = [this.config.selectors.uiItemSelect, this.config.selectors.uiOption];
		if (this.check.isElementDisabled(optionElement)) {
			optClasses.push(this.config.selectors.uiOptDisabled);
		}
		return {
			name: 'DIV',
			class: optClasses,
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
			if (grupOptsArr && grupOptsArr.length) {
				const total = grupOptsArr.length;
				let i;
				for (i = 0; i < total; i++) {
					group.children.elements.push(grupOptsArr[i]);
				}
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
			const total = options.length;
			let i;
			for (i = 0; i < total; i++) {
				const opt = options[i];
				if ( (opt.hasAttribute('selected') && opt.getAttribute('selected') !== 'false' && isMultiple) ) {
					divOptions[i].classList.add(this.config.selectors.selected);
				} else if (!isMultiple && (opt.value === select.value)) {
					divOptions[i].classList.add(this.config.selectors.selected);
					break;
				}
			}
			if (isMultiple) {
				const SelectedDivOptions = this.$.getElements('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected, select.parentElement);
				if (!SelectedDivOptions) {
					this.creator.createAttribute(options[0], 'selected', 'true');
					divOptions[0].classList.add(this.config.selectors.selected);
				} else {
					if (SelectedDivOptions.length > 1) {
						this.creator.removeAttribute(options[0], 'selected');
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
		const wrapSelect = select.parentElement;
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
				const total = selectedOptions.length;
				let i;
				for (i = 0; i < total; i++) {
					displayContainer.children.elements.push(this.createSelectedOptionsObj(selectedOptions[i]));
				}
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
			const existedDisplays = this.$.getElement('.' + this.config.selectors.containerSelected, wrapSelect);
			if (existedDisplays) {
				existedDisplays.innerHTML = '';
				const selectedOptions = this.getSelectedOptions(select);
				const arr = [];
				if (selectedOptions && selectedOptions.length) {
					const total = selectedOptions.length;
					let i;
					for (i = 0; i < total; i++) {
						arr.push(this.createSelectedOptionsObj(selectedOptions[i]));
					}
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
		if (wrapSelect.classList.contains(this.config.selectors.multiple)) {
			const displayedOpts = this.$.getElements('.' + this.config.selectors.selectedDisplayed, wrapSelect);
			if (displayedOpts && displayedOpts.length) {
				const total = displayedOpts.length;
				let i;
				for (i = 0; i < total; i++) {
					this.utils.addEventListenerToElement(displayedOpts[i], 'click', this.onDeselectItem, [this, wrapSelect]);
				}
			}
		}
	}

	/**
	 * Close the ui select
	 */
	closeWrapSelects() {
		const wrapSelects =  this.$.getElements('.' + this.config.selectors.wrapSelect + '.' + this.config.selectors.opened);
		if (wrapSelects && wrapSelects.length) {
			this.utils.callCallbackFunction(this.config.callbacks.beforeCloseSelects, this, wrapSelects);
			const total  = wrapSelects.length;
			let i;
			for (i = 0; i < total; i++) {
				const wrapSelect = wrapSelects[i];
				wrapSelect.classList.remove(this.config.selectors.opened);
				if (this.config.autoHeight) {
					const contOpts = this.$.getElement('.' + this.config.selectors.containerOptions, wrapSelect);
					if (contOpts) {
						contOpts.style.height = 0;	
					}
				}
			}
			this.utils.callCallbackFunction(this.config.callbacks.afterCloseSelects, this, wrapSelects);
		}
	}

	/**
	 * Open the ui select
	 * @param { HTMLElement } wrapSelect - The ui select container
	 */
	openWrapSelect(wrapSelect) {
		this.utils.callCallbackFunction(this.config.callbacks.beforeOpenSelect, this, wrapSelect);
		wrapSelect.classList.add(this.config.selectors.opened);
		const items = this.$.getElements('.' + this.config.selectors.uiItemSelect, wrapSelect);
		let heightAll = 0;
		if (items && items.length) {
			const total = items.length;
			let i;
			for (i = 0; i < total; i++) {
				heightAll = heightAll + items[i].clientHeight;
			}
		}
		if (this.config.autoHeight) {
			this.setHeightOptionContainer(wrapSelect, heightAll);
		}
		if (this.config.autoPositioning) {
			this.setContainerOptsPosition(wrapSelect);
		}
		this.utils.callCallbackFunction(this.config.callbacks.afterOpenSelect, this, wrapSelect);
	}

	/**
	 * Reset the selects that is not a multiple select
	 * @param { HTMLElement } select - The select element
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 */
	resetNonMultipleSelect(select, wrapSelect) {
		const divSelectedOpts = this.$.getElements('.' + this.config.selectors.uiOption + '.' + this.config.selectors.selected, wrapSelect);
		const opts = this.$.getElements('option', select);
		if (opts && opts.length) {
			const total = opts.length;
			let i;
			for (i = 0; i < total; i++) {
				this.creator.removeAttribute(opts[i], 'selected');
			}
		}
		if (divSelectedOpts && divSelectedOpts.length) {
			const total = divSelectedOpts.length;
			let i;
			for (i = 0; i < total; i++) {
				divSelectedOpts[i].classList.remove(this.config.selectors.selected);
			}
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
		let selected = this.$.getElements('.' + this.config.selectors.selected, wrapSelect);
		const uiOpts = this.$.getElements('.' + this.config.selectors.uiOption, wrapSelect);
		const opts = this.$.getElements('option', wrapSelect);
		let oldSelected;
		if (selected && uiOpts && opts) {
			if (wrapSelect.classList.contains(this.config.selectors.multiple)) {
				if (direction === 'top') {
					oldSelected = selected[0];
				} else if (direction === 'bottom') {
					oldSelected = selected[(selected.length -1)];
				}
				if (!event.shiftKey) {
					if (uiOpts.length) {
						const total = uiOpts.length;
						let i;
						for (i = 0; i < total; i++) {
							this.creator.removeAttribute(opts[i], 'selected');
							uiOpts[i].classList.remove(this.config.selectors.selected);
						}
					}
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
			newIndex = this.setNewIndexIfOptIsDisabled(direction, newIndex, uiOpts);
			let newSelected = uiOpts[newIndex];
			if (newSelected) {
				const evt = this.utils.createTempEvent();
				newSelected.dispatchEvent(evt);
			}
		}
	}

	/**
	 * Set new index recursively if option is disabeld
	 * @param { String } direction - the ditection of the key [top, bottom]
	 * @param { Integer } oldIndex - the index of the disabled option 
	 * @param { Nodelist } uiOpts - The intire list of ui options
	 * @returns { Integer } The index of the next option 
	 * (if is disabled run again, and again, and again...)
	 */
	setNewIndexIfOptIsDisabled(direction, oldIndex, uiOpts) {
		let newIndex = oldIndex;
		let newSelected = uiOpts[newIndex];
		if (newSelected && newSelected.classList.contains(this.config.selectors.uiOptDisabled)) {
			const total = uiOpts.length;
			if (direction === 'top') {
				newIndex = (newIndex === 0) ? (total - 1) : (newIndex - 1);
			} else if (direction === 'bottom') {
				newIndex = (newIndex === (total - 1)) ? 0 : (newIndex + 1);
			}
			newIndex = this.setNewIndexIfOptIsDisabled(direction, newIndex, uiOpts);
		}
		return newIndex;
	}

	/**
	 * Change selected option by digit key navigation
	 * @param { HTMLElement } wrapSelect - The ui selects container
	 * @param { Event } event - The event object that was fired
	 */
	changeSelectedOptionByDigitKey(wrapSelect, event) {
		const digit = event.key.toLowerCase();
		if (this.check.isSingleDigit(digit)) {
			const uiOpts = this.$.getElements('.' + this.config.selectors.uiOption, wrapSelect);
			if (uiOpts) {
				const total = uiOpts.length;
				let i;
				for (i = 0; i < total; i++) {
					const firstLetter = uiOpts[i].innerHTML.charAt(0).toLowerCase();
					const value = uiOpts[i].getAttribute('data-value');
					if (digit === firstLetter && value !== '') {
						const evt = this.utils.createTempEvent();
						uiOpts[i].dispatchEvent(evt);
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
		const self = args[0];
		event.stopPropagation();
		if (!this.classList.contains(self.config.selectors.disabled)) {
			// this is the element
			if (this.classList.contains(self.config.selectors.opened)) {
				self.closeWrapSelects();
			} else {
				self.closeWrapSelects();
				self.openWrapSelect(this);
			}
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
		if (!this.classList.contains(self.config.selectors.disabled)) {
			if (event.keyCode === 38) {
				if (self.config.selectByArrows) {
					self.changeSelectedOptionByArrowKey(this, 'top', event);
				}
			} else if (event.keyCode === 40) {
				if (self.config.selectByArrows) {
					self.changeSelectedOptionByArrowKey(this, 'bottom', event);
				}
			} else {
				if (self.config.selectByDigit) {
					self.changeSelectedOptionByDigitKey(this, event);
				}
			}
		}
	}

	/**
	 * The callback to focus in ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onFocusInSelect(args) {
		const self = args[0];
		if (!this.classList.contains(self.config.selectors.disabled)) {
			self.utils.disableScroll();
		}
	}

	/**
	 * The callback to foucs out ui select event 
	 * @param { Array } args - Params received by callback
	 */
	onFocusOutSelect(args) {
		const self = args[0];
		if (!this.classList.contains(self.config.selectors.disabled)) {
			self.utils.enableScroll();
		}
	}

	/**
	 * The callback to body click event (except the ui select element itself) 
	 * @param { Array } args - Params received by callback
	 */
	onSelectFocusOut(args) {
		const self = args[0];
		if (!this.classList.contains(self.config.selectors.disabled)) {
			self.closeWrapSelects();
		}
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
		if (!wrapSelect.classList.contains(self.config.selectors.disabled) && !this.classList.contains(self.config.selectors.uiOptDisabled)) {
			self.utils.callCallbackFunction(self.config.callbacks.beforeSelectItem, self, wrapSelect);
			const val = this.getAttribute('data-value');
			const optByVal = self.$.getElement('option[value="' + val + '"]', wrapSelect);
			const select = self.$.getElement('select', wrapSelect);
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
			self.utils.callCallbackFunction(self.config.callbacks.afterSelectItem, self, wrapSelect);
		}
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
		if (!wrapSelect.classList.contains(self.config.selectors.disabled)) {
			self.utils.callCallbackFunction(self.config.callbacks.beforeDeselectItem, self, wrapSelect);
			const val = this.getAttribute('data-value');
			const optByVal = self.$.getElement('option[value="' + val + '"]', wrapSelect);
			const UIoptByVal = self.$.getElement('.' + self.config.selectors.uiOption + '[data-value="' + val + '"]', wrapSelect);
			const select = self.$.getElement('select', wrapSelect);
			if (optByVal) {
				self.creator.removeAttribute(optByVal, 'selected');
			}
			if (UIoptByVal) {
				UIoptByVal.classList.remove(self.config.selectors.selected);
			}
			self.setSelectedOption(select);
			self.updateSelectedOptsDisplay(select);
			self.utils.callCallbackFunction(self.config.callbacks.afterDeselectItem, self, wrapSelect);
		}
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
		const containerOptions = this.$.getElement('.' + this.config.selectors.containerOptions, wrapSelect);
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
		const containerOptions = this.$.getElement('.' + this.config.selectors.containerOptions, wrapSelect);
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
	 * Select item programmatically
	 * @param { Integer } itemIndex - The index of the option that will be selected
	 * @param { HTMLElement } select - the select element
	 */
	selectItem(itemIndex, select) {
		if (this.check.isInteger(itemIndex) && select && this.check.isHTMLElement(select)) {
			if (!this.check.isElementDisabled(select)) {
				const wrapSelect = select.parentElement;
				if (wrapSelect) {
					const items = this.$.getElements('.' + this.config.selectors.uiOption, wrapSelect);
					if (items) {
						const total = items.length;
						let i;
						for(i = 0; i < total; i++) {
							if (i === itemIndex) {
								const evt = this.utils.createTempEvent();
								items[i].dispatchEvent(evt);
								break;
							}
						}
					}
				}
			}
		}
	}
}