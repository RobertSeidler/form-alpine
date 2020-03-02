const { InputFieldText } = require('./input-field-generic.js');
const { genericLookUpQuery } = require('./input-field-lookup.js');


module.exports.InputFieldChooseList = class extends InputFieldText {
  constructor(){
      super();
      this.defaultOptions = {
          ...this.defaultOptions,
          queryUrl: '',
          listenQuery: '',
          formWert: ''
      }
      this.orig_list_items = [];

      // this.addEventListener('form-input', (event) => {
      //   console.log(event)
      // })
  }

  applyTemplate(){
    super.applyTemplate();
    this.querySelector('.form-element').insertAdjacentHTML('afterbegin', `
      <input 
          class="filter-input helper"
          type="text"
          placeholder="Filter"
      >
      <ul class="choose-list">

      </ul>
    `);
      // this.rootElement.insertAdjacentHTML('beforeend', );

    genericLookUpQuery(this.options.queryUrl, '', this.options.listenQuery)
      .then(data => {
        this.dbfailed = false;
        this.orig_list_items = data.map(entry => `<li onclick="((event) => { let compo = this.parentElement.parentElement.parentElement; console.log(compo); compo.querySelector('#${this.options.name}').value = event.target.value; compo.formInputHandler({target: compo}); compo.dispatchCustomEvent('form-input', event)})(event)" value="${entry[this.options.formWert]}">${Object.keys(entry).map(key => entry[key]).join(', ')}</li>`);
        let choose_list = this.querySelector('.choose-list');
        choose_list.innerHTML = this.orig_list_items.join('\n');
        this.querySelector('.filter-input').addEventListener('input', (event) => 
          (choose_list.innerHTML = this.orig_list_items.filter(value => value.toLowerCase().includes(event.target.value)).join('\n'))
        );
      })
      .catch(err => {
        console.log('Database could not be reached?');
        console.error(err);
        this.dbfailed = true;
      });
  }

  checkValidity(){
    let valid = super.checkValidity();
    [...this.querySelectorAll('li')].forEach(listItem => listItem.classList.remove('selected'));
    let matchingListItem = this.querySelector(`li[value="${this.getModel()}"]`);
    if(matchingListItem) {
      let scrollTo = matchingListItem.offsetTop - matchingListItem.clientHeight -matchingListItem.offsetHeight;
      matchingListItem.parentElement.scrollTo({top: scrollTo})
      matchingListItem.classList.add('selected');
    };
    if(this.dbfailed && valid) this.setValidityStatus(true, 'Datenbank nicht erreichbar.', true);
    return valid && ( this.dbfailed || matchingListItem );
  }


  // //? CAREFULL formInputHandler does not overwrite superclass method formInputHandler, that is already added as an eventlistener;
  // formInputHandlerLi(event){
  //   [...event.target.querySelectorAll('li')].forEach(listItem => listItem.classList.remove('selected'));
  //   // return super.formInputHandler(event);
  // }
}