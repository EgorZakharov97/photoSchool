import Workshop from './Workshop.js'

export default class PastWorkshop extends Workshop {
    static template = $('#portal-past')

    constructor(workshop={}, discount='NAN') {
        super(workshop, discount)        
    }

    setComponent() {
        this.component = PastWorkshop.template.clone();
        PastWorkshop.template.hide();
    }

    setFields() {
        this.fields = {
            name: $(this.component.find('[desc="name"]')),
            dateStarts: $(this.component.find('[desc="dateStarts"]')),
            background: $(this.component.find('[desc="background"')),
            description: $(this.component.find('[desc="description"')),
        }
    }

    setContent() {
        console.log($(this.component.find('[desc="name"]')))
        this.fields.name.text(this.data.name);
        this.fields.dateStarts.text(
            Workshop.monthNames[new Date(this.data.importantDates.courseStarts).getUTCMonth()]
            + ' ' +
            new Date(this.data.importantDates.courseStarts).getUTCDate());
        this.fields.background.css('background-image', `-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0.5))), url('${this.data.image}')`);
        this.fields.background.css('background-image', `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.data.image}')`);
        this.fields.description.html(this.data.richText.description);
    }
}