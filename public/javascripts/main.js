import { Model } from './model.js';
import { View } from './view.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //=============================================================PAGE ELEMENTS
    this.searchField = document.querySelector("#searchField");

    //============================================================INITIALIZE MVC
    Controller.#init(this);
  }

  static #init(controller) {
    controller.renderContactsPage();
    controller.searchField.addEventListener("keyup", (event) => {
      controller.search(event, controller);
    });
  }

  async renderContactsPage() {
    await this.model.getContacts();
    this.view.renderContactContainer(this.model.contacts);
    this.makeButtonsReady();
  }

  async renderContactForm(contactID = null) {
    let submitMethod = "POST";
    if (contactID) {
      let contact = await this.model.getSingleContact(contactID);
      this.view.renderContactForm(contact);
      submitMethod = "PUT";
    } else {
      this.view.renderContactForm();
    }

    let cancelForm = document.querySelector('#cancel_add');
    let submitForm = document.querySelector('#submit_add');

    cancelForm.onclick = this.renderContactsPage;


  }

  makeButtonsReady() {
    let controller = this;
    let editButtons = Array.from(document.querySelectorAll(".editButton"));
    let deletebuttons = Array.from(document.querySelectorAll(".deleteButton"));

    editButtons.forEach((button) => {
      button.onclick = function (event) {
        controller.editContact(event, controller);
      };
    });

    deletebuttons.forEach((button) => {
      button.onclick = function (event) {
        controller.deleteContact(event, controller);
      };
    });
  }

  //=====================================================EVENT HANDLER CALLBACKS
  //--------------------------------------------Searching-----------------------
  search(keyUpEvent, controller) {
    keyUpEvent.preventDefault();

    let text = keyUpEvent.currentTarget.value;

    let matchingContacts = this.getMatches(text, controller.model.contacts);

    controller.view.renderContactContainer(matchingContacts);
  }

  getMatches(text, contacts) {
    let regex = new RegExp(text, "i");
    return contacts.filter((contact) => regex.test(contact.full_name));
  }

  //-----------------------------------------------Adding-----------------------
  //---------------------------------------------Updating-----------------------
  editContact(clickEvent, controller) {
    clickEvent.preventDefault();

    let contactID = Number(clickEvent.currentTarget.getAttribute("id"));
    controller.renderContactForm(contactID);
  }
  //---------------------------------------------Deleting-----------------------
  deleteContact(clickEvent, controller) {
    clickEvent.preventDefault();

    let contactID = Number(clickEvent.currentTarget.getAttribute("id"));
  }
}

const controller = new Controller(new Model(), new View());
