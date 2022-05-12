class Model {
  constructor() {
    this.contacts = [];
  }

  saveContact(contactData) {
    return this._errorWrapper.bind(this._saveContact, contactData);
  }

  getAllContacts() {
    return this._errorWrapper(this._getAllContacts);
  }

  getSingleContact(contactID) {
    return this._errorWrapper(this._getSingleContact, contactID);
  }

  updateContact(contactID, contactData) {
    return this._errorWrapper(this._updateContact, contactID, contactData);
  }

  deleteContact(contactID) {
    return this._errorWrapper(this._deleteContact, contactID);
  }

  _errorWrapper(func, ...params) {
    try {
      return func(...params);
    } catch {
      throw new Error(`Error in ${func.name}`);
    }
  }

  static _fetch = async (URI, options) => {
    const response = await fetch(URI, options);

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    return response.json();
  }

  _saveContact(contactData) {
    let URI = "/api/contacts/";
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    };

    return Model._fetch(URI, options);
  };

  _getAllContacts() {
    let URI = "/api/contacts";
    let options = { method: "GET" };

    return Model._fetch(URI, options);
  };

  _getSingleContact(model, contactID) {
    let URI = `/api/contacts/${contactID}`;
    let options = { method: "GET" };

    return Model._fetch(URI, options)
  };

  _removeContact(model, contactID) {
    model.contacts = model.contacts.filter((contact) => contact.id !== contactID);
  }

  _updateContact(model, contactID, contactData) {
    model._removeContact(contactID);

    let URI = `/api/contacts/${contactID}`;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "appliation/json" },
      body: JSON.stringify(contactData),
    };

    return Model._fetch(URI, options);
  };

  _deleteContact(contactID) {
    model._removeContact(contactID);

    let URI = `/api/contacts/${contactID}`;
    let options = {
      method: "DELETE",
    }

    return Model._fetch(URI, options);
  }
}

class View {
  constructor() {
    
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async renderContacts() {
    this.model.contacts = await this.model.getAllContacts();
    console.log(this.model.contacts);
  }
}

let control = new Controller(new Model(), new View());

control.renderContacts();