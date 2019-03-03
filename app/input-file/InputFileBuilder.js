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
		if (inputsFile) {
			inputsFile.forEach((inputFile, index) => {
				console.log(inputFile);
				this.creator.createAttribute(inputFile, 'tabindex', -1);
				const wrapInputFile = this.createWrapInput(inputFile);
			});
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
}