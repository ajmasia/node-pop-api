# NodePop 0.2

A Rest API to learn coding

## Demo

You can find the last version of this API running at: [http://nodepop.antoniomasia.com](http://nodepop.antoniomasia.com)

The API is running behind an Nginx inverse proxy which also serves all app's static resources, like ad's images or css files, through HTTP port 80.

You can call the HTTP method GET /apiv1/ads to get a list of all test ads stored in the database. Each ad has an associated image stored in the virtual path /images/ads to test static files retrieving, for example:

Remeber to first get authenticated by calling HTTP method POST /apiv1/login, informing body keys email and password in the HTTP request (see sample user credentials below). To inform the access token in every API call, use header key x-access-token in the HTTP request or directly by url param.

`http://nodepop.antoniomasia.com/apiv1/ads?token=YOURTOKEN`

## Instalation

This app need a MongoDB engine to work. Before installing this app we must to know the correct parameters to access to database server.

To install NodePOP Rest API, move to app´s root directory and run this command:

`npm install`

When you install the app, you must configure the system parameters.

Copy file `.env.example` into `.env` and edit enviroment variables to setup this specific server installation.

```js
# Global apps params
APP_IMAGES_URL = 'http://localhost:3000/images/'
MONGO_URL = 'mongodb://localhost/'
DB_NAME = 'nodepop'
PORT = 3000

# Security config
JWT_SECRET = 'yoursecret'
JWT_EXP_TIME = 10
JWT_EXP_UNIT = 'd'
HASH_SALT = 10

# Test database install scripts
FILE_DATA = './test_data/test_data.json'
COLLECTION_NAME = 'ads'

# E2E test
TOKEN_TEST = 'token'
```

Finaly you must reset the database. Yo can do it running the next command:

`npm run dBreset`

Test data include an user that you can use to test NodeAPI:

| User             | Password |
| ---------------- | -------- |
| user@axample.com | 1234     |

## Start/Stop server

This app use an specific service to generate thunbnails when you upload images. Yo must run this service separately to use the app:

`npm run start`

To start the app, issue the following command:

`npm start services`

To stop all services, issue the following command:

`npm run stop-services`

If yoy want run the app in debbug mode run the next command:

`npm run dev`

To stop de app press CTRL + C keys.

When you access to the home page, you will can see a page with an ads list. In this page you can test the filters that are described in the API documentation.

## API Documentation

### Users

#### The API provides the following operations:

| Method | Result         | Route            |
| ------ | -------------- | ---------------- |
| POST   | Sing Up        | /apiv1/singup    |
| POST   | Sing In        | /apiv1/login     |
| DELETE | Delete user    | /apiv1/users/:id |
| PUT    | Update user    | /apiv1/users/:id |
| GET    | List all users | /apiv1/users     |

### Ads

#### The API provides the following operations:

| Method | Result          | Route          |
| ------ | --------------- | -------------- |
| GET    | List all ads    | apiv1/ads      |
| GET    | List all tags   | apiv1/ads/tags |
| GET    | Show add by id  | apiv1/ads/:id  |
| DELETE | Delete ad by id | apivi/ads/:id  |
| POST   | Create new add  | apiv1/ads      |
| PUT    | Update ad by id | apiv1/ads/:id  |

#### Filters:

| Filter     | Sample                  | Notes                 |
| ---------- | ----------------------- | --------------------- |
| by name    | apiv1/ads?name=...      | filter by string      |
| by forSale | apiv1/ads?forsale=true  | true or false         |
| by price   | apiv1/ads?price=100     | price = number        |
| by price   | apiv1/ads?price=100-    | price > number        |
| by price   | apiv1/ads?price=-100    | price < number        |
| by price   | apiv1/ads?price=100-500 | price between numbers |
| by price   | apiv1/ads?price=0       | price = 0 or null     |
| by tag     | apiv1/ads?tag=book      | ads with tag = string |

### Parameters:

| Parameter | Sample               | Notes                     |
| --------- | -------------------- | ------------------------- |
| field     | apiv1/ads?field=name | show only name field      |
| sort      | apiv1/ads?sort=name  | Sort adss by name         |
| sort      | apiv1/ads?sort=-name | Inverse sort adss by name |
| limit     | apiv1/ads?limit=2    | Show only 2 ads           |
| skip      | apiv1/ads?skip=3     | Fetch 3 ads               |

You can mix different filters:

`apiv1/ads?price=300-800&tag=phone&tag=xiaomi`

`apiv1/ads?price=-800&tag=phone&tag=xiaomi`

`apiv1/ads?price=125-450&field=name&limit=3`

`apiv1/ads?name=iPhone&price=700-1200&forsale=true&tag=apple`

## e2e tests

For API testing run `npm run e2e` command with app and database running.

You must define a valid token in `.env` config file.

## Change log NodeAPI 0.2

* Change confih method using .env file
* Users API implementation through controllers
* API authentification with JWT
* Views internacionalization [es, en]
* Uplade ads images
* Service to create thunbnails from ad image
* Simple API e2e test
