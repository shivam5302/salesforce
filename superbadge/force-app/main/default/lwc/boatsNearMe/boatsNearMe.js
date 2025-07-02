import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getBoatsByLocation from '@salesforce/apex/BoatsController.getBoatsByLocation';

import { LABEL_YOU_ARE_HERE, ICON_STANDARD_USER, ERROR_TITLE, ERROR_VARIANT } from './constants';

export default class BoatsNearMe extends LightningElement {
	@api
	boatTypeId;
	@track mapMarkers = [];
	isLoading = true;
	isRendered = false;
	latitude;
	longitude;

	// Add the wired method from the Apex Class
	// Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
	// Handle the result and calls createMapMarkers
	@wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
	wiredBoatsJSON({ error, data }) {
		if (data) {
			this.createMapMarkers(data)
		} else if (error) {
			this.showToast()
		}
	}

	// Controls the isRendered property
	// Calls getLocationFromBrowser()
	renderedCallback() {
		if (this.isRendered) return;
		this.getLocationFromBrowser();
		this.isRendered = true;
	}

	// Gets the location from the Browser
	// position => {latitude and longitude}
	getLocationFromBrowser() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this.handleSuccess.bind(this),
				this.handleError
			);
		}
	}

	handleSuccess(position) {

		console.log(JSON.stringify(position));
		console.log(position.coords.latitude);
		this.latitude = position.coords.latitude;
		this.longitude = position.coords.longitude;
	}

	handleError(error) {
		this.showToast('Success', 'Getting error while fetching location', 'success')
	}

	// Creates the map markers
	createMapMarkers(boatData) {

		const newMarkers = boatData.map(boat => ({
			location: {
				Latitude: boat.Geolocation__Latitude__s,
				Longitude: boat.Geolocation__Longitude__s
			},
			title: boat.Name,
			icon: boat.Boat_Image__c
		}));
		newMarkers.unshift({
			location: {
				Latitude: this.latitude,
				Longitude: this.longitude
			},
			title: LABEL_YOU_ARE_HERE,
			icon: ICON_STANDARD_USER
		});
		this.mapMarkers = newMarkers;
		this.isLoading = false;
	}

	showToast(title, message, variant) {
		const event = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(event);
	}
}
