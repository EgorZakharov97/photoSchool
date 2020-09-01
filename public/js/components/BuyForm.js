import Component from './Component.js'

export default class BuyForm extends Component {
    static template = $('#section-buy')

    constructor(workshop, verifyCoupon, toCheckout){
        super(workshop, {verifyCoupon, toCheckout});
    }

    setComponent() {
        this.component = BuyForm.template;
    }

    setFields() {
        this.fields = {
            name: $(this.component.find('[desc="name"]')),
            starts: $(this.component.find('[desc="starts"]')),
            price: $(this.component.find('[desc="price"]')),
            email: $(this.component.find('[desc="email"]')),
            fastRegister: $(this.component.find('[desc="fast-register"]')),
            apply: $(this.component.find('[desc="coupon-form"]')),
            checkout: $(this.component.find('[desc="checkout"]')),
            background: $(this.component.find('[desc="background"]')),
            close: $(this.component.find('[desc="close"]')),
            success: $(this.component.find('[desc="success"]')),
            error: $(this.component.find('[desc="error"]')),
        }
    }

    setContent() {
        this.fields.name.text(this.data.name);
        this.fields.starts.text(this.data.dateStarts);
        this.fields.email.parent().hide();
        this.fields.fastRegister.show();
        this.fields.apply.submit(this.verifyCoupon.bind(this))
        this.fields.checkout.click(this.toCheckout.bind(this))
        this.fields.background.css('background-image', `-webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0.5))), url('${this.data.image}')`);
        this.fields.background.css('background-image', `linear-gradient(180deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.data.image}')`);
        this.fields.close.click(this.closeWindow.bind(this))
    }

    show(){
        this.component.css('display', 'flex');
    }

    verifyCoupon(e) {
        let coupon = $(e.target).find('[name="coupon"]').val();
        $.post('/buy/checkCoupon', {coupon}, (res) => {
            console.log(res)
        })
    }

    toCheckout() {
        alert('to checkout')
    }

    closeWindow() {
        this.component.hide();
    }
}