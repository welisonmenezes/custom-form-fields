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
			element: 'input[type="file"]',
			selectors: {},
			callbacks: {}
		};
		this.config = this.utils.mergeObjectsDeeply({}, this.config, userConfigurations);
	}

	/**
	 * Build UI inputsFile from default inputs type file
	 */
	build() {
		const inputsFile = this.$.getElements(this.config.element);
		if (inputsFile) {
			inputsFile.forEach((inputFile, index) => {
				console.log(inputFile);
			});
		}	
	}
}