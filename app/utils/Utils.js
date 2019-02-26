export default class Utils {

	/**
     * The constructor
     * @param { Check } An instance of the Check class
     */
	constructor(Check) {
		this.check = Check;
	}

	/**
	 * Merge objects deeply
	 * @param { Object } target - A new empty object
	 * @param { Object } objectDefault - An object that will be merged
	 * @param { Object } objectUser - An object that will be merged
	 * @returns { Object } A new object merged
	 */
	mergeObjectsDeeply(target, objectDefault, objectUser) {
		if(this.check.isObject(objectDefault) && this.check.isObject(objectUser) && this.check.isObject(target)) {
			var t;
			for(t in objectDefault){
				if(objectDefault.hasOwnProperty(t)){
					if(this.check.isObject(objectDefault[t]) && this.check.isObject(objectDefault[t])){
						target[t] = objectDefault[t];
						// applying recursion to copy deeply
						this.mergeObjectsDeeply(target[t], objectDefault[t], objectUser[t]);
					}else{
						if(objectUser[t] !== undefined){
							target[t] = objectUser[t];
						}else{
							target[t] = objectDefault[t];
						}
					}
				}
			}
		}
		return target;
	}

	/**
     * Get the windows width
     * @returns { Number } The windows width
     */
	getWindowWidth() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	/**
     * Get the windows height
     * @returns { Number } The windows height
     */
	getWindowHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	/**
     * Get the windows scroll Y position
     * @returns { Number } The windows scroll Y postion
     */
	getScreenTop() {
		return (window.scrollY ||  window.pageYOffset || document.body.scrollTop);
	}

	/**
     * Get the element's relative Y position
     * @param { HTMLElement } element - The html element
     * @returns { Number } The element's relative Y postion
     */
	getWindowPositonElement(element) {
		const elH = element.clientHeight;
		const elTop = element.offsetTop;
		const screenTop = this.getScreenTop();
		return (elTop + (elH / 2)) - screenTop;
	}

	/**
     * Prevent the default event behavior
     * @param { Event } event - The event object
     */
	preventDefault(event) {
		const e = event || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;  
	}

	/**
     * Disable the windows scroll during keydown event if it is ArrowUp or ArrowDown
     */
	disableScroll() {
    	window.onkeydown  = function(e) {
    		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
		        e.preventDefault();
		    }
    	};
	}

	/**
     * Enable the windows scroll
     */
	enableScroll() {
		window.onkeydown = function(){};
	}

	/**
	 * Add given event to given element
	 * @param { HTMLElement } element - The element that will receive the event
	 * @param { String } eventName - The event's name
	 * @param { Function } callback - The callback function that will be called by event
	 * @param { Array } arrayArgs - Params to be passed to callback function
	 */
	addEventListenerToElement(element, eventName, callback, arrayArgs) {
		if (element) {
			element.addEventListener(eventName, callback.bind(element, arrayArgs));
		}
	}

	/**
	 * Calls de callback functions
	 * @param { Function } callback - The callback method
	 * @param { Object } ref - The new reference
	 * @param { HTMLElement || HTMLFormElement || HTMLInputElement } element - The container or field that will be validated
	 * @param { String || Number || Array } otherParams - The params that can be used by callback
	 */
	callCallbackFunction(callback, ref, element, otherParams) {
		if (this.check.isFunction(callback)) {
			callback.call(ref, element, otherParams);
		}
	}
}