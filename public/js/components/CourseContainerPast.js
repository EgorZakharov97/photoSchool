import PastWorkshop from './PastWorkshop.js'
import Component from './Component.js'

export default class CourseContainerPast extends Component {
    
    static template = $('#courses-container-past');

    constructor(workshops=[]){
        super(workshops)
    }

    setComponent() {
        this.component = CourseContainerPast.template;
    }

    setFields() {
        
    }

    setContent() {
        this.data.map(workshop => {
            return new Promise((res, rej) => {
                let workshopComponent = new PastWorkshop(workshop, this.data.discount);
                this.component.append(workshopComponent.getComponent());
                workshopComponent.show();
                res();
            })
        })
    }
}