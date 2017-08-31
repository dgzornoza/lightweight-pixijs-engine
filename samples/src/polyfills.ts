import "es6-shim";

declare var process: any;
if (process.env.ENV === "production") {
  // Production
} else {
  // Development and test
}
