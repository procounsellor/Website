/* eslint-disable @typescript-eslint/no-explicit-any */
// declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;  // or you can type it more strictly if you want
  }
}
