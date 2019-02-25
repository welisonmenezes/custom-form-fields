import '../scss/app.scss';
import './polyfills/Array.js';

import CustomFormFields from './CustomFormFields.js';

const options = {
	selects: {
		selectByDigit: false,
		selectors: {
			selected: 'cff-selected'
		},
		callbacks: {
			beforeBuildSelect: function(selects) {
				console.log('beforeBuildSelect', selects);
			},
			afterBuildSelect: function(wrapSelects) {
				console.log('afterBuildSelect', wrapSelects);
			},
			beforeEachBuildSelect: function(select) {
				console.log('beforeEachBuildSelect', select);
			},
			afterEachBuildSelect: function(wrapSelect) {
				console.log('afterEachBuildSelect', wrapSelect);
			},
			beforeAddNewOption: function(option) {
				console.log('beforeAddNewOption', option);
			},
			afterAddNewOption: function(uiOption) {
				console.log('afterAddNewOption', uiOption);
			},
			beforeOpenSelect: function(wrapSelect) {
				console.log('beforeOpenSelect', wrapSelect);
			},
			afterOpenSelect: function(wrapSelect) {
				console.log('afterOpenSelect', wrapSelect);
			},
			beforeCloseSelects: function(wrapSelects) {
				console.log('beforeCloseSelects', wrapSelects);
			},
			afterCloseSelects: function(wrapSelects) {
				console.log('afterCloseSelects', wrapSelects);
			},
			beforeSelectItem: function(wrapSelect) {
				console.log('beforeSelectItem', wrapSelect);
			},
			afterSelectItem: function(wrapSelect) {
				console.log('afterSelectItem', wrapSelect);
			},
			beforeDeselectItem: function(wrapSelect) {
				console.log('beforeDeselectItem', wrapSelect);
			},
			afterDeselectItem: function(wrapSelect) {
				console.log('afterDeselectItem', wrapSelect);
			}
		}
	}
};
const cff = new CustomFormFields(options);

document.getElementById('addOpt').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	cff.selects.addNewOption('xxx', 'Xxx', select);
});

document.getElementById('selectOpt').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	cff.selects.selectItem(2, select);
});