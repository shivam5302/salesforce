
import ID_FIELD from '@salesforce/schema/Boat__c.Id'
import NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import Description_FIELD from '@salesforce/schema/Boat__c.Description__c';


const BOAT_FIELDS = {
	ID_FIELD,
	NAME_FIELD,
	TYPE_FIELD,
	LENGTH_FIELD,
	PRICE_FIELD,
	Description_FIELD
};

export {
	BOAT_FIELDS
}