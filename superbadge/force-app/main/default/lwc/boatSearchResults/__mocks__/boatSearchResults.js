
import { LightningElement, api } from 'lwc';
import html from './boatSearchResults.html';

export default class BoatSearchResults extends LightningElement {

	@api
	searchBoats(boatTypeId) {
		this.selectedBoatTypeId = boatTypeId;
	}

	render() {
		return html
	}
}