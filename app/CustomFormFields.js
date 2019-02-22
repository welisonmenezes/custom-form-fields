import Check from './utils/Check.js';
import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';
import Utils from './utils/Utils.js';
import SelectBuilder from './select/SelectBuilder.js';

export default class CustomFormFields {

	constructor(options) {

		this.check = new Check();
		this.selector = new Selector();
		this.creator = new Creator(this.check);
		this.utils = new Utils(this.check);

		this.selects = new SelectBuilder(options.selects, this.selector, this.creator, this.check, this.utils);
		this.selects.build();

	}
}