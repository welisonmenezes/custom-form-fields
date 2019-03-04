export default class InputFileBuilder {

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
	 * Build UI inputsFile from default inputs type file
	 */
	build() {
		const inputsFile = this.$.getElements(this.config.element);
		if (inputsFile && inputsFile.length) {
			const total = inputsFile.length;
			let i;
			for (i = 0; i < total; i++) {
				const inputFile = inputsFile[i];
				this.creator.createAttribute(inputFile, 'tabindex', -1);
				const wrapInputFile = this.createWrapInput(inputFile);
				this.createUiInputFile(wrapInputFile);
				this.utils.updateDisabledInput(inputFile, wrapInputFile, this.config.selectors.disabled);
				this.resolveEventsToUiSelectButton(wrapInputFile);
			}
		}	
	}

	/**
	 * Create the ui input container and insert on page
	 * @param { HTMLElement || HTMLFormElement } inputFile - The input that will be transformed
	 * @returns { HTMLElement } the ui input container that was created
	 */
	createWrapInput(inputFile) {
		const wrapArr = [
			{
				name: 'DIV',
				class: [this.config.selectors.wrapInputFile]
			}
		];
		const parent = inputFile.parentNode;
		if (parent) {
			const parentInputFile = this.creator.createElements(wrapArr, parent);
			const wrapInputFile = this.$.getElement('.' + this.config.selectors.wrapInputFile, parent);
			if (wrapInputFile) {
				parent.insertAdjacentElement('beforeend', wrapInputFile);
				wrapInputFile.appendChild(inputFile);
			}
			return wrapInputFile;
		}
		return null;
	}

	/**
	 * Create the ui input
	 * @param { HTMLElement } wrapInputFile - The wrap of ui input
	 * @returns { HTMLElement } the ui input that was created
	 */
	createUiInputFile(wrapInputFile) {
		const uiInputObj = [{
			name: 'DIV',
			class: [this.config.selectors.uiInputFile],
			children: {
				elements: [
					{
					name: 'DIV',
						class: [this.config.selectors.uiInputDisplay],
						children: {
							elements: [{
								name: 'SPAN',
								class: [this.config.selectors.uiInputLabel],
								text: this.config.defaultInputText
							}]
						}
					},
					{
						name: 'SPAN',
						class: [this.config.selectors.uiSelectButton],
						text: this.config.defaultButtonText
					}
				]
			}
		}];
		return this.creator.createElements(uiInputObj, wrapInputFile);
	}

	/**
	 * Add event listeners to ui checkboxRadio
	 * @param { HTMLElement || HTMLFormElement } wrapCheckRadio - The ui checkboxRadio container
	 */
	resolveEventsToUiSelectButton(wrapInputFile) {
		const selectButton = this.$.getElement('.' + this.config.selectors.uiSelectButton, wrapInputFile);
		const input = this.$.getElement('input', wrapInputFile);
		if (selectButton) {
			this.utils.addEventListenerToElement(selectButton, 'click', this.onSelectButtonClick, [this, wrapInputFile]);
			this.utils.addEventListenerToElement(wrapInputFile, 'keyup', this.onKeyEnterPress, [this, selectButton]);
		}
		if (input) {
			this.utils.addEventListenerToElement(input, 'change', this.onChangeInput, [this, wrapInputFile]);
		}
	}

	/**
	 * The callback to select button click
	 * @param { Array } args - Params received by callback
	 */
	onSelectButtonClick(args) {
		const event = arguments[(arguments.length - 1)];
		const self = args[0];
		const wrapInputFile = args[1];
		event.stopPropagation();
		if (!wrapInputFile.classList.contains(self.config.selectors.disabled)) {
			const input = self.$.getElement('input', wrapInputFile);
			if (input) {
				input.click();
			}
		}
	}

	/**
	 * The callback to ui input file key enter press
	 * @param { Array } args - Params received by callback
	 */
	onKeyEnterPress(args) {
		const event = arguments[(arguments.length - 1)];
		const self = args[0];
		const selectButton = args[1];
		event.stopPropagation();
		if (!this.classList.contains(self.config.selectors.disabled)) {
			if (event.keyCode === 13) {
				const evt = self.utils.createTempEvent();
				selectButton.dispatchEvent(evt);
			}
		}
	}

	/**
	 * The callback to input change
	 * @param { Array } args - Params received by callback
	 */
	onChangeInput(args) {
		const event = arguments[(arguments.length - 1)];
		const self = args[0];
		const wrapInputFile = args[1];
		event.stopPropagation();
		if (!wrapInputFile.classList.contains(self.config.selectors.disabled)) {
			console.log(this);
			// todo - select file behaviors
		}
	}
}