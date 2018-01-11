import './styles/main.css';
import { sayHelloTo } from './scripts/mod1';
import addArray from './scripts/mod2';
import debug from 'debug';
const log = debug('app:log');
debug.enable('app:log');
log('Logging is enabled!');

const result1 = sayHelloTo('Jasons');
const result2 = addArray([1, 2, 3, 4]);

const printTarget = document.getElementsByClassName('debug__output')[0];

printTarget.innerText = `sayHelloTo('Jason') => ${result1}\n\n`;
printTarget.innerText += `addArray([1, 2, 3, 4]) => ${result2}`;



