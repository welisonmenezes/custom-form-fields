export default class CheckboxRadioBuilder {

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
	}

	/**
	 * Build UI checkboxesRadios from default inputs type checkbox or radio
	 */
	build() {
		const checkboxesRadios = this.$.getElements(this.config.element);
		const wrapCheckboxesRadios = [];
		this.utils.callCallbackFunction(this.config.callbacks.beforeBuildInputs, this, checkboxesRadios);
		if (checkboxesRadios && checkboxesRadios.length) {
			const total = checkboxesRadios.length;
			let i;
			for (i = 0; i < total; i++) {
				wrapCheckboxesRadios.push(this.constroy(checkboxesRadios[i]));
			}
		}
		this.utils.callCallbackFunction(this.config.callbacks.afterBuildInputs, this, wrapCheckboxesRadios);
	}

	/**
	 * Cosntroy UI checkboxRadio from default input type checkbox or radio
	 */
	constroy(checkRadio) {
		const parent = checkRadio.parentElement.parentElement;
		if (parent && parent.classList.contains(this.config.selectors.wrapCheckRadio)) {
			return null;
		}
		this.utils.callCallbackFunction(this.config.callbacks.beforeConstroyInput, this, checkRadio);
		this.creator.createAttribute(checkRadio, 'tabindex', -1);
		const wrapCheckRadio = this.createWrapCheckRadio(checkRadio);
		this.setIfIsCheckboxOrRadio(checkRadio, wrapCheckRadio);
		const uiCheckRadio = this.createUICheckRadio(wrapCheckRadio);
		this.updateCheckedInput(checkRadio, wrapCheckRadio);
		this.utils.updateDisabledInput(checkRadio, wrapCheckRadio, this.config.selectors.disabled);
		this.resolveEventsToUiSelect(wrapCheckRadio);
		this.utils.callCallbackFunction(this.config.callbacks.afterConstroyInput, this, wrapCheckRadio);
		return wrapCheckRadio;
	}

	/**
	 * Destroy UI checkboxRadio from default input type checkbox or radio
	 */
	destroy(checkRadio) {
		if (checkRadio && this.check.isHTMLElement(checkRadio)) {
			const wrapCheckRadio = checkRadio.parentElement.parentElement;
			if (wrapCheckRadio && wrapCheckRadio.classList.contains(this.config.selectors.wrapCheckRadio)) {
				const target = wrapCheckRadio.parentElement;
				if (target) {
					this.utils.callCallbackFunction(this.config.callbacks.beforeDestroyInput, this, wrapCheckRadio);
					target.appendChild(checkRadio.parentElement);
					target.removeChild(wrapCheckRadio);
					this.utils.callCallbackFunction(this.config.callbacks.afterDestroyInput, this, checkRadio);
				}
			}
		}
	}

	/**
	 * Add event listeners to ui checkboxRadio
	 * @param { HTMLElement || HTMLFormElement } wrapCheckRadio - The ui checkboxRadio container
	 */
	resolveEventsToUiSelect(wrapCheckRadio) {
		this.utils.addEventListenerToElement(wrapCheckRadio, 'click', this.onCheckRadioClick, [this]);
	}

	/**
	 * Create the ui input container and insert on page
	 * @param { HTMLElement || HTMLFormElement } checkRadio - The input that will receive the option
	 * @returns { HTMLElement } the ui input container that was created
	 */
	createWrapCheckRadio(checkRadio) {
		const wrapArr = [
			{
				name: 'DIV',
				class: [this.config.selectors.wrapCheckRadio]
			}
		];
		const label = checkRadio.parentNode;
		if (label  && label.tagName === 'LABEL') {
			const parentCheckRadio = this.creator.createElements(wrapArr, label);
			const wrapCheckRadio = this.$.getElement('.' + this.config.selectors.wrapCheckRadio, label);
			if (wrapCheckRadio) {
				label.insertAdjacentElement('afterend', wrapCheckRadio);
				wrapCheckRadio.appendChild(label);
			}
			return wrapCheckRadio;
		} else {
			throw 'The container must be a label';
		}
		return null;
	}

	/**
	 * Set if input is type checkbox or radio
	 * @param { HTMLElement || HTMLFormElement } checkRadio - The input that will be verified
	 * @param { HTMLElement } the ui input container of the first param
	 */
	setIfIsCheckboxOrRadio(checkRadio, wrapCheckRadio) {
		if (this.check.isInputRadio(checkRadio)) {
			wrapCheckRadio.classList.add(this.config.selectors.isRadio);
		} else if (this.check.isInputCheckbox(checkRadio)) {
			wrapCheckRadio.classList.add(this.config.selectors.isCheckbox);
		}
	}

	/**
	 * Create the ui input
	 * @param { HTMLElement } wrapCheckRadio - The wrap of ui input
	 * @returns { HTMLElement } the ui input that was created
	 */
	createUICheckRadio(wrapCheckRadio) {
		const realLabel = this.$.getElement('label', wrapCheckRadio);
		let textLabel = '';
		if (realLabel) {
			textLabel = realLabel.textContent;
		}
		const divParentObj = {
			name: 'DIV',
			class: [this.config.selectors.containerCheckRadio]
		};
		const fieldsChildObj = [
			{
				name: 'A',
				class: [this.config.selectors.uiInput]
			}
		];
		this.addTextLabel(textLabel, fieldsChildObj, divParentObj);
		const uiCheckRadio = this.creator.createElements(fieldsChildObj, divParentObj);
		wrapCheckRadio.appendChild(uiCheckRadio);
		return uiCheckRadio;
	}

	/**
	 * Add text label at your corresponding pasition to ui container 
	 * @param { String } textLabel - The text that will be added
	 * @param { Object } fieldsChildObj - The object that configure the creation of ui children container
	 * @param { Object } divParentObj - The object that configure the creatin of ui container
	 */
	addTextLabel(textLabel, fieldsChildObj, divParentObj) {
		const labelObj = {
			name: 'SPAN',
			class: [this.config.selectors.uiLabel],
			text: textLabel
		};
		if (this.config.labelPosition === 'left') {
			fieldsChildObj.unshift(labelObj);
			divParentObj.class.push(this.config.selectors.labelLeft);
		} else {
			fieldsChildObj.push(labelObj);
			divParentObj.class.push(this.config.selectors.labelRight);
		}
	}

	/**
	 * Update the checked input in ui container
	 * @param { HTMLElement } checkRadio - The input element
	 * @param { HTMLElement } wrapChekRadio - The ui container of the first param
	 */
	updateCheckedInput(checkRadio, wrapCheckRadio) {
		if (this.check.isElementChecked(checkRadio)) {
			wrapCheckRadio.classList.add(this.config.selectors.checked);
		} else {
			wrapCheckRadio.classList.remove(this.config.selectors.checked);
		}
	}

	/**
	 * Toggle checked attribute of the checkbox
	 * @param { HTMLElement } checkbox - The input of type checkbox
	 */
	checkUncheckCheckbox(checkbox) {
		if (checkbox) {
			if (this.check.isElementChecked(checkbox)) {
				this.creator.removeAttribute(checkbox, 'checked');
			} else {
				this.creator.createAttribute(checkbox, 'checked', 'true');
			}
		}
	}

	/**
	 * Check the radio button (All input with same name will be unchecked)
	 * @param { HTMLElement } radio - The input of type radio
	 */
	checkUncheckRadio(radio) {
		if (radio.hasAttribute('name')) {
			const name = radio.getAttribute('name');
			const radiosSameName = this.$.getElements('input[name="' + name + '"]');
			if (radiosSameName && radiosSameName.length) {
				const total = radiosSameName.length;
				let i;
				for (i = 0; i < total; i++) {
					const radio = radiosSameName[i];
					this.creator.removeAttribute(radio, 'checked');
					this.updateCheckedInput(radio, radio.parentElement.parentElement);
				}
			}
			this.creator.createAttribute(radio, 'checked', 'true');
		}
	}

	/**
	 * The callback to ui checkRadio click event
	 * @param { Array } args - Params received by callback
	 */
	onCheckRadioClick(args) {
		const event = arguments[(arguments.length - 1)];
		const self = args[0];
		event.stopPropagation();
		if (!this.classList.contains(self.config.selectors.disabled)) {
			const inp = self.$.getElement('input', this);
			self.utils.callCallbackFunction(self.config.callbacks.beforeCheckInput, self, inp);
			if (this.classList.contains(self.config.selectors.isCheckbox)) {
				self.checkUncheckCheckbox(inp);
			} else if (this.classList.contains(self.config.selectors.isRadio)) {
				self.checkUncheckRadio(inp);
			}
			self.updateCheckedInput(inp, this);
			self.utils.callCallbackFunction(self.config.callbacks.afterCheckInput, self, inp);
		}
	}

	/**
	 * Set checked input radio or toggle input checkbox
	 * @param { HTMLElement } input - The input of type radio or checkbox
	 */
	setChecked(input) {
		if (input && (this.check.isInputRadio(input) || this.check.isInputCheckbox(input))) {
			const wrapCheckRadio = input.parentElement.parentElement;
			if (wrapCheckRadio && wrapCheckRadio.classList.contains(this.config.selectors.wrapCheckRadio)) {
				const evt = this.utils.createTempEvent();
				wrapCheckRadio.dispatchEvent(evt);
			}
		}
	}
}