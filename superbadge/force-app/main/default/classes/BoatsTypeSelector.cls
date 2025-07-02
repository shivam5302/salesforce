public with sharing class BoatsTypeSelector extends fflib_SObjectSelector implements API {

	public interface API extends fflib_ISObjectSelector {
		List<BoatType__c> getBoatTypes();
	}

	public static API getInstance()
	{
		return (API) Application.Selector().newInstance(BoatType__c.SObjectType);
	}

	public List<BoatType__c> getBoatTypes() {
		String query = String.format(
			'SELECT {0} FROM {1} ' +
			'WITH SECURITY_ENFORCED ORDER BY {2}',
			new List<String> {
				getFieldListString(),
				getSObjectName(),
				getOrderBy()
			}
		);
	return (List<BoatType__c>) Database.query(query);
	// return [SELECT Name, Id FROM BoatType__c WITH SECURITY_ENFORCED ORDER BY Name];
	}

	public List<Schema.SObjectField> getSObjectFieldList() {
		return new List<Schema.SObjectField> {
			BoatType__c.Id,
			BoatType__c.Name
		};
	}

	public Schema.SObjectType getSObjectType() {
		return BoatType__c.sObjectType;
	}

	public override String getOrderBy() {
		return 'Name';
	}
}