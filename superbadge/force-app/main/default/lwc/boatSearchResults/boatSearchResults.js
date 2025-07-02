import { LightningElement, wire, api, track } from 'lwc';
import getBoats from '@salesforce/apex/BoatsController.getBoats';
import updateBoatList from '@salesforce/apex/BoatsController.updateBoatList';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { publish, MessageContext } from "lightning/messageService";
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

import { COLUMNS, TOAST } from './constants';

export default class BoatSearchResults extends LightningElement {
	@track boats;
	selectedBoatTypeId = '';
	errors;
	columns = COLUMNS;
	wiredBoatsData;

	@wire(MessageContext)
	messageContext;

	@wire(getBoats, { boatTypeId: '$selectedBoatTypeId' })
	wiredBoats(result) {
		this.wiredBoatsData = result;
		if (result.data) {
			this.boats = result.data;
			console.log(`result.data ${JSON.stringify(result.data)}`);
		} else if (result.error) {
			this.errors = result.error;
			console.log(`this.errors ${JSON.stringify(this.errors)}`);
			this.showToastEvent('Error', `Getting error while fetching boats`, 'error');
		}
	}
	@api
	searchBoats(boatTypeId) {
		this.selectedBoatTypeId = boatTypeId;
	}

	async handleSave(event) {
		try {
			await updateBoatList({ data: event.detail.draftValues });
			this.refresh();
			this.showToastEvent(TOAST.SUCCESS.TITLE, TOAST.SUCCESS.MESSAGE, TOAST.SUCCESS.VARIANT);
		} catch (errors) {
			this.showToastEvent(TOAST.ERROR.TITLE, TOAST.ERROR.MESSAGE.replace('{0}', errors), TOAST.ERROR.VARIANT);
		}
	}

	refresh() {
		refreshApex(this.wiredBoatsData);
	}

	sendMessageService(boatId) {

		const payload = { recordId: boatId };
		publish(this.messageContext, BOATMC, payload);
	}

	showToastEvent(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}

	updateSelectedTile(event) {

		this.sendMessageService(event.detail.boatId);
	}
}