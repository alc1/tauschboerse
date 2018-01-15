export default class ActionDescriptor{
    constructor(title, onClick, buttonId) {
        this.disabled = false;

        this.title = title;
        this.label = title;
        this.onClick = onClick;
        this.buttonId = buttonId;
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setLabel(text) {
        this.label = text;
        return this;
    }

    setDisabled(flag) {
        this.disabled = flag;
        return this;
    }
}