//Contact container
let container = document.querySelector('#contactContainer');

document.addEventListener('DOMContentLoaded', async function (event) {
  console.log("RUN!");
  let contacts = await getContacts();
  console.log(contacts);
});

//Search Field
document
  .querySelector('#searchField')
  .addEventListener('keyup', function (event) {
    event.preventDefault();
  });

//'Add Contact' Button
document
  .querySelector('#searchAndEntry')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    alert(searchField.value);
  });

//Helper functions
async function getContacts() {
  try {
    var response = await fetch('/api/contacts', {
        method: "GET"
      });
    var contacts = await response.json()
  } catch (error) {
    console.log(`Fetch error in 'getContacts': ${error}`)
  }

  return contacts;
}