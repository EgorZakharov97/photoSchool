# Authentication System

This is a ready to use authentication system based on `Node.js`, `express` and `passport.js`.

The app contains feature as follows:
* User authentication via Google OAuth2.0
* Local user registration/authentication
* Support of user account transfer from Google auth to Local auth
* Password email reset
* Use session setup on Redis
* Redis Cache
* Automatic upload of anonymous user statistics to MongoDB
* Custom Logger (save logs to file or send errors via e-mail in production mode)
* Clustering (worker threads)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

#### Prerequisites
* #### `Node.js`
* #### `Redis`
* #### `MongoDB cluster`

#### Installing
If you don't have `Node.js` installed, [go here](https://nodejs.org/en/download/) and download a suitable package.

If you do't have Redis installed, [go here](https://redis.io/topics/quickstart) and install Redis.<br/>
Don't forget to launch a Redis server))

If you don't have MongoDB installed, [go here](https://docs.mongodb.com/manual/installation/) and install MongoDB locally.<br/>
You also can setup a **Free to use** online MongoDB cluster. You can do it on the [official website](https://www.mongodb.com/)<br/>
I suggest using [Mongo Compass](https://www.mongodb.com/products/compass) as it is a very convenient tool to manage local and online storage.

Now you should be ready to clone the GitHub repository locally

> git clone https://github.com/EgorZakharov97/node_authentication.git

Run the following command to install all dependencies before starting the application
> npm install

This app requires a `.env` file containing all environmental variables.
You will need to construct this file using you own properties. The format is as follows:

~~~
PORT= # The port on which the application runs
HOST= # Your network address
ADDRESS= # Your HOST followed by PORT ))))
DB_CONNECT= # Connection string for MongoDB
NODE_ENV = # Application environment. Can be 'development' or 'production'
SESSION_SECRET= # Session secret (usually a random string)
REDIS_HOST= # String containing your Redis host
REDIS_PORT= # The port on which your Redis server operates
AUTH_GOOGLE_CLIENT= # Google client
AUTH_GOOGLE_SECRET= # Google secret
AUTH_GOOGLE_REDIRECT= # The link that Google will hit when a client is authenticated
AUTH_LOCAL_USER_SECRET= # 13 character random string for local encryption of user password
AUTH_LOCAL_RESET_KEY= # 32 character random string for local password reset
EMAIL= # Email address from which emails will be sent to users to reset their password
EMAIL_PASS= # Password for the email
~~~

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the production mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run dev`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run single`

Runs the app in the as a single instance.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This app supports simple clustering. It means that the program will start a separate process for each core available on your machine.
With this command, the app will create only one process. Use in case if your machine has only one core.

### `npm run single-dev`

Runs the app in the as a single instance in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This app supports simple clustering. It means that the program will start a separate process for each core available on your machine.
With this command, the app will create only one process. Use in case if your machine has only one core.

## Built With
* [Node.js](https://nodejs.org/) - Server side JavaScript.
* [express](https://expressjs.com/) - Web framework.
* [MongoDB](https://www.mongodb.com/) - A general purpose, document-based, distributed database.
* [Redis](https://redis.io/) - In-Memory data storage.
* [Passport.js](http://www.passportjs.org/) - Simple, unobtrusive authentication for Node.js.
* Other dependencies can be seen in `package.json` file.

## FAQs
* Where can I get Google client and Google secret?
    * You may consider going [here](https://developers.google.com/identity/protocols/oauth2) to find more information of how to setup OAuth for Google

* Why am I getting an error while sending a password reset email?
    * This may be a security issue. If you use google, consider going [here](https://devanswers.co/allow-less-secure-apps-access-gmail-account/) to allow less secure apps for your account. Or you may modify the app's code to setup a secure connection.