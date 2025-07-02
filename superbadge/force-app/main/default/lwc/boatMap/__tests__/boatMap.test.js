import { createElement } from 'lwc';
import BoatMap from 'c/boatMap';
import { getRecord } from 'lightning/uiRecordApi';
import { subscribe } from 'lightning/messageService';
import MESSAGE_CHANNEL from '@salesforce/messageChannel/BoatMessageChannel__c';
import { SELECT_BOAT_LABEL } from '../constants';

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

// Mock realistic data
const mockGetRecord = require('./data/getRecord.json');

jest.mock('lightning/messageService', () => ({
	subscribe: jest.fn(),
	unsubscribe: jest.fn(),
	MessageContext: jest.fn(),
}));

jest.mock('lightning/uiRecordApi',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
		return {
			getRecord: createApexTestWireAdapter(jest.fn()),
		};
	},
	{ virtual: true }
)

describe('c-boat-map', () => {
	let element;

	beforeEach(() => {
		element = createElement('c-boat-map', {
			is: BoatMap
		});
		// element.recordId = 'testId';
		document.body.appendChild(element);
		
		const mockMessage = { recordId: 'abc123' };
		const messageCallback = subscribe.mock.calls[0][2];
		messageCallback(mockMessage);
	});

	afterEach(() => {
		// Reset the DOM to clean up between tests
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		subscribe.mockClear();
	});

	it('Should show label no boat selected', () => {
		const span = element.shadowRoot.querySelector("span");
		expect(span.textContent).toBe(SELECT_BOAT_LABEL);
		expect(element).toMatchSnapshot();
	});

	it('Wire Should show locations on map', async () => {
		// Given
		getRecord.emit(mockGetRecord);

		// element.recordId='123'
		debugger;
		// Wait for promises to resolve
		await flushPromises();

		const map = element.shadowRoot.querySelector("lightning-map");

		// Then
		expect(map).toBeDefined();
		expect(element).toMatchSnapshot();
		expect(element.recordId).toBe('abc123');
	});

	it('Wire Should return error', async () => {
		// Given
		const mockError = { message: 'Record not found' };
		getRecord.error(mockError);

		// Wait for promises to resolve
		await flushPromises();

		// Then
		expect(element).toMatchSnapshot();
	});
});
