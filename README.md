# NodePop
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

### The API provides the following operations:

| Method  | Result | Route |
| ------------- | ------------- | ------------- |
| GET | List all ads | apiv1/ |
| GET | List all tags | apiv1/tags |
| GET | Show add by id | apiv1/:id |
| DELETE | Delete ad by id | apivi/:id |
| POST | Create new add | apiv1/ |
| PUT | Update ad by id | apiv1/:id |

### Filters:

| Filter | Sample | Notes | 
| ------------- | ------------- | ------------- |
| by name | apiv1?name=... | filter by string |
| by forSale | apiv1?forsale=true | true or false |
| by price | apiv1?price=100 | price = number |
| by price | apiv1?price=100- | price > number |
| by price | apiv1?price=-100 | price < number |
| by price | apiv1?price=100-500 | price between numbers |
| by price | apiv1?price=0 | price = 0 or null |
| by tag | apiv1?tag=book | ads with tag = string |

### Parameters:
| Parameter | Sample | Notes |
| ------------- | ------------- | ------------- |
| field | apiv1?field=name | show only name field |
| sort | apiv1?sort=name | Sort adss by name |
| sort | apiv1?sort=-name | Inverse sort adss by name |
| limit | apiv1?limit=2 | Show only 2 ads |
| skip | apiv1?skip=3 | Fetch 3 ads |


You can mix different filters:

`apiv1?price=300-800&tag=phone&tag=xiaomi`

`apiv1?price=-800&tag=phone&tag=xiaomi`

`apiv1?price=125-450&field=name&limit=3`

`apiv1?name=iPhone&price=700-1200&forsale=true&tag=apple`








