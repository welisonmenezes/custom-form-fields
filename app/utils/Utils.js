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
}