import { LightningElement, api, track } from 'lwc';
import { TILE_WRAPPER_SELECTED_CLASS, TILE_WRAPPER_UNSELECTED_CLASS } from './constants';

export default class BoatTile extends LightningElement {
    @api boat;
    selectedBoatId;
    
    connectedCallback(){
        debugger;
        console.log(JSON.stringify(this.boat));
    }

    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return `background-image:url(${this.boat.Picture__c})`;
    }

    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        debugger;
        return this.selectedBoatId === this.boat.Id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
    }

    // Fires event with the Id of the boat that has been selected.
    selectBoat(event) {
        this.selectedBoatId = this.boat.Id;
        const boatselect = new CustomEvent('boatselect', {
            detail: {
                boatId: this.boat.Id
            }
        });
        this.dispatchEvent(boatselect);
    }
}