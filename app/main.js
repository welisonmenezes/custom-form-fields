import '../scss/app.scss';
import './polyfills/Array.js';

import Selector from './utils/Selector.js';
import Creator from './utils/Creator.js';

const $ = new Selector();
const creator = new Creator();


const selects = $.getElements('select');
console.log('Selects', selects);


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
		children: [
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
		] 
	},
	{
		name: 'SPAN',
		text: 'SPAN text'
	}
];

const createdEl = creator.createElements(elements);
console.log('createdEl', createdEl);