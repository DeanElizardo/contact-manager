import { Model } from './model.js';
import { View } from './view.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    //=============================================================PAGE ELEMENTS
    this.searchField = document.querySelector("#searchField");
    this.clearTagFilterButton = document.querySelector('#clearTags');

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
    this.makeTagLinksReady();
    this.hideClearTag();
  }

  async renderContactForm(contactID = null) {
    let controller = this;
    let submitMethod = "POST";
    if (contactID) {
      let contact = await this.model.getSingleContact(contactID);
      contact.unchecked = this.model.getUncheckedTags(contact.tags);
      this.view.renderContactForm(contact);
      submitMethod = "PUT";
    } else {
      this.view.renderContactForm();
    }

    let cancelForm = document.querySelector('#cancel_add');
    cancelForm.onclick = function (event) {
      event.preventDefault();
      controller.renderContactsPage(event);
    }

    let submitForm = document.querySelector('#submit_add');
    submitForm.onclick = function (event) {
      event.preventDefault();
      controller.updateContact();
    }
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

  makeTagLinksReady() {
    let controller = this;
    let tags = Array.from(document.querySelectorAll('.taglink'));

    tags.forEach((tag) => {
      tag.onclick = function (event) {
        controller.renderWithMatchingTags(event);
      }
    })
  }

  clearTagFilters() {
    this.renderContactsPage();
  }

  showClearTag() {
    this.clearTagFilterButton.style = "";
  }

  hideClearTag() {
    this.clearTagFilterButton.style = "display: none";
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

  renderWithMatchingTags(clickEvent) {
    let controller = this;
    let tag = new RegExp(clickEvent.target.textContent);
    let matchingContacts = this.model.contacts.filter((contact) => tag.test(contact.tags));

    this.clearTagFilterButton.onclick = function (event) {
      event.preventDefault();
      controller.clearTagFilters();
    };

    controller.view.renderContactContainer(matchingContacts);
    this.makeButtonsReady();
    this.makeTagLinksReady();
    this.showClearTag();
  }

  //-----------------------------------------------Adding-----------------------
  //---------------------------------------------Updating-----------------------
  async updateContact() {
    this.form = document.querySelector("#add_contact_form");

    let rawData = new FormData(this.form);
    let contactObj = {};
    let tags = [];

    for (let entry of rawData.entries()) {
      if (/^tag_/.test(entry[0]) && entry[1] !== "") {
        tags.push(entry[1]);
      } else {
        contactObj[entry[0]] = entry[1];
      }
    }

    if (tags.length) {
      contactObj["tags"] = tags.join(',');
    } else {
      contactObj["tags"] = null;
    }

    await this.model.updateContact(contactObj["id"], contactObj);
    await this.renderContactsPage();
  }

  editContact(clickEvent, controller) {
    clickEvent.preventDefault();

    let contactID = Number(clickEvent.currentTarget.getAttribute("id"));
    controller.renderContactForm(contactID);
  }
  //---------------------------------------------Deleting-----------------------
  async deleteContact(clickEvent, controller) {
    clickEvent.preventDefault();

    let contactID = Number(clickEvent.currentTarget.getAttribute("id"));
    await controller.model.deleteContact(contactID);
    await controller.renderContactsPage();
  }
}

const controller = new Controller(new Model(), new View());