export default class Check {

	constructor() {}

	isHTMLElement(element) {
        return element instanceof Element || element instanceof HTMLDocument;
    }
	
}