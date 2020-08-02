const google = require('googleapis');
const OAuth2 = google.auth;
const fs = require('fs');
const scope = "https://mail.google.com/";
const credentials = JSON.parse(fs.readFileSync('./google_authentication.json'));






if(process.env.NODE_ENV === 'development'){
	oauth2Client = new googleAuth.OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[1]);
} else {
	oauth2Client = new googleAuth.OAuth2Client(credentials.web.client_id, credentials.web.client_secret, credentials.web.redirect_uris[0]);
}

const authUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scope
});