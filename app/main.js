import '../scss/app.scss';
import polyfills from './polyfills/Array.js';

polyfills();

import CustomFormFields from './CustomFormFields.js';

const options = {
	selects: {
		selectByDigit: true,
		selectors: {
			selected: 'cff-selected'
		},
		callbacks: {
			beforeBuildSelects: function(selects) {
				//console.log('beforeBuildSelects', selects);
			}
		}
	},
	checkboxesRadios: {
		selectors: {
			checked: 'cff-is-checked'
		},
		callbacks: {
			beforeBuildInputs: function(checkboxesRadios) {
				//console.log('beforeBuildInputs', checkboxesRadios);
			}
		}
	},
	inputsFile: {
		callbacks: {
			beforeBuildInputs: function(inputsFile) {
				console.log('inputsFile', inputsFile);
			},
			afterBuildInputs: function(wrapInputsFile) {
				console.log('wrapInputsFile', wrapInputsFile);
			},
			beforeConstroyInput: function(inputFile) {
				console.log('inputFile', inputFile);
			},
			afterConstroyInput: function(wrapInputFile) {
				console.log('wrapInputFile', wrapInputFile);
			},
			beforeDestroyInput: function(wrapInputFile) {
				console.log('wrapInputFile', wrapInputFile);
			},
			afterDestroyInput: function(inputFile) {
				console.log('inputFile', inputFile);
			},
			beforeSelectFile: function(inputFile) {
				console.log('inputFile', inputFile);
			},
			afterSelectFile: function(inputFile) {
				console.log('inputFile', inputFile);
			},
			beforeClearInput: function(inputFile) {
				console.log('inputFile', inputFile);
			},
			afterClearInput: function(inputFile) {
				console.log('inputFile', inputFile);
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

document.getElementById('destroySelect').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	cff.selects.destroy(select);
});

document.getElementById('constroySelect').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	cff.selects.constroy(select);
});


document.getElementById('destroyCheckRadio').addEventListener('click', function() {
	const inputs = document.querySelectorAll('input[name="r-1"]');
	if (inputs && inputs.length) {
		const total = inputs.length;
		let i;
		for (i = 0; i < total; i++) {
			cff.checkboxesRadios.destroy(inputs[i]);
		}
	}
});

document.getElementById('constroyCheckRadio').addEventListener('click', function() {
	const inputs = document.querySelectorAll('input[name="r-1"]');
	if (inputs && inputs.length) {
		const total = inputs.length;
		let i;
		for (i = 0; i < total; i++) {
			cff.checkboxesRadios.constroy(inputs[i]);
		}
	}
});

document.getElementById('setChecked').addEventListener('click', function() {
	const input = document.getElementById('radio-1');
	cff.checkboxesRadios.setChecked(input);
});

document.getElementById('destroyInputFile').addEventListener('click', function() {
	const input = document.getElementById('m-files');
	cff.inputsFile.destroy(input);
});

document.getElementById('constroyInputFile').addEventListener('click', function() {
	const input = document.getElementById('m-files');
	cff.inputsFile.constroy(input);
});

document.getElementById('clearInputFile').addEventListener('click', function() {
	const input = document.getElementById('m-files');
	cff.inputsFile.clear(input);
});