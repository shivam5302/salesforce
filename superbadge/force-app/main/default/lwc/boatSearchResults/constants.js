


export const COLUMNS = [
    { label: 'Name', fieldName: 'Name', editable: true },
    { label: 'Length', fieldName: 'Length__c', editable: true },
    { label: 'Price', fieldName: 'Price__c', editable: true },
    { label: 'Description', fieldName: 'Description__c', editable: true }
];

export const TOAST = {
    SUCCESS: {
        VARIANT: 'success',
        TITLE: 'Success',
        MESSAGE: 'Data saved successfully',
    },
    ERROR: {
        VARIANT: 'error',
        TITLE: 'Error',
        MESSAGE: 'Error while saving data {0}'
    }

}