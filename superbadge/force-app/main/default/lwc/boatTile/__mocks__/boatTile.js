import { LightningElement, api } from 'lwc';
import html from './boatTile.html';

export default class BoatTile extends LightningElement {
	@api boat;

	render(){
		return html;
	}
}