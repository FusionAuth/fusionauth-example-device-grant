# FusionAuth Device Authorization Grant workflow example

A basic HTML/JavaScript app demonstrating the Device Authorization Request and Device Access Token Request of the [Oauth2 Device Authorization Grant](https://tools.ietf.org/html/rfc8628) specification.

Use in conjunction with an installation of FusionAuth to demo the entire Device Grant workflow.

## Usage

1. **Download and install FusionAuth:**

   Start by [downloading and installing FusionAuth](https://fusionauth.io/docs/v1/tech/getting-started/).

2. **[Create an Application](https://fusionauth.io/docs/v1/tech/core-concepts/applications):**

   - Enable Device Grant on the OAuth tab under "Enabled grants."
   - Enter a Device Verification URL.
     - This URL should be as short (and sweet) as possible.
     - This URL will be either the landing page to your application that can perform a 302 redirect to the FusionAuth device page with the required request parameters or a URL configured in a proxy to perform the same redirect.
     - For example, `https://acme.com/activate` which would be able to redirect to `https://login.acme.com/oauth2/device?client_id={client_id}&tenantId={tenantId}` where `https://login.acme.com` is the URL of your FusionAuth service.
   - Click save (blue icon at the top right).

3. **Update the [FusionAuth CORS policy](https://fusionauth.io/docs/v1/tech/reference/cors):**

   - Add `http://localhost:8080` to "Allowed origins."
   - Check "POST" as an "Allowed method."
   - Click save.

4. **Edit the main.js file in this project:**

   - Change `baseFusionAuthURL` to your base FusionAuth URL.
   - Change `clientId` to that of the newly created Application in the previous step.

5. **Run this example:**

   - Run `python3 -m http.server` to start a simple HTTP server for the `index.html` file.
   - Open `localhost:8080` in your browser.
   - Click the "Click to Start" button.
   - Browse to the URL provided and enter the code or scan the QR code with your phone.

For more information about FusionAuth and its core concepts for applications, refer to the [FusionAuth documentation](https://fusionauth.io/docs/v1/tech/core-concepts/applications).
