function validatePhoneNumber(phoneNumber) {
  let nums = phoneNumber.replace(/\D/g, "");
  let pattern = new RegExp("^\\d{10}$");

  return pattern.test(nums);
}

function validateEmail(email) {
  if (email.includes(" ")) {
    return false;
  }
  let pattern = new RegExp("(^\\w+|\\d+)\\@(\\w+|\\d+).\\w{3}$");

  return pattern.test(email);
}


export { validateEmail, validatePhoneNumber }