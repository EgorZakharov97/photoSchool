import Component from './Component.js';
import Workshop from './Workshop.js';

export default class CourseContainer extends Component {
    
    static component = $('#courses-container');

    constructor(workshops = [], discount = null) {
        super();
        this.data = {
            workshops: workshops,
            discount: discount,
        }
        this.populateWorkshops();
    }

    populateWorkshops() {
        this.data.workshops.map(workshop => {
            let workshopComponent = new Workshop(workshop);
            CourseContainer.component.append(workshopComponent.getComponent());
            workshopComponent.show();
        })
    }
}