export default class Component {

    static template;

    constructor(data, handlers) {
        if (this.constructor === Component){
            throw new TypeError("Can not construct abstract class.");
        } else {
            this.data = data;
            if (handlers) this.handlers = handlers
            this.setComponent();
            this.setFields();
            if (data) this.setContent();
        }
    }

    setComponent() {
        throw new TypeError("Abstract method setComponent() is not implemented");
    }

    setFields() {
        throw new TypeError("Abstract method setFields() is not implemented");
    }

    setData(data) {
        if (this.constructor === Component){
            throw new TypeError("Abstract method setData(data) is not implemented");
        } else {
            if (data) this.data = data;
        }
    }

    setContent() {
        throw new TypeError("Abstract method setContent() is not implemented");
    }

    getComponent() {
        if (this.constructor === Component){
            throw new TypeError("Abstract method getComponent() is not implemented");
        } else {
            return this.component;
        }
    }

    show() {
        if (this.constructor === Component){
            throw new TypeError("Abstract method show() is not implemented");
        } else {
            this.component.show();
        }
    }

    hide() {
        if (this.constructor === Component){
            throw new TypeError("Abstract method hide() is not implemented");
        } else {
            this.component.hide();
        }
    }
}

Component.component = {}