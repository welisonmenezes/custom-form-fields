import '../scss/app.scss';
import polyfills from './polyfills/Array.js';
polyfills();
import CustomFormFields from './CustomFormFields.js';
export function init (options) {
	return new CustomFormFields(options);
}