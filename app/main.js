import '../scss/app.scss';
import './polyfills/Array.js';

import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';

const $ = new Selector();
const creator = new Creator();


const selects = $.getElements('select');
console.log('Selects', selects);

/*
const elements = [
	{
		name: 'DIV',
		class: ['class-div'],
		attributes: [
			{name: 'data-value', value: 'value-test'},
			{name: 'id', value: 'div-id'}
		],
		text: 'Div text'
	},
	{
		name: 'P',
		class: ['class-1', 'class-2'],
		attributes: [
			{name: 'data-value', value: 'value-test'},
			{name: 'data-target', value: 'target-test'}
		],
		text: 'P text',
		children: {
			isSiblings: true,
			elements: [
				{
					name: 'LABEL'
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
		name: 'SPAN',
		text: 'SPAN text'
	}
];

const parent = {
	name: 'DIV',
	class: ['class-div'],
	attributes: [{name: 'id', value: 'div-id-parent'}]
};

const createdEl = creator.createElements(elements, false, parent);
console.log('createdEl', createdEl);
*/

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