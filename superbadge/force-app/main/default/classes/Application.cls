public class Application
{
	@TestVisible
	private static fflib_Application.SelectorFactory Selector;
	@TestVisible
	private static fflib_Application.ServiceFactory Service;
	// Configure and create the ServiceFactory for this Application


	public static fflib_Application.SelectorFactory Selector() {
		if (selector==null) {
			Selector = new fflib_Application.SelectorFactory(
			new Map<SObjectType, Type> {
				Boat__c.SObjectType => BoatsSelector.class,
				BoatReview__c.SObjectType => BoatsReviewSelector.class,
				BoatType__c.SObjectType => BoatsTypeSelector.class
			});
		}
		return selector;
	}

	public static fflib_Application.ServiceFactory Service(){
		if (Service==null) {
			Service =
			new fflib_Application.ServiceFactory(
				new Map<Type, Type> {
					BoatDataService.API.class => BoatDataService.class
				});
		}
		return Service;
	}

}