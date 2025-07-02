import { createElement } from 'lwc';
import BoatSearch from 'c/boatSearch';
// import { NavigationMixin } from 'lightning/navigation';


jest.mock('c/boatSearchResults');
jest.mock('c/boatSearchForm');

const mockCustomEvent = CustomEvent;

jest.mock(
	'lightning/navigation',
	() => {
	  //-- see the sfdx-lwc-jest implementation for the default mock used without using mocks
	  //-- https://github.com/salesforce/sfdx-lwc-jest/blob/master/src/lightning-stubs/navigation/navigation.js
  
	  const result = {};
  
	  result.CurrentPageReference = jest.fn();
  
	  const Navigate = Symbol("Navigate");
	  const GenerateUrl = Symbol("GenerateUrl");
  
	  const NavigationMixin = (Base) => {
		return class extends Base {
		  [Navigate](navigateArg){
			this.dispatchEvent(new mockCustomEvent('navigate', {detail:navigateArg}));
		  }
		  [GenerateUrl](){
			this.dispatchEvent(new mockCustomEvent('generate'));
		  }
		};
	  };
	  NavigationMixin.Navigate = Navigate;
	  NavigationMixin.GenerateUrl = GenerateUrl;
  
	  result.NavigationMixin = NavigationMixin;
  
	  return result;
	},
	{ virtual: true }
  );

const flushPromises = async () => new Promise((resolve) => setTimeout(resolve, 0));

describe('c-boat-search', () => {
	let element;

	beforeEach(() => {
		// Create the element and append it to the DOM
		element = createElement('c-boat-search', {
			is: BoatSearch,
		});
		document.body.appendChild(element);
	});

	afterEach(() => {
		// Reset the DOM to clean up between tests
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it('Should show a spinner when loading', () => {
		//Given
		const boatSearchResult = element.shadowRoot.querySelector('c-boat-search-results');
		const event = new CustomEvent('loading');

		//When
		boatSearchResult.dispatchEvent(event);

		//Then
		const lightningSpinner = element.shadowRoot.querySelector('lightning-spinner');
		expect(lightningSpinner).toBeDefined();

	});

	it('Should hide  spinner when loading is done', () => {
		//Given
		const boatSearchResult = element.shadowRoot.querySelector('c-boat-search-results');
		const event = new CustomEvent('doneloading');

		//When
		boatSearchResult.dispatchEvent(event);

		//Then
		const lightningSpinner = element.shadowRoot.querySelector('lightning-spinner');
		expect(lightningSpinner).toBeNull();

	})

	it('Should call search to show results', () => {
		//Given
		const searchForm = element.shadowRoot.querySelector('c-boat-search-form');
		const event = new CustomEvent('search', {
			detail: {
				boatTypeId: '123'
			}
		});
		const boatSearchResult = element.shadowRoot.querySelector('c-boat-search-results');
		boatSearchResult.searchBoats = jest.fn();

		//When
		searchForm.dispatchEvent(event);

		//Then
		expect(boatSearchResult.searchBoats).toHaveBeenCalledWith('123');

	});

	it('calls NavigationMixin.Navigate with correct params when createNewBoat is called', async() => {

		const navigateHandler = jest.fn();
		element.addEventListener('navigate', navigateHandler);
		
		const lightningButton = element.shadowRoot.querySelector('lightning-button');

		const navigateEvt = new CustomEvent('click');
		
		// Call the method
		// lightningButton.click();
		lightningButton.dispatchEvent(navigateEvt);


		// Assert navigation
		await flushPromises();
		console.log(navigateHandler.mock.calls[0][0].detail)
		expect(navigateHandler).toHaveBeenCalled();
		expect(navigateHandler.mock.calls[0][0].detail).toEqual({
			type: 'standard__objectPage',
			attributes: { objectApiName: 'Boat__c', actionName: 'new' }
		  });
	});

});
