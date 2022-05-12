class View {
  // Private fields
  #contactListHTML;
  #contactCardHTML;
  #contactFormHTML;
  #tagListHTML;
  #emptyContact;

  constructor() {
    this.#emptyContact = {
      full_name: "",
      phone_number: "",
      email: "",
      tags: null,
    };
    //==============================================================HTML STRINGS
    this.#contactListHTML = document.querySelector("#contact_list").innerHTML;
    this.#contactCardHTML = document.querySelector("#contact_card").innerHTML;
    this.#contactFormHTML = document.querySelector("#contact_form").innerHTML;
    this.#tagListHTML = document.querySelector("#tags_template").innerHTML;

    //======================================================HANDELBARS TEMPLATES
    Handlebars.registerPartial("contact_card", this.#contactCardHTML);
    Handlebars.registerPartial("tags_template", this.#tagListHTML);

    Handlebars.registerHelper("splitTags", (tags) => tags.split(","));

    this.contactListTemplate = Handlebars.compile(this.#contactListHTML);
    this.contactFormTemplate = Handlebars.compile(this.#contactFormHTML);

    //=============================================================PAGE ELEMENTS
    this.containerElements = Array.from(
      document.querySelectorAll(".showing_contacts")
    );
    this.contactContainer = document.querySelector("#contactContainer");
    this.contactForm = document.querySelector("#contactForm");
  }

  #emptyDiv(node) {
    for (let child of node.children) {
      this.#emptyDiv(child);
    }

    for (let child of node.children) {
      node.remove(child);
    }
  }

  renderContactContainer(data) {
    this.#emptyDiv(this.contactContainer);
    this.contactContainer.innerHTML = this.contactListTemplate({
      contacts: data,
    });
    this.#showContactContainer();
  }

  #showContactContainer() {
    this.containerElements.forEach((element) => (element.style = ""));
    this.contactForm.style = "display: none";
  }

  renderContactForm(contact = this.#emptyContact) {
    this.#emptyDiv(this.contactForm);
    this.contactForm.innerHTML = this.contactFormTemplate(contact);
    console.log(this.contactFormTemplate(contact)); //!debugging
    this.#showContactForm();

    return 
  }

  #showContactForm() {
    this.containerElements.forEach((element) => (element.style = "display: none"));
    this.contactForm.style = "";
  }
}

export { View };