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
				console.log(inputFile);
				this.creator.createAttribute(inputFile, 'tabindex', -1);
				const wrapInputFile = this.createWrapInput(inputFile);
				this.createUiInputFile(wrapInputFile);
				this.updateDisabledInput(inputFile, wrapInputFile);
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
		const uiInputFile = this.creator.createElements(uiInputObj, wrapInputFile);
		return uiInputFile;
	}

	/**
	 * Update the disabled/enable input in ui container
	 * @param { HTMLElement } inputFile - The input file element
	 * @param { HTMLElement } wrapInputFile - The ui container of the first param
	 */
	updateDisabledInput(inputFile, wrapInputFile) {
		if (this.check.isElementDisabled(inputFile)) {
			wrapInputFile.classList.add(this.config.selectors.disabled);
			this.creator.createAttribute(wrapInputFile, 'aria-disabled', true);
			this.creator.removeAttribute(wrapInputFile, 'tabindex');
		} else {
			wrapInputFile.classList.remove(this.config.selectors.disabled);
			this.creator.createAttribute(wrapInputFile, 'tabindex', 0);
			this.creator.removeAttribute(wrapInputFile, 'aria-disabled');
		}
	}
}