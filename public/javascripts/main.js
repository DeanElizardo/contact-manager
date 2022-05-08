//=============================================================Contact container
let container = document.querySelector("#contactContainer");

Handlebars.registerHelper('splitTags', splitTags);

Handlebars.registerPartial(
  "contact_partial",
  document.querySelector("#contact_partial").innerHTML
);

let contactList = Handlebars.compile(
  document.querySelector("#contact_list").innerHTML
);

// load all contacts in lexicographical order by default
document.addEventListener("DOMContentLoaded", async function (event) {
  let contacts = await getContacts();
  renderContactContainer(contacts);
});

//==================================================================Search Field

document
  .querySelector("#searchField")
  .addEventListener("keyup", async function (event) {
    event.preventDefault();
    let searchString = event.currentTarget.value;
    let contacts = await getContacts();
    let matching = matchingSubstrings(contacts, searchString);

    renderContactContainer(matching);
  });

//=========================================================='Add Contact' Button
document
  .querySelector("form#searchAndEntry")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Default Prevented");
  });

//==============================================================Helper functions
async function getContacts() {
  try {
    var response = await fetch("/api/contacts", {
      method: "GET",
    });
    var contacts = await response.json();
  } catch (error) {
    console.log(`Fetch error in 'getContacts': ${error}`);
  }

  return contacts;
}

function splitTags(tags) {
  return tags.split(',');
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

function renderContactContainer(contacts) {
  container.innerHTML = "";

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
  }
}
