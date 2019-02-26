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
		this.$ = Selector;
		this.creator = Creator;
		this.check = Check;
		this.utils = Utils;
		this._setConfiguration(userConfigurations);
	}

	/**
	 * Sets configurations by merging user configurations with default configurations
	 * @param {Object} userConfigurations - The user configurations
	 */
	_setConfiguration(userConfigurations) {
		this.config = {
			element: 'input[type="checkbox"], input[type="radio"]',
			selectors: {
				checked: 'cff-checked',
				disabled: 'cff-disabled',
				wrapCheckRadio: 'cff-wrap-check-radio',
				containerCheckRadio: 'cff-container-check-radio'
			},
			callbacks: {}
		};
		this.config = this.utils.mergeObjectsDeeply({}, this.config, userConfigurations);
	}

	/**
	 * Build UI checkboxesRadios from default inputs types checkbox and radio
	 */
	build() {
		const checkboxesRadios = this.$.getElements(this.config.element);
		if (checkboxesRadios) {
			checkboxesRadios.forEach((checkRadio, index) => {
				this.creator.createAttribute(checkRadio, 'tabindex', -1);
				const wrapCheckRadio = this.createWrapCheckRadio(checkRadio);
				const uiCheckRadio = this.createUICheckRadio(wrapCheckRadio);
			});
		}
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
		if (checkRadio.hasAttribute('disabled')) {
			wrapArr[0].class.push(this.config.selectors.disabled);
		}
		const label = checkRadio.parentNode;
		if (label  && label.tagName === 'LABEL') {
			const parentCheckRadio = this.creator.createElements(wrapArr, label);
			const wrapCheckRadio = this.$.getElement('.' + this.config.selectors.wrapCheckRadio, label);
			if (wrapCheckRadio) {
				label.insertAdjacentElement('afterend', wrapCheckRadio);
				wrapCheckRadio.appendChild(label);
			}
			if (checkRadio.hasAttribute('disabled')) {
				this.creator.createAttribute(wrapCheckRadio, 'aria-disabled', true);
			} else {
				this.creator.createAttribute(wrapCheckRadio, 'tabindex', 0);
			}
			return wrapCheckRadio;
		} else {
			throw 'The container must be a label';
		}
		return null;
	}

	/**
	 * Create the ui input
	 * @param { HTMLElement || HTMLFormElement } wrapCheckRadio - The wrap of ui input
	 * @returns { HTMLElement } the ui input that was created
	 */
	createUICheckRadio(wrapCheckRadio) {
		const realLabel = wrapCheckRadio.querySelector('label');
		let textLabel = '';
		if (realLabel) {
			textLabel = realLabel.textContent;
		}
		const divParent = {
			name: 'DIV',
			class: [this.config.selectors.containerCheckRadio]
		};
		const fieldsChild = [
			{
				name: 'A',
				class: ['a-check']
			},
			{
				name: 'SPAN',
				class: ['span-check'],
				text: textLabel
			}
		];
		const uiCheckRadio = this.creator.createElements(fieldsChild, divParent);
		wrapCheckRadio.appendChild(uiCheckRadio);
		return uiCheckRadio;
	}
}