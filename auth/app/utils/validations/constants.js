// firstName, lastName, Username
const validNames = /^[a-zA-Z0-9]{2,}$/;
const validNumbers = /^[\d]{8,}$/;
const validPhone = /^(?:254|\+254|0)?(7(?:(?:[129][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$/;
const validEmail = /^\S+@\S+\.\S+$/;
const validPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
const validUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

export {
  validNames,
  validNumbers,
  validPhone,
  validEmail,
  validPassword,
  validUrl,
};
