// Custom Labels Imports
// import labelDetails for Details
// import labelReviews for Reviews
// import labelAddReview for Add_Review
// import labelFullDetails for Full_Details
// import labelPleaseSelectABoat for Please_select_a_boat
// Boat__c Schema Imports
import { LightningElement, wire } from 'lwc'
// import Boat__c from '@salesforce/schema/Boat__c';

import {
	subscribe,
	unsubscribe,
	APPLICATION_SCOPE,
	MessageContext,
} from "lightning/messageService";
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import { getRecord, getFieldValue } from 'lightning/uiRecordApi'
import { NavigationMixin } from 'lightning/navigation';


// import BOAT_ID_FIELD for the Boat Id
// import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
// import BOAT_NAME_FIELD for the boat Name
// import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';

import { BOAT_FIELDS } from './constants';

export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
	boatId;
	// wiredRecord;
	boat;
	objectApiName = 'Boat__c';
	// label = {
	// 	labelDetails,
	// 	labelReviews,
	// 	labelAddReview,
	// 	labelFullDetails,
	// 	labelPleaseSelectABoat,
	// };
	// Private
	subscription = null;
	boatFields = BOAT_FIELDS;


	@wire(MessageContext)
	messageContext;

	@wire(getRecord, { recordId: '$boatId', fields: [BOAT_FIELDS.NAME_FIELD] })
	wiredRecord({ error, data }) {
		if (data) {
			this.boat = data;
		} else if (error) {
			console.log(error);
		}
	};

	// Decide when to show or hide the icon
	// returns 'utility:anchor' or null
	get detailsTabIconName() {
		return 'utility:anchor';
	}

	// Utilize getFieldValue to extract the boat name from the record wire
	get boatName() {
		let val = getFieldValue(this.boat, BOAT_FIELDS.NAME_FIELD);
		return val;
	}

	// Subscribe to the message channel
	subscribeMC() {
		// boatId is populated on Record Pages, and this component
		// should not update when this component is on a record page.
		if (this.subscription || this.boatId) {
			return;
		}
		this.subscription = subscribe(
			this.messageContext,
			BOATMC,
			(message) => this.handleMessage(message),
			{ scope: APPLICATION_SCOPE },
		);
		// Subscribe to the message channel to retrieve the boatId and explicitly assign it to boatId.
	}

	// Calls subscribeMC()
	connectedCallback() {
		this.subscribeMC();
	}

	handleMessage(message) {

		this.boatId = message.recordId;
	}

	unsubscribeToMessageChannel() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	// Navigates to record page
	navigateToRecordViewPage() {
		debugger;
		this[NavigationMixin.Navigate]({
			type: 'standard__recordPage',
			attributes: {
				objectApiName: this.objectApiName,
				recordId: this.boatId,
				actionName: 'view',
			},
		});
	}

	// Navigates back to the review list, and refreshes reviews component
	handleReviewCreated() { }
}
