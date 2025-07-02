import { LightningElement, api } from "lwc";
// imports
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import BOAT_REVIEW_OBJECT from schema - BoatReview__c
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
// import NAME_FIELD from schema - BoatReview__c.Name
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
// import COMMENT_FIELD from schema - BoatReview__c.Comment__c
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';

import BOAT_FIELD from '@salesforce/schema/BoatReview__c.Boat__c';

export default class BoatAddReviewForm extends LightningElement {
	// Private
	boatId;
	name;
	comment
	rating;

	readOnly = false;
	boatReviewObject = BOAT_REVIEW_OBJECT;
	nameField = NAME_FIELD;
	boatField = BOAT_FIELD;
	ratingField = RATING_FIELD;
	commentField = COMMENT_FIELD;
	labelSubject = 'Review Subject';
	labelRating = 'Rating';

	// Public Getter and Setter to allow for logic to run on recordId change
	@api
	get recordId() {
		return this.boatId;
	}
	set recordId(value) {
		//sets boatId attribute
		//sets boatId assignment
		this.boatId = value;
	}

	// Gets user rating input from stars component
	handleRatingChanged(event) {

		this.rating = event.detail.rating;
	}

	handleChange(event) {
		this.comment = event.target.value;
	}

	// Custom submission handler to properly set Rating
	// This function must prevent the anchor element from navigating to a URL.
	// form to be submitted: lightning-record-edit-form
	handleSubmit(event) {
		event.preventDefault();
		console.log(`fields :${event.detail.fields}`);
		// let editForm = this.template.querySelector('lightning-record-edit-form');
		// console.log(JSON.stringify(editForm));
	}

	// Shows a toast message once form is submitted successfully
	// Dispatches event when a review is created
	handleSuccess() {
		// TODO: dispatch the custom event and show the success message
		showToastEvent('Success', 'Record saved successfully!', 'succcess');
		this.handleReset();
	}

	// Clears form data upon submission
	// TODO: it must reset each lightning-input-field
	handleReset() {
		// this.template.querySelector('lightning-input-field')
	}

	showToastEvent(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}
