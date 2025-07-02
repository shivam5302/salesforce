import { LightningElement, api } from 'lwc'
import html from './fiveStarRating.html'

export default class FiveStarRating extends LightningElement {
	@api
	readOnly;
	@api
	value;

	render() {
		return html
	}
}