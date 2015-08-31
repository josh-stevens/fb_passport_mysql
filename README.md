# Facebook + Passport + MySQL server

This repo is a skeleton framework for a JavaScript application that uses Passport and MySQL. It already has a
Facebook authentication strategy built-in. You'll need to have MySQL installed and running.

To get started with this repo, first run `npm install` to grab the necessary dependencies. Next,
put your database name, login, password, and url in the server.js file inside the mysql.createConnection function.
Now, from the config directory of this repo, type `mysql [db_name] < schema.sql` where [db_name] is the name
of your database.

Finally, to set up Facebook authentication, you will need to create a Facebook app from
https://developers.facebook.com/. Make sure it is pointing to the correct domain for your application. Then,
create a file called `auth.js` in the config folder and write the following code:

    module.exports = {
      'facebookAuth' : {
        'clientID': 'APP_ID_HERE',
        'clientSecret': 'APP_SECRET_HERE',
        'callbackURL': 'http://YOUR.APP.LOCATION/auth/facebook/callback'
      }
    }
    
Be sure to replace APP_ID_HERE, APP_SECRET_HERE, and YOUR.APP.LOCATION with the appropriate information.

Special thanks to [Brent Aureli](https://github.com/BrentAureli) for his tutorials on getting Facebook
authentication to work. This repo is a modified version of his Facebook authentication tutorial, using
MySQL instead of MongoDB.
