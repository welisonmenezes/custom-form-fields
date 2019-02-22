import '../scss/app.scss';
import './polyfills/Array.js';

import Check from './utils/Check.js';
import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';
import Utils from './utils/Utils.js';
import SelectBuilder from './select/SelectBuilder.js';

const check = new Check();
const selector = new Selector();
const creator = new Creator(check);
const utils = new Utils(check);

const options = {
	selectByDigit: false,
	selectors: {
		selected: 'selected'
	}
}
const selects = new SelectBuilder(options, selector, creator, check, utils);
selects.build();


document.getElementById('addOpt').addEventListener('click', function() {
	const select = document.getElementById('sel-1');
	selects.addNewOption('xxx', 'Xxx', select);
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