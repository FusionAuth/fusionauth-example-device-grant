FusionAuth Device Authorization Grant workflow example
====
A basic HTML/JavaScript app demonstrating the Device Authorization Request and Device Access Token Request of the [Oauth2 Device Authorization Grant](https://tools.ietf.org/html/rfc8628) specification.

Use in conjunction with an installation of FusionAuth to demo the entire Device Grant workflow.

Usage
----

1. Download and install FusionAuth
1. [Create an Application](https://fusionauth.io/docs/v1/tech/tutorials/create-an-application)
    1. Under Oauth config, disable Require authentication.
    1. Enable Device Grant.
    1. Enter a Device Verification URL. For this example it can be '/oauth2/device'
    1. Click save (blue icon at the top right).
1. Edit the default tenant
    1. Set the Device Grant User Code generator to your desired length and generator type.
    1. Set the Device Grant Code duration to your desired TTL.
    1. Click save.
1. Edit the main.js file in this project
    1. Change openIdConfigEndpoint to contain your running instance of FusionAuth
    1. Change clientId to that of the newly created Application
    1. Change tokenEndpoint to contain your running instance of FusionAuth
1. Run this example
    1. Open the index.html from this project in a browser
    1. Click the 'Connect' button
    1. Browse to the URL provided and enter the code.
