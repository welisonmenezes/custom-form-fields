import Selector from '../utils/Selector.js';
import Creator from '../utils/Creator.js';

export default class SelectBuilder {

	constructor() {
		this.$ = new Selector();
		this.creator = new Creator();
	}

	createSelects() {

		const selects = this.$.getElements('select');
		selects.forEach((select)  => {

			// cria o wrap do select e insert o select dentro
			const wrapArr = [
				{
					name: 'DIV',
					class: ['wrap-select']
				}
			];
			const parentSelect = this.creator.createElements(wrapArr, select.parentNode);
			const wrapSelect = this.$.getElement('div.wrap-select', parentSelect);
			if(wrapSelect) {
				wrapSelect.insertAdjacentElement('afterbegin', select);
			}



			const optsArr = [];
			let childObj;
			const divParent = {
				name: 'DIV',
				class: ['container-class']
			};

			const children = select.children;
			if(children) {
				const total = children.length;
				let i, child;
				for(i = 0; i < total; i++){
					child = children[i];
					if(child.tagName === 'OPTION') {
						
						childObj = {
							name: 'DIV',
							class: ['item-class', 'option-class'],
							text: child.innerHTML,
							attributes: [
								{name: 'data-value', value: child.value}
							]
						};

						optsArr.push(childObj);

					} else if (child.tagName === 'OPTGROUP') {
						
						childObj = {
							name: 'DIV',
							class: ['group-class'],
							children: {
								elements: [
									{
										name: 'DIV',
										class: ['item-class', 'title-class'],
										text: child.getAttribute('label')
									}
								]
							}
						};

						const childGroup = child.children;
						const total2 = childGroup.length;
						//console.log('childGroup',childGroup)
						//console.log('total2',total2)

						let i2, child2 = [], childObj2;
						for(i2 = 0; i2 < total2; i2++) {
							child2 = childGroup[i2];
							//console.log(child2);
							///*
							childObj2 = {
								name: 'DIV',
								class: ['item-class', 'option-class'],
								text: child2.innerHTML,
								attributes: [
									{name: 'data-value', value: child2.value}
								]
							};
							//*/
							childObj.children.elements.push(childObj2);
						}

						//childObj.children.elements.push(childObj2);

						optsArr.push(childObj);

					}
				}
			}

			//console.log(optsArr);
			const createdEl = this.creator.createElements(optsArr, divParent);
			console.log(createdEl);





			/*
			let divParent, divElements;

			const parentDiv = {
				name: 'DIV',
				class: ['container-class']
			};

			const opts = this.$.getElements('option', select);

			const divGroups = this.createGroups(select);
			if(divGroups.length > 0) {
				divElements = divGroups;
			} else {
				divElements = this.createOptions(select);
			}

			divParent = this.creator.createElements(divElements, divParent);
			*/
			
			//console.log('divParent', divParent);
		});


		const wrapSelect = this.$.getElements('div.wrap-select');
		wrapSelect.forEach((wrap)  => {
			const select = this.$.getElement('select', wrap);
			const children = select.children;

			//console.log(children);
		});

	}

	createOptions(parent) {
		const optsArr = [];
		if(parent) {
			const opts = this.$.getElements('option', parent);
			if(opts) {
				opts.forEach((opt) => {
					optsArr.push({
						name: 'DIV',
						class: ['item-class', 'option-class'],
						text: opt.innerHTML,
						attributes: [
							{name: 'data-value', value: opt.value}
						]
					});
				});
			}
		}
		return optsArr;
	}

	createGroups(parent) {
		const groupArr = [];
		if(parent) {
			const groups = this.$.getElements('optgroup', parent);

			if(groups) {

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

					const opts = this.createOptions(group);
					opts.forEach((opt) => {
						groupObj.children.elements.push(opt);
					});

					groupArr.push(groupObj);
				});

			}
		}
		return groupArr;
	}
	
}