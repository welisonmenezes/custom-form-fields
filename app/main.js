import '../scss/app.scss';

import Selectors from './utils/Selectors.js';

const $ = new Selectors();

const selects = $.getElements('select');

console.log('Selects', selects);