import '../scss/app.scss';
import './polyfills/Array.js';

import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';

const $ = new Selector();
const creator = new Creator();


const selects = $.getElements('select');
//console.log('Selects', selects);

selects.forEach((select)  => {

	let opts, divOpts = [], createdDiv;

	const parentDiv = {
		name: 'DIV',
		class: ['container-class']
	};

	const groups = $.getElements('optgroup', select);

	if(groups) {

		const divGroups = [];

		groups.forEach((group) => {

			const groupObj = {
				name: 'DIV',
				class: ['group-class'],
				children: {
					elements: [
						{
							name: 'DIV',
							class: ['item-class', 'title-class'],
							text: group.getAttribute('label')
						}
					]
				}
			};

			opts = $.getElements('option', group);

			if(opts) {
				opts.forEach((opt) => {
					groupObj.children.elements.push({
						name: 'DIV',
						class: ['item-class', 'option-class'],
						text: opt.innerHTML,
						attributes: [
							{name: 'data-value', value: opt.value}
						]
					});
				});
			}

			divGroups.push(groupObj);
		});

		createdDiv = creator.createElements(divGroups, parentDiv);
	}
	
	console.log('createdDiv', createdDiv);
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