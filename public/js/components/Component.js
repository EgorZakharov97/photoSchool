export default class Component {

    constructor() {
        if (this.constructor === Component) throw new TypeError("Can not construct abstract class.");
    }

    loadData(){
        throw new TypeError("Abstract method loadData() is not implemented");
    }

    getData() {
        throw new TypeError("Abstract method getData() is not implemented");
    }

    show(){
        throw new TypeError("Abstract method show() is not implemented");
    }

    hide(){
        throw new TypeError("Abstract method hide() is not implemented");
    }
}

Component.component = {}