/**
 * CacheKeys are keys that hold data either from the backend
 * or data that the user has inputted across form steps.
 *
 * Form client data across form step, the cache key starts *CLIENT*
 * **/

export enum CacheKeys {
  USER_PURCHASE_TICKET = 'userPurchaseTicket',
  USER_TICKETS = 'userTickets',
  COUPON_CODE = 'couponCode',
  CLAIM_TICKET = 'claimTicket',
}

export const TICKET_PRICES = {
  DAY_ONE: 7000,
  DAY_TWO: 10000,
};

// function formatNumberWithCommas(number) {
//   // Convert the number to a string
//   const numberString = number.toString();

//   // Use a regular expression to insert commas as thousand separators
//   const formattedString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//   return formattedString;
// }

// // Example usage
// const number = 10000;
// const formattedNumber = formatNumberWithCommas(number);
// console.log(formattedNumber); // Output: "10,000"
