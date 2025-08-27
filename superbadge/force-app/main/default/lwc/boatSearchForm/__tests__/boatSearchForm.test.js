import { createElement } from 'lwc';
import BoatSearchForm from 'c/boatSearchForm';
import boatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

import boatTypesMock from './data/boatTypes.json';

jest.mock(
	'@salesforce/apex/BoatDataService.getBoatTypes',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
		return {
			default: createApexTestWireAdapter(jest.fn())
		};
	},
	{ virtual: true }
);

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-boat-search-form', () => {

	let element;

	beforeEach(()=>{
		element = createElement('c-boat-search-form', {
			is: BoatSearchForm
		});
		document.body.appendChild(element);
	})

	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('Should render the options list in lightning-combobox', async () => {

		//Given
		
		const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox');

		//When
		boatTypes.emit(boatTypesMock);

		//Then
		await flushPromises();
		expect(lightningCombobox.options).toBeDefined();
		expect(lightningCombobox.options.length).toBe(3);  // Includes "All Types"
		expect(lightningCombobox.options[0].label).toBe('All Types');
		expect(lightningCombobox.options[1].label).toBe('Luxury Boat');
		expect(lightningCombobox.options[2].label).toBe('Fishing Boat');
	});

	it('should update selectedBoatTypeId and dispatch search event when combobox changes', async() => {
		//Given
		const searchHandler = jest.fn();
		element.addEventListener('search', searchHandler);
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		const newBoatTypeId = 'motorboat';
		combobox.value = newBoatTypeId;
		
		//When
		combobox.dispatchEvent(new Event('change'));

		//Then
		await flushPromises();
		expect(searchHandler).toHaveBeenCalled();
		const eventDetail = searchHandler.mock.calls[0][0].detail;
		expect(eventDetail).toEqual({ boatTypeId: newBoatTypeId });
	});

});