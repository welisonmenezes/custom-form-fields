export default class Utils {

	constructor(Check) {
		this.check = Check;
	}

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

	getWindowWidth() {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	getWindowHeight() {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}

	getScreenTop() {
		return (window.scrollY ||  window.pageYOffset || document.body.scrollTop);
	}

	getWindowPositonElement(element) {
		const elH = element.clientHeight;
		const elTop = element.offsetTop;
		const screenTop = this.getScreenTop();
		return (elTop + (elH / 2)) - screenTop;
	}

	preventDefault(event) {
		const e = event || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;  
	}

	disableScroll() {
    	window.onkeydown  = function(e) {
    		if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
		        e.preventDefault();
		    }
    	};
	}

	enableScroll() {
		window.onkeydown = function(){};
	}

}