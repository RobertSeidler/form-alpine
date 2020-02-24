// const { fieldTypeMap } = require('./formular-components.js')

const fieldTypeMap = {
    'text': 'input-field-text',
    'enumtext': 'input-field-enumlisttext',
    'dependentenumtextarea': 'input-field-dependentenumtextarea',
    'email': 'input-field-email',
    'tel': 'input-field-tel',
    'date': 'input-field-date',
    'number': 'input-field-number',
    'textarea': 'input-field-textarea',
    'boolean': 'input-field-boolean',
    'dropdown': 'input-field-dropdown',
    'radio': 'input-field-radio',
    'lookup': 'input-field-lookup',
    'dependenttext': 'input-field-abhaengig',
    'list': 'input-field-list',
    'object': 'input-field-object', 
    'choose': 'input-field-choose-list'
};

module.exports.InputField = class extends HTMLElement {
    schema = {};
    template = '';
    defaultOptions = {
        initialModel: '',
        name: '',
        label: '',
        beschreibung: '',
        standard: '',
        deaktiviert: false,
        pflichtfeld: false,
    };
    rootElement = this;
    options = {};
    model = {};
    valid = true;
    validityMessage = undefined;
    constructor(){
        super();

        this.addEventListener('focusout', this.checkValidity)
    }

    connectedCallback(){
        Object.keys(this.defaultOptions).forEach(key => {
            // console.log(key, this.getAttribute(key) || this.defaultOptions[key])

            // if(key === 'initialModel') console.log(this.getAttribute(key), typeof this.getAttribute(key));
            this.options[key] = this.convertValue(key, this.getAttribute(key)) || this.defaultOptions[key];
        });

        if(this.options.initialModel == undefined || this.options.initialModel == ''){
            this.options.initialModel = this.options.standard;
        }

        if(this.options.beschreibung === ''){
            this.options.beschreibung = this.options.label;
        }

        this.applyTemplate();
    }

    applyTemplate(){
        throw Error('Not Implemented');
    }

    convertValue(key, value){
        try{
            if(value != undefined)
                return JSON.parse(value);
            else 
                return '';
        } catch(err){
            console.log(key, value.toSource(), typeof value);
            console.error(err)
        }
    }

    saveValue(key, value){
        if(key === 'query') value = value.split("'").join("&#39;");
        return JSON.stringify(value);
    }

    checkValidity(){
        if (this.options.pflichtfeld && this.getModel() == undefined){
            this.setValidityStatus(false, 'Dies ist ein Pflichtfeld, und muss ausgefüllt werden.');
            return false;
        } else {
            this.setValidityStatus(true, '');
            return true;
        }
    }

    setValidityStatus(valid, message, warning){
        this.valid = valid;
        this.validityMessage = message;
        this.setAttribute('data-tooltip', message);

        if(valid){
            this.classList.remove('invalid');
            if(!warning) this.classList.remove('warning');
        } else {
            this.classList.add('invalid');
        }
        if(warning) this.classList.add('warning');
    }

    setModel(){
        throw Error('Not Implemented')
    }

    getModel(){
        throw Error('Not Implemented');
    }

    mapFieldType(fieldType){
        return fieldTypeMap[fieldType];
    }
}