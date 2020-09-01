import Component from './Component.js';
import Workshop from './Workshop.js';

export default class CourseContainer extends Component {
    
    static template = $('#courses-container');

    constructor(workshops=[], discount=null, handleRegister) {
        super({workshops: workshops, discount: discount}, {handleRegister});
    }

    setComponent() {
        this.component = CourseContainer.template;
    }

    setFields() {
        
    }

    setContent() {
        this.data.workshops.map(workshop => {
            return new Promise((res, rej) => {
                let workshopComponent = new Workshop(workshop, this.data.discount, this.handlers.handleRegister);
                this.component.append(workshopComponent.getComponent());
                workshopComponent.show();
                res();
            })
        })
    }
}