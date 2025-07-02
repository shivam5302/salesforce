public with sharing class BoatsController {
	
	@AuraEnabled(cacheable=true)
	public static List<Boat__c> getBoats(String boatTypeId){
		if(boatTypeId==''){
			return BoatsSelector.getInstance().getAllBoats();
		} else {
			return BoatsSelector.getInstance().getBoatsByType(boatTypeId);
		}
	}

	@AuraEnabled(cacheable=true)
	public static List<BoatType__c> getBoatTypes(){
		return BoatsTypeSelector.getInstance().getBoatTypes();
	}

	@AuraEnabled(cacheable=true)
	public static string getBoatsByLocation(Decimal latitude, Decimal longitude, String boatTypeId){
		
		if(boatTypeId==''){
			return BoatsSelector.getInstance().getBoatsByLocation(latitude,longitude);
		} else {
			return BoatsSelector.getInstance().getBoatsByLocationAndBoatType(latitude,longitude,boatTypeId);
		}

	}

	@AuraEnabled(cacheable=true)
	public static List<BoatReview__c> getBoatReviews(String boatId){
		if(boatId==''){
			return new List<BoatReview__c>{};
		}
		return BoatsReviewSelector.getInstance().getReviews(boatId);
	}

	@AuraEnabled(cacheable=true)
	public static List<Boat__c> getSimilarBoats(Id boatId, String similarBy){
		try {
			return BoatDataService.getInstance().getSimilarBoats(boatId,similarBy);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}

	@AuraEnabled
	public static string updateBoatList(Object data){
		try {
			return BoatDataService.getInstance().updateBoatList(data);
		} catch (Exception e) {
			throw new AuraHandledException(e.getMessage());
		}
	}
}