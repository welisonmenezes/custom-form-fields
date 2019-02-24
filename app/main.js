import '../scss/app.scss';
import './polyfills/Array.js';

import CustomFormFields from './CustomFormFields.js';

const options = {
	selects: {
		selectByDigit: false,
		selectors: {
			selected: 'selected'
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
			}
		}
	}
};
const cff = new CustomFormFields(options);

document.getElementById('addOpt').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	cff.selects.addNewOption('xxx', 'Xxx', select);
});

/*
const elements = [
	{
		name: 'DIV',
		class: ['class-div'],
		attributes: [
			{name: 'data-value', value: 'value-test'},
			{name: 'id', value: 'div-id'}
		],
		text: 'Div text',
		children: {
			elements: [
				{
					name: 'P',
					class: ['class-1', 'class-2'],
					attributes: [
						{name: 'data-value', value: 'value-test'},
						{name: 'data-target', value: 'target-test'}
					],
					text: 'P text',
					children: {
						elements: [
							{
								name: 'LABEL',
								children: {
									elements: [
										{
											name: 'SPAN',
											text: 'inside all'
										}
									]
								}
							},
							{
								name: 'INPUT',
								class: ['form-control', 'input-cls'],
								attributes: [
									{name: 'value', value: 'email@email'},
									{name: 'type', value: 'email'}
								]
							}
						],
						parentTree: {
							name: 'SPAN',
							class: ['class-span'],
							attributes: [{name: 'id', value: 'span-id-parent'}]
						}
					}
				},
				{
					name: 'P',
					text: 'Paragraph'
				}
			]
		}
	},
	{
		name: 'SPAN',
		text: 'SPAN text'
	}
];

const parent = {
	name: 'DIV',
	class: ['class-div'],
	attributes: [{name: 'id', value: 'div-id-parent'}]
};

const createdEl = creator.createElements(elements, parent);
console.log('createdEl', createdEl);
*/