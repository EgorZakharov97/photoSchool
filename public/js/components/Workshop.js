import Component from './Component.js';

export default class Workshop extends Component {
    
    static template = $('#course-home');
    static monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    constructor(workshop = {}) {
        super()
        // Workshop.template.hide();
        this.data = workshop;
        this.component = Workshop.template.clone();
        this.fields = {
            name: $(this.component.find('[desc="name"]')),
            dateStarts: $(this.component.find('[desc="dateStart"]')),
            background: $(this.component.find('[desc="background"')),
            description: $(this.component.find('[desc="description"')),
            timeline: $(this.component.find('[desc="timeline"')),
            willLearn: $(this.component.find('[desc="willLearn"')),
            duration: $(this.component.find('[desc="duration"')),
            price: $(this.component.find('[desc="price"')),
            deadline: $(this.component.find('[desc="deadline"')),
            places: $(this.component.find('[desc="placesLeft"')),
        }
        workshop !== {} ? this.setContent() : false;
    }

    getComponent() {
        return this.component;
    }

    setData(newData){
        if(data) this.data = newData;
    }

    setContent(){
        // this.fields.name.text(this.data.name);
        // this.fields.dateStarts.text(
        //     Workshop.monthNames[new Date(this.data.importantDates.courseStarts).getUTCMonth()]
        //     + ' ' +
        //     new Date(this.data.importantDates.courseStarts).getUTCDate());
        // this.fields.background.css('background-image', `-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0.5))), url('${this.data.image}')`);
        // this.fields.background.css('background-image', `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.data.image}')`);
        // this.fields.description.html(this.data.description);
        // this.fields.timeline.html(this.data.timeline);
        // this.fields.willLearn.html(this.data.willLearn);
        // this.fields.duration.text("" + new Date(new Date(this.data.importantDates.courseEnds) - new Date(this.data.importantDates.courseStarts)).getDate() + " Days");
        // this.fields.price.text(`$ ${this.data.pricing.finalPrice} CAD`);
        // this.fields.deadline.text(`${Workshop.monthNames[new Date(this.data.importantDates.registrationDeadline).getUTCMonth()]} ${new Date(this.data.importantDates.registrationDeadline).getUTCDate()}`)
        // this.fields.places.text(`${this.data.seats.total -this.data.seats.occupied}`)
    }

    show() {
        console.log("show")
        this.component.show();
    }

    hide() {
        this.component.hide();
    }
}