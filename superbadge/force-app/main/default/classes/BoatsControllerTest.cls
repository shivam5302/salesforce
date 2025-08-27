@isTest
public class BoatsControllerTest {
	@isTest
	private static void getBoats_BoatTypeIdEmpty_ShouldReturnAllBoats(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		// BoatsSelector.API selectorMock = new Mocks.BoatsSelector(mocks);
		BoatsSelector.API selectorMock = (BoatsSelector.API)mocks.mock(BoatsSelector.class);

		Boat__c boat = new Boat__c(
			Id=fflib_IDGenerator.generate(Boat__c.SobjectType),
			Name='Albert Leichhardt',
			Description__c='A boat that is so much fun, the world will speak for her.',
			Geolocation__Latitude__s=-17.651486,
			Geolocation__Longitude__s=139.727076,
			Picture__c='/resource/Houseboats/jetski1.png',
			BoatType__c='a01Bh00000DjTMeIAN',
			Length__c=5,
			Price__c=562,
			Year_Built__c=2007
		);
		List<Boat__c> boats = new List<Boat__c>{boat};

		mocks.startStubbing();
		mocks.when(selectorMock.getAllBoats()).thenReturn(boats);
		mocks.when(selectorMock.sObjectType()).thenReturn(Boat__c.sObjectType);
		mocks.stopStubbing();
		
		system.debug(selectorMock);
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		List<Boat__c> ActualBoats = BoatsController.getBoats('');
		system.debug(ActualBoats);

		//Then
		((BoatsSelector.API)mocks.verify(selectorMock,1)).getAllBoats();

	}

	@isTest
	private static void getBoats_BoatTypeIdPresent_ShouldReturnBoatTypeBoats(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		// BoatsSelector.API selectorMock = new Mocks.BoatsSelector(mocks);
		BoatsSelector.API selectorMock = (BoatsSelector.API)mocks.mock(BoatsSelector.class);

		Boat__c boat = new Boat__c(
			Id=fflib_IDGenerator.generate(Boat__c.SobjectType),
			Name='Albert Leichhardt',
			Description__c='A boat that is so much fun, the world will speak for her.',
			Geolocation__Latitude__s=-17.651486,
			Geolocation__Longitude__s=139.727076,
			Picture__c='/resource/Houseboats/jetski1.png',
			BoatType__c='a01Bh00000DjTMeIAN',
			Length__c=5,
			Price__c=562,
			Year_Built__c=2007
		);
		List<Boat__c> boats = new List<Boat__c>{boat};

		mocks.startStubbing();
		mocks.when(selectorMock.getBoatsByType('test')).thenReturn(boats);
		mocks.when(selectorMock.sObjectType()).thenReturn(Boat__c.sObjectType);
		mocks.stopStubbing();
		
		system.debug(selectorMock);
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		List<Boat__c> ActualBoats = BoatsController.getBoats('test');
		system.debug(ActualBoats);

		//Then
		((BoatsSelector.API)mocks.verify(selectorMock,1)).getBoatsByType('test');

	}

	@isTest
	private static void getBoatTypes_ShouldReturnBoatTypes(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		// BoatsSelector.API selectorMock = new Mocks.BoatsSelector(mocks);
		BoatsTypeSelector.API selectorMock = (BoatsTypeSelector.API)mocks.mock(BoatsTypeSelector.class);

		BoatType__c boatType = new BoatType__c(
			Name='Test',
			Id=fflib_IDGenerator.generate(BoatType__c.SobjectType)
		);
		List<BoatType__c> boatTypes = new List<BoatType__c>{boatType};

		mocks.startStubbing();
		mocks.when(selectorMock.getBoatTypes()).thenReturn(boatTypes);
		mocks.when(selectorMock.sObjectType()).thenReturn(BoatType__c.sObjectType);
		mocks.stopStubbing();
		
		system.debug(selectorMock);
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		List<BoatType__c> ActualBoats = BoatsController.getBoatTypes();
		system.debug(ActualBoats);

		//Then
		((BoatsTypeSelector.API)mocks.verify(selectorMock,1)).getBoatTypes();

	}

	@isTest
	private static void getBoatsByLocation_BoatTypeIdEmpty_ShouldReturnAllNearByBoats(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		// BoatsSelector.API selectorMock = new Mocks.BoatsSelector(mocks);
		BoatsSelector.API selectorMock = (BoatsSelector.API)mocks.mock(BoatsSelector.class);

		Boat__c boat = new Boat__c(
			Id=fflib_IDGenerator.generate(Boat__c.SobjectType),
			Name='Albert Leichhardt',
			Description__c='A boat that is so much fun, the world will speak for her.',
			Geolocation__Latitude__s=-17.651486,
			Geolocation__Longitude__s=139.727076,
			Picture__c='/resource/Houseboats/jetski1.png',
			BoatType__c='a01Bh00000DjTMeIAN',
			Length__c=5,
			Price__c=562,
			Year_Built__c=2007
		);
		List<Boat__c> boats = new List<Boat__c>{boat};

		mocks.startStubbing();
		mocks.when(selectorMock.getBoatsByLocation(1234.23,5678.23)).thenReturn(JSON.serialize(boats));
		mocks.when(selectorMock.sObjectType()).thenReturn(Boat__c.sObjectType);
		mocks.stopStubbing();
		
		system.debug(selectorMock);
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		String ActualBoats = BoatsController.getBoatsByLocation(1234.23,5678.23,'');

		//Then
		((BoatsSelector.API)mocks.verify(selectorMock,1)).getBoatsByLocation(1234.23,5678.23);

	}

	@isTest
	private static void getBoatsByLocation_BoatTypeIdPresent_ShouldReturnAllNearByBoats(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		BoatsSelector.API selectorMock = (BoatsSelector.API)mocks.mock(BoatsSelector.class);

		Boat__c boat = new Boat__c(
			Id=fflib_IDGenerator.generate(Boat__c.SobjectType),
			Name='Albert Leichhardt',
			Description__c='A boat that is so much fun, the world will speak for her.',
			Geolocation__Latitude__s=-17.651486,
			Geolocation__Longitude__s=139.727076,
			Picture__c='/resource/Houseboats/jetski1.png',
			BoatType__c='a01Bh00000DjTMeIAN',
			Length__c=5,
			Price__c=562,
			Year_Built__c=2007
		);
		List<Boat__c> boats = new List<Boat__c>{boat};

		mocks.startStubbing();
		mocks.when(selectorMock.getBoatsByLocationAndBoatType(1234.23,5678.23,'test')).thenReturn(JSON.serialize(boats));
		mocks.when(selectorMock.sObjectType()).thenReturn(Boat__c.sObjectType);
		mocks.stopStubbing();
		
		system.debug(selectorMock);
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		String ActualBoats = BoatsController.getBoatsByLocation(1234.23,5678.23,'test');

		//Then
		((BoatsSelector.API)mocks.verify(selectorMock,1)).getBoatsByLocationAndBoatType(1234.23,5678.23,'test');

	}

	@isTest
	private static void getBoatReviews_BoatIdEmpty_ShouldReturnEmptyReviewList(){
		//Given
		List<BoatReview__c> ExpectedBoatsReviews = new List<BoatReview__c>{};

		//When
		List<BoatReview__c> ActualBoatsReviews = BoatsController.getBoatReviews('');

		//Then
		system.assertEquals(ExpectedBoatsReviews, ActualBoatsReviews, 'We should return an empty list of reviews');

	}

	@isTest
	private static void getBoatReviews_BoatIdPresent_ShouldReturnAllReviews(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		BoatsReviewSelector.API selectorMock = (BoatsReviewSelector.API)mocks.mock(BoatsReviewSelector.class);

		BoatReview__c boatReview = new BoatReview__c(
			Boat__c=fflib_IDGenerator.generate(Boat__c.SobjectType),
			Id=fflib_IDGenerator.generate(BoatReview__c.SobjectType),
			Comment__c='A boat that is so much fun, the world will speak for her.',
			Rating__c=5
		);
		List<BoatReview__c> boatReviews = new List<BoatReview__c>{boatReview};

		mocks.startStubbing();
		mocks.when(selectorMock.getReviews(boatReview.Boat__c)).thenReturn(boatReviews);
		mocks.when(selectorMock.sObjectType()).thenReturn(BoatReview__c.sObjectType);
		mocks.stopStubbing();
		
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		List<BoatReview__c> ActualBoats = BoatsController.getBoatReviews(boatReview.Boat__c);

		//Then
		((BoatsReviewSelector.API)mocks.verify(selectorMock,1)).getReviews(boatReview.Boat__c);

	}

	@isTest
	private static void getSimilarBoats_BoatIdPresent_ShouldReturnAllReviews(){
		//Given
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		BoatsSelector.API selectorMock = (BoatsSelector.API)mocks.mock(BoatsSelector.class);

		// BoatReview__c boatReview = new BoatReview__c(
		// 	Boat__c=fflib_IDGenerator.generate(Boat__c.SobjectType),
		// 	Id=fflib_IDGenerator.generate(BoatReview__c.SobjectType),
		// 	Comment__c='A boat that is so much fun, the world will speak for her.',
		// 	Rating__c=5
		// );
		// List<BoatReview__c> boatReviews = new List<BoatReview__c>{boatReview};

		mocks.startStubbing();
		mocks.when(selectorMock.getSimilarBoats('test','length')).thenReturn(boatReviews);
		mocks.when(selectorMock.sObjectType()).thenReturn(Boat__c.sObjectType);
		mocks.stopStubbing();
		
		Test.startTest();
		Application.Selector().setMock(selectorMock);
		Test.stopTest();

		//When
		List<BoatReview__c> ActualBoats = BoatsController.getBoatReviews(boatReview.Boat__c);

		//Then
		((BoatsSelector.API)mocks.verify(selectorMock,1)).getReviews(boatReview.Boat__c);

	}
}