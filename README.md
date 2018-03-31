# NodePop 0.2
A Rest API to learn coding

## Instalation
This app need a MongoDB engine to work. Before installing this app we must to know the correct parameters to access to database server.

To install NodePOP Rest API, move to app´s root directory and run this command:

`npm install`

When you install the app, you must configure the system parameters. You can do it by editing the file `config.js`. If you are going to test the app on a local server, you can use default parameters.

```js
module.exports = {
    port: process.env.PORT || 3000,
    mongoURL: process.env.MONGODB || 'mongodb://localhost/',
    db: process.env.DB || 'nodepop',
    collectionName: process.env.COLLECTION_NAME || 'ads',
    fileData: process.env.FILE_TEST_DATA || './test_data/testData.json'
}
```
Finaly you must reset the database. Yo can do it running the next command: 

`npm run dBreset`

## Start/Stop service

To start the app, issue the following command:

`npm start`

If yoy want run the app in debbug mode run the next command:

`npm run dev`

To stop de app press CTRL + C keys.

When you access to the home page, you will can see a page with an ads list. In this page you can test the filters that are described in the API documentation.

## API Documentation

### Users

### Ads

#### The API provides the following operations:

| Method  | Result | Route |
| ------------- | ------------- | ------------- |
| GET | List all ads | apiv1/ads |
| GET | List all tags | apiv1/ads/tags |
| GET | Show add by id | apiv1/ads/:id |
| DELETE | Delete ad by id | apivi/ads/:id |
| POST | Create new add | apiv1/ads |
| PUT | Update ad by id | apiv1/ads/:id |

#### Filters:

| Filter | Sample | Notes | 
| ------------- | ------------- | ------------- |
| by name | apiv1/ads?name=... | filter by string |
| by forSale | apiv1/ads?forsale=true | true or false |
| by price | apiv1/ads?price=100 | price = number |
| by price | apiv1/ads?price=100- | price > number |
| by price | apiv1/ads?price=-100 | price < number |
| by price | apiv1/ads?price=100-500 | price between numbers |
| by price | apiv1/ads?price=0 | price = 0 or null |
| by tag | apiv1/ads?tag=book | ads with tag = string |

### Parameters:
| Parameter | Sample | Notes |
| ------------- | ------------- | ------------- |
| field | apiv1/ads?field=name | show only name field |
| sort | apiv1/ads?sort=name | Sort adss by name |
| sort | apiv1/ads?sort=-name | Inverse sort adss by name |
| limit | apiv1/ads?limit=2 | Show only 2 ads |
| skip | apiv1/ads?skip=3 | Fetch 3 ads |


You can mix different filters:

`apiv1/ads?price=300-800&tag=phone&tag=xiaomi`

`apiv1/ads?price=-800&tag=phone&tag=xiaomi`

`apiv1/ads?price=125-450&field=name&limit=3`

`apiv1/ads?name=iPhone&price=700-1200&forsale=true&tag=apple`


## New in NodeApi 0.2
- Change confih method using .env file
- Users model implementation
- Users API implementation
- Authentification with JSWT




