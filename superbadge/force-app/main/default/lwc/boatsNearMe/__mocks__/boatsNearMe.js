import { LightningElement, api } from 'lwc';
import html from './boatsNearMe.html';

export default class BoatsNearMe extends LightningElement {
	@api
	boatTypeId;

	render(){
		return html;
	}
}