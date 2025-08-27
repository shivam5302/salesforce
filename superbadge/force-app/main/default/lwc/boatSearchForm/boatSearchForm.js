import { LightningElement, wire, track } from 'lwc';
import boatTypes from '@salesforce/apex/BoatsController.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
	selectedBoatTypeId = '';

	// Private
	error = undefined;

	@track searchOptions = undefined;

	// Wire a custom Apex method
	@wire(boatTypes)
	getBoatTypes({ errors, data }) {
		if (data) {
			this.searchOptions = data.map(type => ({
				// TODO: complete the logic
				label: type.Name,
				value: type.Id
			}));
			this.searchOptions.unshift({ label: 'All Types', value: '' });
			console.log(`this.searchOptions => ${this.searchOptions}`);
		} else if (errors) {
			this.searchOptions = undefined;
			this.error = errors;
		}
	}

	// Fires event that the search option has changed.
	// passes boatTypeId (value of this.selectedBoatTypeId) in the detail
	handleSearchOptionChange(event) {
		// Create the const searchEvent
		this.selectedBoatTypeId = event.target.value;
		// searchEvent must be the new custom event search
		const searchEvent = new CustomEvent('search', {
			detail: {
				boatTypeId: this.selectedBoatTypeId
			}
		});
		this.dispatchEvent(searchEvent);
	}
}
