// tslint:disable
/**
 * $kolplattformen API
 * This is a first try to extract a usable API based on the expensive SOA crap that is called Skolplattformen in Stockholm

# Introduction
This API is a wrapper on top of the SOA layer behind **Skolplattformen** which is the mandatory platform for schools in Stockholm Stad. 

# Get Started
Generate code examples from the OpenAPI yaml (press Download above) or use this as a start:
```
    const socialSecurityNumber = '121212121212'
    const baseUrl = 'https://api.skolplattformen.org'
    const token = await fetch(`${baseUrl}/login?socialSecurityNumber=${socialSecurityNumber}`, {method: 'POST'}).then(res => res.json())
    
    // Now start BankID and authorize, when you do - your jwt token will be ready
    const jwt = await fetch(`${baseUrl}/login/${token.order}/jwt`).then(res => res.json())
    const headers = {authorization: 'Bearer ' + jwt}

    // Use the jwt token as bearer token in your requests
    const children = await fetch(`${baseUrl}/children`, {headers}).then(res => res.json())

    // Get some details
    const childId = children[0].id
    const child = await fetch(`${baseUrl}/children/${childId}`, {headers}).then(res => res.json())
    const news = await fetch(`${baseUrl}/children/${childId}/news`, {headers}).then(res => res.json())
    const calendar = await fetch(`${baseUrl}/children/${childId}/calendar`, {headers}).then(res => res.json())

```

# Open source
This project is provided AS IS and is provided free as open source. If you want to participate and add more features to this api. Please find at the repository here:
[https://github.com/kolplattformen/api](https://github.com/kolplattformen/api)

# Privacy considerations
This API encodes the cookies recieved from the backend servers as JWT tokens and send them encrypted to the client. Neither cookies or tokens are stored on the server.

# Disclaimers
I have no affiliate with the Stockholm Stad organisation or any part of any development team for the city. Therefore things may change and suddenly stop working and I have no way of knowing or even a way of contacting you. My motivation for creating this API is purely for personal reasons. I want to develop apps for my own use and have no interest to go deep in the underlying SDK every day so I'm using this API as a way of creating a little bit of sanity and conform the sometimes swinglish structure into something a little bit more consistant. 

 *
 * OpenAPI spec version: 1.0.0
 * Contact: christian.landgren@iteam.se
 *
 * NOTE: This class is auto generated by OpenAPI Generator+.
 * https://github.com/karlvr/openapi-generator-plus
 * Do not edit the class manually.
 */

export interface ConfigurationParameters {
	apiKey?: string | ((name: string) => string);
	username?: string;
	password?: string;
	accessToken?: string | ((name: string, scopes?: string[]) => string);
	basePath?: string;
}

export class Configuration {
	/**
	 * parameter for apiKey security
	 * @param name security name
	 * @memberof Configuration
	 */
	apiKey?: string | ((name: string) => string);
	/**
	 * parameter for basic security
	 * 
	 * @type {string}
	 * @memberof Configuration
	 */
	username?: string;
	/**
	 * parameter for basic security
	 * 
	 * @type {string}
	 * @memberof Configuration
	 */
	password?: string;
	/**
	 * parameter for oauth2 security
	 * @param name security name
	 * @param scopes oauth2 scope
	 * @memberof Configuration
	 */
	accessToken?: string | ((name: string, scopes?: string[]) => string);
	/**
	 * override base path
	 * 
	 * @type {string}
	 * @memberof Configuration
	 */
	basePath?: string;

	constructor(param: ConfigurationParameters = {}) {
		this.apiKey = param.apiKey;
		this.username = param.username;
		this.password = param.password;
		this.accessToken = param.accessToken;
		this.basePath = param.basePath;
	}
}
