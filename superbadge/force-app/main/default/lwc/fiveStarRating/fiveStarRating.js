//import fivestar static resource, call it fivestar

// add constants here

import { LightningElement, api } from 'lwc'
// import fivestarRatingCss from "@salesforce/resourceUrl/fivestar/rating.css";
import fivestarRating from "@salesforce/resourceUrl/fivestar";
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'
import { EDITABLE_CLASS, READ_ONLY_CLASS } from './constants';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FiveStarRating extends LightningElement {
	//initialize public readOnly and value properties
	@api
	readOnly;
	@api
	value;

	editedValue;
	isRendered;

	//getter function that returns the correct class depending on if it is readonly
	get starClass() {
		console.log(`this.readOnly ${this.readOnly}`);
		return this.readOnly ? READ_ONLY_CLASS : EDITABLE_CLASS;
	}

	// Render callback to load the script once the component renders.
	renderedCallback() {
		if (this.isRendered) {
			return;
		}
		this.loadScript();
		this.loadStyle();
		this.isRendered = true;
	}

	//Method to load the 3rd party script and initialize the rating.
	//call the initializeRating function after scripts are loaded
	//display a toast with error message if there is an error loading script
	loadScript() {
		loadScript(this, fivestarRating + "/rating.js").then(() => {
			console.log('Script loaded successfully');
			this.initializeRating();
		}).catch(error => {
			this.showToastEvent('Error', 'Error loading five-star', 'error');
			console.error("Error while loading script");
		})
	}

	loadStyle() {
		loadStyle(this, fivestarRating + "/rating.css")
			.then(() => {
				console.log('Custom CSS loaded successfully');
			})
			.catch(error => {
				this.showToastEvent('Error', 'Error loading five-star', 'error');
				console.error('Error loading custom CSS:', error);
			});
	}

	initializeRating() {
		let domEl = this.template.querySelector('ul');
		let maxRating = 5;
		let self = this;
		let callback = function (rating) {
			self.editedValue = rating;
			self.ratingChanged(rating);
		};
		this.ratingObj = window.rating(
			domEl,
			this.value,
			maxRating,
			callback,
			this.readOnly
		);

		console.log(`ratingObj ${JSON.stringify(this.ratingObj)}`)
	}

	// Method to fire event called ratingchange with the following parameter:
	// {detail: { rating: CURRENT_RATING }}); when the user selects a rating
	ratingChanged(rating) {

		const currentRatingEvent = new CustomEvent('ratingchange', {
			detail: {
				rating: rating
			}
		});

		this.dispatchEvent(currentRatingEvent);
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
