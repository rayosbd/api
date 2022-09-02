# E-Commerce Backend
[Headless E-Commerce][repo] on MERN

## Features
##### API Documentation
- Swagger based API Documentation on `http://{BASE_URL}/doc` for teams and individuals working 

##### Categories
- Search, Sort & Filter to easily find categories
- Manage Categories & Sub-categories
- Toggle Categories & Sub-categories as "active" or "inactive"
- Manage Cateogires & Sub-categories Thumbnails

##### Product
- Search, Sort & Filter to easily find products
- Easily manage & edit products
- Toggle Products as "active" or "inactive"
- Get Related Products Based on Keywords, Category & Sub-category
- Embeded YouTube videos
- Manage Product Reviews [Delete]

##### Hot Deals
- Manage Hot Deal Product List
- Create Offer Session for Specific Deal
- Get State for on Deal Sale

##### Review Management
- Manage All Product Reviews

##### Customers
- Search, Sort & Filter to easily find customers
- Manage Customer Accounts
- View Customer Details & Previous Orders
- View individual Customers Product Reviews
- Toggle Customers as "active" or "inactive"
- Reset Customer Passwords


## Tech

The Application uses a Number of Open Source Projects to Work Properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Mongoose](https://mongoosejs.com/) - elegant mongodb object modeling for [node.js]
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) - This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express) - This module allows you to serve auto-generated swagger-ui generated API docs from express
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - An implementation of JSON Web Tokens (JWT)

And of course The Application itself is open source with a [public repository][repo]
 on GitHub.

## Installation

### .env

.templates.env has the template for the .env file. Description for the environment variables

| ENV Variable | Description |
| ------ | ------ |
| NAME | Project Name to View on Swagger |
| MONGO_DB | MongoDB Connection String |
| PORT | Port to Host. If not Provided, the app will be hosted on 4001 |
| JWT_SECRET | JWT Secret to Create Token |
| JWT_EXPIRE | Token Expriration Time, for example: 30d, 10min etc. |

### Run

The Application requires [node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server on development environment.

```sh
cd ecommerce-backend
npm i
npm i -g nodemon
npm run dev
```

For production environments...

```sh
cd ecommerce-backend
npm i
npm start
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [repo]: <https://github.com/tam11a/ecommerce-backend>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>

