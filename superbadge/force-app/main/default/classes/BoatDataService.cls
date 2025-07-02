public with sharing class BoatDataService implements API{

	public final String LENGTH_TYPE = 'Length'; 
	public final String PRICE_TYPE = 'Price'; 
	public final String TYPE_TYPE = 'Type'; 

	public interface API {
		List<Boat__c> getSimilarBoats(Id boatId, String similarBy);
		String updateBoatList(Object data);
	}

	public static API getInstance()
	{
		return (API) Application.Service().newInstance(API.class);
	}

	public List<Boat__c> getSimilarBoats(Id boatId, String similarBy) {
		Boat__c parentBoat = new BoatsSelector().getBoatById(boatId);
		if (parentBoat == null) return new List<Boat__c>();

		if (similarBy == LENGTH_TYPE) {
			return new BoatsSelector().getBoatsByLength(parentBoat);
		} else if (similarBy == PRICE_TYPE) {
			return new BoatsSelector().getBoatsByPrice(parentBoat);
		} else if (similarBy == TYPE_TYPE) {
			return new BoatsSelector().getBoatsByType(parentBoat);
		}

		return new List<Boat__c>();
	}

	// Assume this may be an API that return this data, not a SOQL query

	public String updateBoatList(Object data){
		List<Boat__c> boatsForUpdate = (List<Boat__c>) JSON.deserialize(
			JSON.serialize(data),
			List<Boat__c>.class
		);
		
		update boatsForUpdate;
		return 'Success: Boats updated successfully';
	}
}