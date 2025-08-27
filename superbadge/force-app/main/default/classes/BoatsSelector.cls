public with sharing class BoatsSelector extends fflib_SObjectSelector implements BoatsSelector.API {

	public final String LENGTH_TYPE = 'Length'; 
	public final String PRICE_TYPE = 'Price'; 
	public final String TYPE_TYPE = 'Type'; 

	public interface API extends fflib_ISObjectSelector {
		List<Boat__c> getAllBoats();
		List<Boat__c> getBoatsByType(String boatTypeId);
		String getBoatsByLocation(Decimal latitude, Decimal longitude);
		String getBoatsByLocationAndBoatType(Decimal latitude, Decimal longitude, String boatTypeId);
		Boat__c getBoatById(Id boatId);
		List<Boat__c> getBoatsByLength(Boat__c boat);
		List<Boat__c> getBoatsByPrice(Boat__c boat);
		List<Boat__c> getBoatsByType(Boat__c boat);
	}

	public static BoatsSelector.API getInstance()
    {
        return (BoatsSelector.API) Application.Selector().newInstance(Boat__c.SObjectType);
    }

	public List<Boat__c> getAllBoats() {
		// Without an explicit boatTypeId, the full list is desired
		String query = string.format(
			'SELECT {0} FROM {1}',
			new List<String> {
				getFieldListString(),
				getSObjectName()
			});
		return Database.query(query);
	}

	public List<Boat__c> getBoatsByType(String boatTypeId) {
		String query = string.format(
			'SELECT {0} FROM {1} WHERE BoatType__c = :boatTypeId WITH SECURITY_ENFORCED',
			new List<String> {
				getFieldListString(),
				getSObjectName()
			});
		return (List<Boat__c>)Database.query(query);
	}


    public String getBoatsByLocation(Decimal latitude, Decimal longitude) {
        // Without an explicit boatTypeId, the full list is desired
        String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c ';
        query += 'WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
        return JSON.serialize(Database.query(query));
    }

	public String getBoatsByLocationAndBoatType(Decimal latitude, Decimal longitude, String boatTypeId) {
		String query = 'SELECT Name, Geolocation__Latitude__s, Geolocation__Longitude__s FROM Boat__c '+
						'WHERE BoatType__c = :boatTypeId '+
						' WITH SECURITY_ENFORCED ORDER BY DISTANCE(Geolocation__c, GEOLOCATION(:latitude, :longitude), \'mi\') LIMIT 10';
		return JSON.serialize(Database.query(query));
	}

	public Boat__c getBoatById(Id boatId) {
		List<Boat__c> boats = [
			SELECT Id, Length__c, Price__c, BoatType__c, BoatType__r.Name
			FROM Boat__c
			WHERE Id = :boatId
			WITH SECURITY_ENFORCED
			LIMIT 1
		];
		return boats.isEmpty() ? null : boats[0];
	}

	public List<Boat__c> getBoatsByLength(Boat__c boat) {
		String query = String.format('select {0} FROM {1} WHERE Id != :boat.Id'
			+' AND (Length__c >= :boat.Length__c / 1.2)'
			+' AND (Length__c <= :boat.Length__c * 1.2)'
			+'WITH SECURITY_ENFORCED ORDER BY Length__c, Price__c, Year_Built__c', 
			new List<String> {
				getFieldListString(),
				getSObjectName()
			});
		return  (List<Boat__c>)Database.query(query);
	}

	public List<Boat__c> getBoatsByPrice(Boat__c boat) {

		String query = String.format('select {0} FROM {1} WHERE Id != :boat.Id'
			+' AND (Price__c >= :boat.Price__c / 1.2)'
			+' AND (Price__c <= :boat.Price__c * 1.2)'
			+'WITH SECURITY_ENFORCED ORDER BY Price__c, Length__c, Year_Built__c', 
			new List<String> {
				getFieldListString(),
				getSObjectName()
			});
		return  (List<Boat__c>)Database.query(query);
	}

	public List<Boat__c> getBoatsByType(Boat__c boat) {

		String query = String.format('select {0} FROM {1} WHERE Id != :boat.Id'
			+' AND (BoatType__c = :boat.BoatType__c)'
			+'WITH SECURITY_ENFORCED ORDER BY Price__c, Length__c, Year_Built__c', 
			new List<String> {
				getFieldListString(),
				getSObjectName()
			});
		return  (List<Boat__c>)Database.query(query);
	}


	public List<Schema.SObjectField> getSObjectFieldList() {
		return new List<Schema.SObjectField> {
			Boat__c.Id,
			Boat__c.Name,
			Boat__c.Description__c,
			Boat__c.Geolocation__Latitude__s,
			Boat__c.Geolocation__Longitude__s,
			Boat__c.Picture__c,
			Boat__c.Contact__r.Name,
			Boat__c.BoatType__c,
			Boat__c.BoatType__r.Name,
			Boat__c.Length__c,
			Boat__c.Price__c,
			Boat__c.Year_Built__c
		};
	}

	public Schema.SObjectType getSObjectType() {
		return Boat__c.sObjectType;
	}
}