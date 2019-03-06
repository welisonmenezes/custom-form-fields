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
				this.constroy(inputsFile[i]);
			}
		}	
	}

	/**
	 * Constroy ui input file from given default input file
	 * @param { HTMLElement } inputFile - The input file element
	 */
	constroy(inputFile) {
		const parent = inputFile.parentElement;
		if (parent && parent.classList.contains('.' + this.config.selectors.wrapInputFile)) {
			return null;
		}
		this.creator.createAttribute(inputFile, 'tabindex', -1);
		const wrapInputFile = this.createWrapInput(inputFile);
		this.createUiInputFile(wrapInputFile);
		this.utils.updateDisabledInput(inputFile, wrapInputFile, this.config.selectors.disabled);
		this.resolveEventsToUiSelectButton(wrapInputFile);
		this.selectFilesBehavior(inputFile, wrapInputFile);
	}

	/**
	 * Destroy ui input file from given default input file
	 * @param { HTMLElement } inputFile - The input file element
	 */
	destroy(inputFile) {
		if (inputFile && this.check.isHTMLElement(inputFile)) {
			const wrapInputFile = inputFile.parentElement;
			if (wrapInputFile && wrapInputFile.classList.contains(this.config.selectors.wrapInputFile)) {
				const target = wrapInputFile.parentElement;
				if (target) {
					target.appendChild(inputFile);
					target.removeChild(wrapInputFile);
				}
			}
		}
	}

	/**
	 * Create the ui input container and insert on page
	 * @param { HTMLElement } inputFile - The input that will be transformed
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
	 * @param { HTMLElement } wrapCheckRadio - The ui checkboxRadio container
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
	 * The method called when the input file fires a change event
	 * @param { HTMLElement } inputFile - The input file (in this case the event's target)
	 * @param { HTMLElement } wrapInputFile - The ui container of input file
	 */
	selectFilesBehavior(inputFile, wrapInputFile) {
		if (inputFile.files) {
			const label = this.$.getElement('.' + this.config.selectors.uiInputLabel, wrapInputFile);
			if (label) {
				if (inputFile.files.length < 1) {
					label.innerHTML = this.config.defaultInputText;
				} else if (inputFile.files.length === 1) {
					label.innerHTML = this.utils.limitString(inputFile.files[0].name, this.config.maxLengthFileName);
				} else {
					label.innerHTML = this.config.multipleSelecteText.replace('[x]', inputFile.files.length);
				}
			}
		} else {
			label.innerHTML = this.config.selectors.defaultInputText;
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
			self.selectFilesBehavior(this, wrapInputFile);
		}
	}

	/**
	 * Clear input file with selected file
	 * @param { HTMLElement } inputFile - The input file element
	 */
	clear(inputFile) {
		if (inputFile && this.check.isHTMLElement(inputFile)) {
			const wrapInputFile = inputFile.parentElement;
			if (wrapInputFile) {
				inputFile.value = '';
				this.selectFilesBehavior(inputFile, wrapInputFile);
			}
		}
	}
}