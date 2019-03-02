import Check from './utils/Check.js';
import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';
import Utils from './utils/Utils.js';
import SelectBuilder from './select/SelectBuilder.js';
import CheckboxRadioBuilder from './checkbox-radio/CheckboxRadioBuilder.js';
import InputFileBuilder from './input-file/InputFileBuilder.js';

export default class CustomFormFields {

	constructor(options) {
		this.check = new Check();
		this.selector = new Selector();
		this.creator = new Creator(this.check);
		this.utils = new Utils(this.check);

		this.selects = new SelectBuilder(options.selects, this.selector, this.creator, this.check, this.utils);
		this.selects.build();

		this.checkboxesRadios = new CheckboxRadioBuilder(options.checkboxesRadios, this.selector, this.creator, this.check, this.utils);
		this.checkboxesRadios.build();

		this.inputsFile = new InputFileBuilder(options.inputsFile, this.selector, this.creator, this.check, this.utils);
		this.inputsFile.build();
	}
}