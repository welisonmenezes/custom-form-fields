import '../scss/app.scss';
import './polyfills/Array.js';

import CustomFormFields from './CustomFormFields.js';

const options = {
	selects: {
		buildUiSelects: true,
		selectByDigit: true,
		selectors: {
			selected: 'cff-selected'
		},
		callbacks: {
			beforeBuildSelects: function(selects) {
				console.log('beforeBuildSelects', selects);
			}
		}
	},
	checkboxesRadios: {
		buildUiCheckboxesRadios: true,
		selectors: {
			checked: 'cff-is-checked'
		},
		callbacks: {
			beforeBuildInputs: function(checkboxesRadios) {
				console.log('beforeBuildInputs', checkboxesRadios);
			}
		}
	},
	inputsFile: {
		buildUiInputsFile: true
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
	if (inputs) {
		inputs.forEach((input) => {
			cff.checkboxesRadios.destroy(input);
		});
	}
});

document.getElementById('constroyCheckRadio').addEventListener('click', function() {
	const inputs = document.querySelectorAll('input[name="r-1"]');
	if (inputs) {
		inputs.forEach((input) => {
			cff.checkboxesRadios.constroy(input);
		});
	}
});

document.getElementById('setChecked').addEventListener('click', function() {
	const input = document.getElementById('radio-1');
	cff.checkboxesRadios.setChecked(input);
});