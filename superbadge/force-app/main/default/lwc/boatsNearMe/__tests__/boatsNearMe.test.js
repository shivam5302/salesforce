import { createElement } from 'lwc';
import BoatsNearMe from 'c/boatsNearMe';
import getBoatsByLocation from '@salesforce/apex/BoatDataService.getBoatsByLocation';
import getBoatsByLocatoinMockData from './data/getBoatsByLocation.json'

jest.mock('@salesforce/apex/BoatDataService.getBoatsByLocation',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
		return {
			default: createApexTestWireAdapter(jest.fn())
		};
	},
	{ virtual: true }
)

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-boats-near-me', () => {
	let element;
	beforeEach(()=>{
		element = createElement('c-boats-near-me', {
			is: BoatsNearMe
		});
		document.body.appendChild(element);

		global.navigator.geolocation = {
			getCurrentPosition: jest.fn()
		};
	})
	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('Should render the spinner', async() => {
		expect(element).toMatchSnapshot();
	});

	it('Should render the boats by location', async() => {
		//Given
		
		//When
		getBoatsByLocation.emit(getBoatsByLocatoinMockData);
		
		//Then
		await flushPromises();
		const lightningMap = element.shadowRoot.querySelector('lightning-map');
		expect(lightningMap.mapMarkers.length).toBe(2);
	});

	// it('Should render the boats by location', () => {

	// 	const mockPosition = { coords: { latitude: 40.7128, longitude: -74.0060 } };
		
	// 	// Mock the getCurrentPosition to invoke the success callback
	// 	navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) => {
	// 		success(mockPosition);
	// 	});
	// 	getBoatsByLocation.emit()

	// 	// Assert
	// 	// const div = element.shadowRoot.querySelector('div');
	// 	expect(1).toBe(1);
	// });
});