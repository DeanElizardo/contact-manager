class Model {
  constructor() {
    this.contacts = [];
  }

  static _fetch = async (URI, options) => {
    const response = await fetch(URI, options);

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    return response.json();
  };

  _errorWrapper(func, ...params) {
    try {
      return func.call(this, ...params);
    } catch {
      throw new Error(`Error in ${func.name}`);
    }
  }

  //======================================================================CREATE
  addContact(data) {
    return this._errorWrapper(this._addContact, data);
  }

  async _addContact(data) {
    let URI = `/api/contacts/`;
    let options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    let contact = await Model._fetch(URI, options);

    this.contacts.push(contact);

    return contact;
  }

  //========================================================================READ
  getContacts() {
    return this._errorWrapper(this._getContacts);
  }

  async _getContacts() {
    let URI = "/api/contacts";
    let options = { method: "GET" };
    this.contacts = await Model._fetch(URI, options);

    return this.contacts;
  }

  getSingleContact(id) {
    return this._errorWrapper(this._getSingleContact, id);
  }

  async _getSingleContact(id) {
    let contact = this.contacts.find((contact) => contact.id === id);
    if (contact) {
      return contact;
    } else {
      await this.getContacts();
      return this.getSingleContact(id);
    }
  }

  //======================================================================UPDATE
  updateContact(id, data) {
    this._removeContact(id);
    return this._errorWrapper(this._updateContact, id, data);
  }

  async _updateContact(id, data) {
    let URI = `/api/contacts/${id}`;
    let options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    let contact = await Model._fetch(URI, options);

    this.contacts.push(contact);

    return contact;
  }

  //======================================================================DELETE
  _removeContact(id) {
    this.contacts = this.contacts.filter((contact) => contact.id !== id);
  }

  deleteContact(id) {
    return this._errorWrapper(this._deleteContact, id);
  }

  async _deleteContact(id) {
    let URI = `/api/contacts/${id}`;
    let options = { method: "DELETE" };

    await Model._fetch(URI, options);

    return null;
  }
}

export { Model };