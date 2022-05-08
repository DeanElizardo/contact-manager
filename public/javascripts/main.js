//================================================================Initialization
let container = document.querySelector("#contactContainer");
let searchForm = document.querySelector("#searchAndEntry");
let searchField = document.querySelector("#searchField");
let tagDiv = document.querySelector("#contact_tags");
let addForm = document.querySelector("#add_contact_form");
let cancelAdd = document.querySelector("#cancel_add");

Handlebars.registerHelper("splitTags", splitTags);

Handlebars.registerPartial(
  "contact_partial",
  document.querySelector("#contact_partial").innerHTML
);

let contactList = Handlebars.compile(
  document.querySelector("#contact_list").innerHTML
);

let contactTags = Handlebars.compile(
  document.querySelector("#contact_tags_template").innerHTML
);

// load all contacts in lexicographical order by default
document.addEventListener("DOMContentLoaded", async function (event) {
  let [contacts, currentTags] = await getContacts();
  renderContactContainer(contacts, currentTags);
});

//==================================================================Search Field
searchField.addEventListener("keyup", async function (event) {
  event.preventDefault();
  let searchString = event.currentTarget.value;
  let [contacts, currentTags] = await getContacts();
  let matching = matchingSubstrings(contacts, searchString);

  renderContactContainer(matching, currentTags);
});

//================================================================='Add Contact'
addForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let formData = new FormData(event.currentTarget);
  let data = {};

  let tags = [];
  for (let entry of formData) {
    if (/tag_/.test(entry[0])) {
      tags.push(entry[1]);
    } else {
      data[entry[0]] = entry[1];
    }
  }

  let tagString = tags.join(',');

  data['tags'] = (tagString === '' ? null : tagString);
  try {
    let response = await fetch('/api/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.log(`Fetch failed in adding contact: ${error}`);
  }

  addForm.reset();
  searchForm.reset();

  cancelAdd.dispatchEvent(new Event("click"));
});

cancelAdd.addEventListener("click", async function (event) {
  event.preventDefault();

  let [contacts, currentTags] = await getContacts();
  renderContactContainer(contacts, currentTags);
  addForm.reset();
  searchForm.reset();
  showSearchPhase();
});

document
  .querySelector("form#searchAndEntry")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    let [contacts, currentTags] = await getContacts();
    addContactForm(event, currentTags);
  });

//==============================================================Helper functions
async function getContacts() {
  try {
    var response = await fetch("/api/contacts", {
      method: "GET",
    });
    var contacts = await response.json();
    var currentTags = await getTags(contacts);
  } catch (error) {
    console.log(`Fetch error in 'getContacts': ${error}`);
  }

  return [contacts, currentTags];
}

function splitTags(tags) {
  return (tags ? tags.split(",") : []);
}

function sortContacts(contacts) {
  contacts.sort((a, b) => {
    if (a.full_name < b.full_name) {
      return -1;
    } else if (a.full_name < b.full_name) {
      return 1;
    } else {
      return 0;
    }
  });
}

function matchingSubstrings(contacts, searchString) {
  if (searchString == "") {
    return contacts;
  }
  let search = new RegExp(searchString, "i");
  return contacts.filter((contact) => search.test(contact.full_name));
}

function emptyContainer(node) {
  for (let idx = 0; idx < node.children.length; idx++) {
    emptyContainer(node.children[idx]);
  }

  for (let idx = 0; idx < node.children.length; idx++) {
    node.remove(node.children[idx]);
  }
}

function renderContactContainer(contacts, currentTags) {
  emptyContainer(container);

  if (contacts.length) {
    container.insertAdjacentHTML(
      "afterbegin",
      contactList({ contacts: contacts })
    );
  } else {
    let headerDiv = document.createElement("div");
    let buttonDiv = document.createElement("div");

    let noContactHeader = document.createElement("h2");
    noContactHeader.textContent = "There are no contacts";

    let noContactButton = document.createElement("button");
    noContactButton.setAttribute("id", "no_contact_add_button");
    noContactButton.textContent = "Add Contact";

    container.appendChild(headerDiv);
    container.appendChild(buttonDiv);
    headerDiv.appendChild(noContactHeader);
    buttonDiv.appendChild(noContactButton);

    noContactButton.onclick = (event) => {
      addContactForm(event, currentTags);
    };
  }
}

async function getTags(contacts) {
  let tagSet = new Set();
  contacts.forEach((contact) => {
    tags = splitTags(contact.tags);
    tags.forEach((tag) => tagSet.add(tag));
  });

  return tagSet.size ? Array.from(tagSet) : null;
}

function setStyle(hiding, showing) {
  hiding.forEach((element) => (element.style = "display: none"));
  showing.forEach((element) => (element.style = ""));
}

function showAddPhase(currentTags) {
  let hiding = Array.from(document.querySelectorAll(".searchPhase"));
  let showing = Array.from(document.querySelectorAll(".addPhase"));

  emptyContainer(tagDiv);
  tagDiv.innerHTML = contactTags({ tags: currentTags });

  setStyle(hiding, showing);
}

function showSearchPhase() {
  let hiding = Array.from(document.querySelectorAll(".addPhase"));
  let showing = Array.from(document.querySelectorAll(".searchPhase"));

  setStyle(hiding, showing);
}

function addContactForm(clickEvent, currentTags) {
  clickEvent.preventDefault();

  showAddPhase(currentTags);
}
