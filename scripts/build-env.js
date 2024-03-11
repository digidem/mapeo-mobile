const fs = require("fs");
const path = require("path");

// Path to your .env file
const envPath = path.resolve(__dirname, "../.env");

// Read the contents of the .env file
const envFileContent = fs.readFileSync(envPath, "utf8");

// Split the file contents into lines
const lines = envFileContent.split("\n");

// Create an object to hold the environment variables
const envVariables = {};

// Iterate over each line and set environment variables
lines.forEach(line => {
  // Skip empty lines and comments
  if (line.trim() !== "" && !line.startsWith("#")) {
    // Split the line into key-value pairs
    const [key, value] = line.split("=");
    // Set the environment variable in the object
    envVariables[key.trim()] = value.trim();
  }
});

// Convert the object to a string representation
const envString = JSON.stringify(envVariables, null, 4);

// Write the environment variables to a JavaScript file
const outputPath = path.resolve(__dirname, "../env.js");
fs.writeFileSync(outputPath, `export default ${envString};`, "utf8");

console.log("Environment variables injected into env.js");
