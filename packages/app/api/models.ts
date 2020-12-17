/* eslint-disable */
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

export namespace Api {
	/**
	 * @export
	 * @interface Auth
	 */
	export interface Auth {
		/**
		 * @type {string}
		 * @memberof Auth
		 */
		token?: string;
		/**
		 * @type {string}
		 * @memberof Auth
		 */
		order?: string;
	}

	/**
	 * <p>A JWT token that should be used for authorizing requests</p>
	 * @export
	 * @interface AuthToken
	 */
	export interface AuthToken {
		/**
		 * @type {string}
		 * @memberof AuthToken
		 */
		token?: string;
	}

	/**
	 * @export
	 * @interface CalendarItem
	 */
	export interface CalendarItem {
		/**
		 * @type {number}
		 * @memberof CalendarItem
		 */
		id?: number;
		/**
		 * @type {string}
		 * @memberof CalendarItem
		 */
		title?: string;
		/**
		 * @type {string}
		 * @memberof CalendarItem
		 */
		description?: string;
		/**
		 * @type {string}
		 * @memberof CalendarItem
		 */
		location?: string;
		/**
		 * @type {Date}
		 * @memberof CalendarItem
		 */
		startDate?: string;
		/**
		 * @type {Date}
		 * @memberof CalendarItem
		 */
		endDate?: string;
		/**
		 * @type {boolean}
		 * @memberof CalendarItem
		 */
		allDay?: boolean;
	}

	/**
	 * @export
	 * @interface Child
	 */
	export interface Child {
		/**
		 * @type {string}
		 * @memberof Child
		 */
		id?: string;
		/**
		 * <p>Special ID used to access certain subsystems</p>
		 * @type {string}
		 * @memberof Child
		 */
		sdsId?: string;
		/**
		 * @type {string}
		 * @memberof Child
		 */
		name?: string;
		/**
		 * <p>F - förskola, GR - grundskola?</p>
		 * @type {string}
		 * @memberof Child
		 */
		status?: string;
		/**
		 * @type {string}
		 * @memberof Child
		 */
		schoolId?: string;
	}

	/**
	 * @export
	 * @interface ChildAll
	 */
	export interface ChildAll {
		/**
		 * @type {Api.Child}
		 * @memberof ChildAll
		 */
		child?: Api.Child;
		/**
		 * @type {Api.NewsItem[]}
		 * @memberof ChildAll
		 */
		news?: Api.NewsItem[];
		/**
		 * @type {Api.CalendarItem[]}
		 * @memberof ChildAll
		 */
		calendar?: Api.CalendarItem[];
		/**
		 * @type {Api.Notification[]}
		 * @memberof ChildAll
		 */
		notifications?: Api.Notification[];
	}

	/**
	 * @export
	 * @interface Classmate
	 */
	export interface Classmate {
		/**
		 * @type {string}
		 * @memberof Classmate
		 */
		sisId?: string;
		/**
		 * <p>The name of the class of this classmate</p>
		 * @type {string}
		 * @memberof Classmate
		 */
		className?: string;
		/**
		 * @type {string}
		 * @memberof Classmate
		 */
		firstname?: string;
		/**
		 * @type {string}
		 * @memberof Classmate
		 */
		lastname?: string;
		/**
		 * @type {Api.Guardian[]}
		 * @memberof Classmate
		 */
		guardians?: Api.Guardian[];
	}

	/**
	 * @export
	 * @interface Guardian
	 */
	export interface Guardian {
		/**
		 * @type {string}
		 * @memberof Guardian
		 */
		email?: string;
		/**
		 * @type {string}
		 * @memberof Guardian
		 */
		firstname?: string;
		/**
		 * @type {string}
		 * @memberof Guardian
		 */
		lastname?: string;
		/**
		 * @type {string}
		 * @memberof Guardian
		 */
		mobile?: string;
		/**
		 * @type {string}
		 * @memberof Guardian
		 */
		address?: string;
	}

	/**
	 * <p>A news item from the school, for example a weekly news letter</p>
	 * @export
	 * @interface NewsItem
	 */
	export interface NewsItem {
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		id?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		header?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		intro?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		body?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		published?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		modified?: string;
		/**
		 * @type {string}
		 * @memberof NewsItem
		 */
		imageUrl?: string;
	}

	/**
	 * @export
	 * @interface Notification
	 */
	export interface Notification {
		/**
		 * @type {string}
		 * @memberof Notification
		 */
		id?: string;
		/**
		 * @type {string}
		 * @memberof Notification
		 */
		sender.name?: string;
		/**
		 * @type {Date}
		 * @memberof Notification
		 */
		dateCreated?: string;
		/**
		 * @type {string}
		 * @memberof Notification
		 */
		message?: string;
		/**
		 * <p>URL with the actual message as a webpage. Needs separate login. TODO: Investigate how to solve this somehow</p>
		 * @type {string}
		 * @memberof Notification
		 */
		url?: string;
		/**
		 * @type {string}
		 * @memberof Notification
		 */
		category?: string;
		/**
		 * @type {string}
		 * @memberof Notification
		 */
		messageType?: string;
	}

}
