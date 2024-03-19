import { render } from 'solid-js/web';
import App from './App';
import './lib/spatial-navigation';

const root = document.getElementById('root');

render(() => <App />, root!);
