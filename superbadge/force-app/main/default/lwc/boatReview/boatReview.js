import { LightningElement, api, wire } from 'lwc';
import getBoatReviews from '@salesforce/apex/BoatsController.getBoatReviews';
import { refreshApex } from '@salesforce/apex';

export default class BoatReview extends LightningElement {
	boatId;
	boatReviews = [];
	isLoading = true;
	readOnly = true;
	rating = 4;

	wiredBoatResult;

	@api
	get recordId() {
		return this.boatId;
	}
	set recordId(value) {
		this.boatId = value;
	}

	get reviewsToShow() {
		return this.boatReviews.length < 1;
	}

	refresh() {
		refreshApex(this.wiredBoatResult);
	}

	// connectedCallback() {

	// }

	// getReviews() {
	// 	getAllReviews({ boatId: '$boatId' });
	// }

	@wire(getBoatReviews, { boatId: '$boatId' })
	getReviews(wiredBoatResult) {
		this.wiredBoatResult = wiredBoatResult;
		let { data, error } = this.wiredBoatResult;
		if (data) {
			this.isLoading = false;
			this.boatReviews = data;
		} else if (error) {
			console.log('Error while fetching boat reviews');
		}
	}
}