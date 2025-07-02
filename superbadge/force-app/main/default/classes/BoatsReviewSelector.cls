public with sharing class BoatsReviewSelector extends fflib_SObjectSelector implements API {

	public interface API extends fflib_ISObjectSelector {
		List<BoatReview__c> getReviews(Id boatId);
	}

	public static API getInstance()
    {
        return (API) Application.Selector().newInstance(BoatReview__c.SObjectType);
    }

	public List<BoatReview__c> getReviews(Id boatId) {
		String query = String.format(
			'SELECT {0} FROM {1} WHERE Boat__c = :boatId ORDER BY {2}',
			new List<String> {
				getFieldListString(),
				getSObjectName(),
				getOrderBy()
			}
		);

		return (List<BoatReview__c>) Database.query(query);

		// return [
		// 	SELECT
		// 		Id,
		// 		Name,
		// 		Comment__c,
		// 		Rating__c,
		// 		LastModifiedDate,
		// 		CreatedDate,
		// 		CreatedBy.Name,
		// 		CreatedBy.SmallPhotoUrl,
		// 		CreatedBy.CompanyName
		// 	FROM
		// 		BoatReview__c
		// 	WHERE
		// 		Boat__c =:boatId
		// 	//WITH SECURITY_ENFORCED
		// 	ORDER BY
		// 		CreatedDate DESC
		// ];
	}

	public List<Schema.SObjectField> getSObjectFieldList() {
		return new List<Schema.SObjectField> {
			BoatReview__c.Id,
			BoatReview__c.Name,
			BoatReview__c.Comment__c,
			BoatReview__c.Rating__c,
			BoatReview__c.LastModifiedDate,
			BoatReview__c.CreatedDate,
			BoatReview__c.CreatedBy.Name
			// BoatReview__c.CreatedBy.SmallPhotoUrl
			// BoatReview__c.CreatedBy.CompanyName
		};
	}

	public Schema.SObjectType getSObjectType() {
		return BoatReview__c.sObjectType;
	}

	public override String getOrderBy() {
		return 'CreatedDate DESC';
	}
}