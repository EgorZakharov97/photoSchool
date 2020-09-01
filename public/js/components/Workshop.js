import Component from './Component.js';

export default class Workshop extends Component {
    
    static template = $('#course-home');
    static monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    constructor(workshop={}, discount='NAN', handleRegister) {
        super(workshop);
        this.data.discount = discount;
        this.handlers = {handleRegister}

        this.data.dateStarts = Workshop.monthNames[new Date(this.data.importantDates.courseStarts).getUTCMonth()]
        + ' ' +
        new Date(this.data.importantDates.courseStarts).getUTCDate();
    }

    setComponent() {
        this.component = Workshop.template.clone();
        Workshop.template.hide();
    }

    setFields() {
        this.fields = {
            name: $(this.component.find('[desc="name"]')),
            dateStarts: $(this.component.find('[desc="dateStarts"]')),
            background: $(this.component.find('[desc="background"')),
            description: $(this.component.find('[desc="description"')),
            timeline: $(this.component.find('[desc="timeline"')),
            willLearn: $(this.component.find('[desc="willLearn"')),
            duration: $(this.component.find('[desc="duration"')),
            price: $(this.component.find('[desc="price"')),
            deadline: $(this.component.find('[desc="deadline"')),
            places: $(this.component.find('[desc="placesLeft"')),
            register: $(this.component.find('[desc="register"]')),
            discount: $(this.component.find('[desc="discount"]')),
        }
    }

    setContent(){
        this.fields.name.text(this.data.name);
        this.fields.dateStarts.text(
            Workshop.monthNames[new Date(this.data.importantDates.courseStarts).getUTCMonth()]
            + ' ' +
            new Date(this.data.importantDates.courseStarts).getUTCDate());
        this.fields.background.css('background-image', `-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0.5))), url('${this.data.image}')`);
        this.fields.background.css('background-image', `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.data.image}')`);
        this.fields.description.html(this.data.richText.description);
        this.fields.timeline.html(this.data.richText.timeline);
        this.fields.willLearn.html(this.data.richText.willLearn);
        this.fields.duration.text("" + new Date(new Date(this.data.importantDates.courseEnds) - new Date(this.data.importantDates.courseStarts)).getDate() + " Days");
        this.fields.price.text(`$ ${this.data.pricing.finalPrice} CAD`);
        this.fields.deadline.text(`${Workshop.monthNames[new Date(this.data.importantDates.registrationDeadline).getUTCMonth()]} ${new Date(this.data.importantDates.registrationDeadline).getUTCDate()}`)
        this.fields.places.text(`${this.data.seats.total -this.data.seats.occupied}`)
        this.fields.register.click(this.handleRegister.bind(this))
        this.data.discount == 'NONE' ? 
            this.fields.discount.parent().hide() :
            this.fields.discount.text(this.data.discount);
    }

    handleRegister() {
        this.handlers.handleRegister(this.data)
    }
}