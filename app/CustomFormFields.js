import Check from './utils/Check.js';
import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';
import Utils from './utils/Utils.js';
import SelectBuilder from './select/SelectBuilder.js';
import CheckboxRadioBuilder from './checkbox-radio/CheckboxRadioBuilder.js';
import InputFileBuilder from './input-file/InputFileBuilder.js';

export default class CustomFormFields {

	/**
	 * The constructor
	 * @param { Object } userConfigurations - The user configurations
	 */
	constructor(userConfigurations) {
		this.check = new Check();
		this.selector = new Selector();
		this.creator = new Creator(this.check);
		this.utils = new Utils(this.check);
		this._setConfiguration(userConfigurations);
		this.buildElements();
	}

	/**
	 * Build UI elements from default html elements
	 */
	buildElements() {
		// build ui selects
		if (this.config.buildUiSelects) {
			this.selects = new SelectBuilder(this.config.selects, this.selector, this.creator, this.check, this.utils);
			this.selects.build();
		}
		// build ui inputs radio and/or checkbox
		if (this.config.buildUiCheckboxesRadios) {
			this.checkboxesRadios = new CheckboxRadioBuilder(this.config.checkboxesRadios, this.selector, this.creator, this.check, this.utils);
			this.checkboxesRadios.build();
		}
		// build ui inputs file
		if (this.config.buildUiInputsFile) {
			this.inputsFile = new InputFileBuilder(this.config.inputsFile, this.selector, this.creator, this.check, this.utils);
			this.inputsFile.build();
		}
	}

	/**
	 * Sets configurations by merging user configurations with default configurations
	 * @param {Object} userConfigurations - The user configurations
	 */
	_setConfiguration(userConfigurations) {
		this.config = {
			buildUiSelects: true,
			buildUiCheckboxesRadios: true,
			buildUiInputsFile: true,
			selects: {
				element: 'select',
				selectByArrows: true,
				selectByDigit: true,
				autoHeight: true,
				autoPositioning: true,
				selectors: {
					selected: 'cff-selected',
					opened: 'cff-opened',
					multiple: 'cff-multiple',
					single: 'cff-single',
					disabled: 'cff-disabled',
					uiOption: 'cff-option',
					uiOptDisabled: 'cff-opt-disabled',
					uiItemSelect: 'cff-item',
					uiGroupClass: 'cff-group',
					uiGroupTitle: 'cff-group-title',
					wrapSelect: 'cff-wrap-select',
					containerOptions: 'cff-container-options',
					containerOptsOverlowed: 'cff-overflowed',
					containerOptsOnTop: 'cff-top',
					containerSelected: 'cff-container-display',
					selectedDisplayed: 'cff-display'
				},
				callbacks: {
					beforeBuildSelects: null,
					afterBuildSelects: null,
					beforeConstroySelect: null,
					afterConstroySelect: null,
					beforeDestroySelect: null,
					afterDestroySelect: null,
					beforeAddNewOption: null,
					afterAddNewOption: null,
					beforeOpenSelect: null,
					afterOpenSelect: null,
					beforeCloseSelects: null,
					afterCloseSelects: null,
					beforeSelectItem: null,
					afterSelectItem: null,
					beforeDeselectItem: null,
					afterDeselectItem: null
				}
			},
			checkboxesRadios: {
				element: 'input[type="checkbox"], input[type="radio"]',
				labelPosition: 'right', // ['right', 'left']
				selectors: {
					checked: 'cff-checked',
					disabled: 'cff-disabled',
					wrapCheckRadio: 'cff-wrap-check-radio',
					containerCheckRadio: 'cff-container-check-radio',
					isRadio: 'cff-is-radio',
					isCheckbox: 'cff-is-checkbox',
					uiInput: 'cff-ui-input',
					uiLabel: 'cff-ui-label',
					labelLeft: 'cff-text-left',
					labelRight: 'cff-text-right'
				},
				callbacks: {
					beforeBuildInputs: null,
					afterBuildInputs: null,
					beforeConstroyInput: null,
					afterConstroyInput: null,
					beforeDestroyInput: null,
					afterDestroyInput: null,
					beforeCheckInput: null,
					afterCheckInput: null
				}
			},
			inputsFile: {
				element: 'input[type="file"]',
				defaultInputText: 'No file selected',
				defaultButtonText: 'Select a file',
				selectors: {
					disabled: 'cff-disabled',
					wrapInputFile: 'cff-wrap-input-file',
					uiInputFile: 'cff-input-file',
					uiInputDisplay: 'cff-input-display',
					uiInputLabel: 'cff-input-label',
					uiSelectButton: 'cff-select-button'
				},
				callbacks: {}
			}
		};
		this.config = this.utils.mergeObjectsDeeply({}, this.config, userConfigurations);
	}
}