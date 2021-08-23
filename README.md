# Photolite Academy

A website for a photo school named Photolite academy. This site includes a well-designed homepage and a user portal. On this site, you can see the next and passed workshops and buy access for the future events. When you buy a workshop, you will get access to the in-person activity as well as some resources and readings available on the user portal. The site uses local authentication as well as google oAuth2 and stripe API for payments.

---

![Preview screenshot](readme_files/Group%201.png)

## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
### Yarn installation
  After installing node, this project will need yarn too, so just run the following command.

      $ npm install -g yarn

---

## Install

    $ git clone https://github.com/EgorZakharov97/photoSchool.git
    $ cd PROJECT_TITLE
    $ yarn install

## Configure app

You will need to configure `.env` file in order to run the site. The sample is provided in in `.env.demo` file where you can see all the required environment variable fields in order to run the app in production mode. 

    NODE_ENV='production'
    DB_CONNECT= url for mongodb connection
    AUTH_GOOGLE_CLIENT= google client key
    AUTH_GOOGLE_SECRET= google authentication secret
    AUTH_GOOGLE_REDIRECT= redirect to google user authentication
    SESSION_SECRET= session secret
    HOST= tha base url of the site (there the thing is running)

    PATH_TO_CERT= path to server.crt
    PATH_TO_KEY= path to ssl certificate key
    SSL_PORT= ssl certeficate port
    PORT= default port

    STRIPE_SECRET= stripe secret key
    STRIPE_PUBLIC= stripe public key
    STRIPE_WH= url to stripe we hook response

## Running the project

    $ npm run start
        OR
    $ yarn start

## Stack

*   Backend
    *   Node.js
    *   Express.js
    *   MongoDB
    *   Stripe.js
*   Front end
    *   ejs

## File structure

    .
    ├── controller              # controller implementation
    ├── models                  # Mongodb Database Models
    ├── public                  # HTML, styles, js and assets for the client
    ├── readme_files            # Files used in readme file
    ├── routes                  # Router
    ├── service                 # Fiels used throughout the project
        ├── authentication      # Files responsible for user authentication
        ├── email               # Adapter for e-mail sending library
            ├── templates       # templates for eamils
        ├── logger              # adapter for logging library
        ├── middleware          # middleware
        ├── tools               # other functions used throughout the project
    ├── userFIles               # Folder that contains all files available to users after buying a workshop
    ├── app.js                  # app entry point
    └── README.md

