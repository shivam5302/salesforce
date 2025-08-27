import { createElement } from 'lwc';
import BoatSearchResults from 'c/boatSearchResults';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import getBoatsMock from './data/getBoats.json';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { publish, MessageContext } from 'lightning/messageService';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

jest.mock('@salesforce/apex/BoatDataService.getBoats',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
		return {
			default: createApexTestWireAdapter(jest.fn())
		};
	},
	{ virtual: true }
)

jest.mock('@salesforce/apex/BoatDataService.updateBoatList', () => {
	return {
		default: jest.fn()
	};
}, { virtual: true });

jest.mock('@salesforce/apex', () => ({ refreshApex: jest.fn() }), {
	virtual: true,
});

jest.mock('c/boatTile');
jest.mock('c/boatsNearMe');

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-boat-search-results', () => {
	let element;
	beforeEach(()=>{
		element = createElement('c-boat-search-results', {
			is: BoatSearchResults
		});

		// Act
		document.body.appendChild(element);

		getBoats.emit(getBoatsMock);
	})
	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		jest.clearAllMocks();
	});

	it('Should render the boats When gallery tab is active', async() => {
		//Given
		const gallelryTab = element.shadowRoot.querySelector('.gallery');
		const boatTile = element.shadowRoot.querySelector('c-boat-tile')
		

		//When
		gallelryTab.click();

		//Then
		await flushPromises();
		expect(boatTile.boat).toEqual(getBoatsMock[0]);
		expect(element).toMatchSnapshot();
	});

	it('Should render the boats When editor tab is active', async() => {
		//Given
		const editorTab = element.shadowRoot.querySelector('.editor');
		const lightningTable = element.shadowRoot.querySelector('lightning-datatable')
		
		//When
		editorTab.click();
		
		//Then
		await flushPromises();
		expect(lightningTable.data).toEqual(getBoatsMock);
	});

	it('Should render the boats When Near Me tab is active', async() => {
		//Given
		const nearmeTab = element.shadowRoot.querySelector('.nearme');
		const boatsNearMe = element.shadowRoot.querySelector('c-boats-near-me')
		element.searchBoats(getBoatsMock[0].BoatType__c)
		
		//When
		nearmeTab.click();
		
		//Then
		await flushPromises();
		expect(boatsNearMe.boatTypeId).toBe(getBoatsMock[0].BoatType__c);
	});

	it('Should show toast error or wire method', async() => {
		//Given
		const mockError = { body: { message: 'Some error' }, status: 500 };
		const toastHandler = jest.fn();
		element.addEventListener('lightning__showtoast', toastHandler);
		
		//When
		getBoats.error(mockError);
		
		//Then
		await flushPromises();
		expect(toastHandler).toHaveBeenCalledTimes(1);

		const toastEvent = toastHandler.mock.calls[0][0];
		expect(toastEvent.detail).toEqual({
			title: 'Error',
			message: 'Getting error while fetching boats',
			variant: 'error'
		});
	});



	it('should dispatch success toast when updateBoatList succeeds', async () => {
		// Mock Apex success
		updateBoatList.mockResolvedValue({});

		// Add toast listener
		const toastHandler = jest.fn();
		element.addEventListener('lightning__showtoast', toastHandler);

		// Simulate save event
		const datatable = element.shadowRoot.querySelector('lightning-datatable');
		const saveEvent = new CustomEvent('save', {
			detail: { draftValues: getBoatsMock[0] },
			bubbles: true,
			composed: true
		});
		datatable.dispatchEvent(saveEvent);

		await flushPromises();

		// Assertions
		expect(toastHandler).toHaveBeenCalledTimes(1);

		const toastEvent = toastHandler.mock.calls[0][0];
		expect(toastEvent.detail).toEqual({
			title: 'Success',
			message: 'Data saved successfully',
			variant: 'success'
		});
	});


	it('should dispatch err toast when updateBoatList failed', async () => {
		// Mock Apex success
		const mockError = 'Something went wrong';
		updateBoatList.mockRejectedValue(mockError);


		// Add toast listener
		const toastHandler = jest.fn();
		element.addEventListener('lightning__showtoast', toastHandler);

		// Simulate save event
		const datatable = element.shadowRoot.querySelector('lightning-datatable');
		const saveEvent = new CustomEvent('save', {
			detail: { draftValues: getBoatsMock[0] },
			bubbles: true,
			composed: true
		});
		datatable.dispatchEvent(saveEvent);

		await flushPromises();

		// Assertions
		expect(toastHandler).toHaveBeenCalledTimes(1);

		const toastEvent = toastHandler.mock.calls[0][0];
		expect(toastEvent.detail).toEqual({
			title: 'Error',
			message: 'Error while saving data '+mockError,
			variant: 'error'
		});
	});


	it('should call publish with correct payload and message channel', async() => {

		const context = 'context';
		MessageContext.emit(context);
		const boatTile = element.shadowRoot.querySelector('c-boat-tile');
		const event = new CustomEvent('boatselect', {
			detail: {
				boatId: 'testId'
			},
			bubbles: true,
			composed: true
		});
		
		// 🔥 Dispatch event
		boatTile.dispatchEvent(event);
		
		await flushPromises();
		console.log(publish.mock.calls[0]);
		
		// ✅ Assert publish was called correctly
		expect(publish).toHaveBeenCalledWith(
			context,
			BOATMC,
			{ recordId: 'testId' }
		);
	});
});