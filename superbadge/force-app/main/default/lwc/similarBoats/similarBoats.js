import { api, LightningElement, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatsController.getSimilarBoats';

export default class SimilarBoats extends LightningElement {
	// Private
	similarBoats = [];
	boatId;
	error;


	@api
	get recordId() {
		// returns the boatId
		return this.boatId;
	}
	set recordId(value) {
		// sets the boatId value
		// sets the boatId attribute
		this.boatId = value;
	}

	@api
	similarBy;


	@wire(getSimilarBoats, { boatId: '$recordId', similarBy: '$similarBy' })
	relatedBoats({ data, error }) {
		if (data) {
			this.similarBoats = data;
		}
		else if (error) {
			this.error = error;
			console.log(`Error : ${JSON.stringify(error)}`);
		}
	}

	get noBoats() {
		return this.similarBoats.length == 0;
	}

	get getTitle() {
		return 'Similar boats by ' + this.similarBy;
	}

	openBoatDetailPage(event) {

	}
}