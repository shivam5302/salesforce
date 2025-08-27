import { createElement } from 'lwc';
import BoatDetailTabs from 'c/boatDetailTabs';
import { getRecord } from 'lightning/uiRecordApi'
import { subscribe } from 'lightning/messageService';


jest.mock('c/fiveStarRating')

jest.mock('lightning/messageService', () => {
	return {
		subscribe: jest.fn(),
		APPLICATION_SCOPE: { APPLICATION_SCOPE: true },
		MessageContext: jest.fn()
	};
});

const mockCustomEvent = CustomEvent;
jest.mock(
	'lightning/navigation',
	() => {
	  const result = {};
  
	  const Navigate = Symbol("Navigate");
  
	  const NavigationMixin = (Base) => {
		return class extends Base {
		  [Navigate](navigateArg){
			this.dispatchEvent(new mockCustomEvent('navigate', {detail:navigateArg}));
		  }
		};
	  };
	  NavigationMixin.Navigate = Navigate;
  
	  result.NavigationMixin = NavigationMixin;
  
	  return result;
	},
	{ virtual: true }
  );

jest.mock('lightning/uiRecordApi',
	() => {
		const { createApexTestWireAdapter } = require('@salesforce/sfdx-lwc-jest');
		return {
			getRecord: createApexTestWireAdapter(jest.fn()),
			getFieldValue: (boat,field) => {
				
				return boat?.fields.Name.value;
			}
		};
	},
	{ virtual: true }
)

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-boat-detail-tabs', () => {
	let element;

	beforeEach(async () => {
		element = createElement('c-boat-detail-tabs', {
			is: BoatDetailTabs
		});
		document.body.appendChild(element);

		await flushPromises()
		const mockMessage = { recordId: 'abc123' };
		const messageCallback = subscribe.mock.calls[0][2];
		messageCallback(mockMessage);
	});

	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		subscribe.mockClear();
	});

	it('should set boat data when getRecord returns data', async () => {
		//Given
		const mockData = {
			fields: {
				Name: { value: 'Test Boat' }
			}
		};

		//When
		getRecord.emit(mockData);
		//Then
		await Promise.resolve();
		// expect(card.title).toBe('Test Boat');
		expect(element).toMatchSnapshot();
	});

	it('should navigate to the boat detail standard page', async () => {
		//Given
		await flushPromises();
		const lighntingButton = element.shadowRoot.querySelector('lightning-button');
		const event = new CustomEvent('click',{detail:''});
		debugger;

		const navigateHandler = jest.fn();
		element.addEventListener('navigate', navigateHandler);
		
		//When
		lighntingButton.dispatchEvent(event);

		//Then
		expect(navigateHandler.mock.calls[0][0].detail).toEqual({
			type: 'standard__recordPage',
			attributes: { objectApiName: 'Boat__c', recordId: "abc123", actionName: 'view' }
		  })

	});
});