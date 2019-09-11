## Reace Fullstack
This project is a backend API part of Reace.

### Technologies Used
1. Node v10
2. MySql v5
3. ExpressJs v4
4. Sequelize v5

### Local Setup
1. Install Node v10
2. Install MySql v5
3. Create 1 MySql Databases for development 
4. Update the connection string in `config/default.json` 
5. Run the `scripts/reace_db_table_creation.sql` inside  the databases. This will initialize all tables and add some test data.
6. Run `npm install` to download dependencies
7. Run `npm start` to start the local server. Now you can access api using `http://localhost:3000/*` url. 




### Manual testing
To test the API manually, you need to
1. Import `docs/reace-api.postman_collection.json`
2. Import `docs/reace-api.postman_environment.json`
3. Now select the `reace-api` environment
4. Now explore the `reace-api` collection and test the endpoints manually 

### Code Structure and Architecture
##### `/config` 
1. Contains configuration files
2. default.json has all config properties used with default values
3. Configs defined test.json and production.json will override the default.json values
4. Following environment variables also supported. If they are present, they will override values in all other files. `DATABASE_URL`, `LOG_LEVEL`, `PORT`.

##### `/docs`
Contains postman collection and environment files. These files can be imported in Postman to test the endpoints manually

##### `/scripts`
Contains sql scripts. Now it has only the database init script `reace_db_table_creation.sql`. This is used to initialize the new database.

##### `/src`
1. Contains the source code for backend api
2. `/src/app.js` bootstraps the app and starts the server
3. `/src/controllers` This folder contains all controllers. **Controllers are responsible for routing, validation, authentication and handling the requests**. 
No separate route file is created. Routes are co-located with their respective action in controller. So it is easy to debug a certain route since routes, validations and middlewares are all co-located.
Controllers follows **Conventions over configurations** approach to achieve this**
4. `/src/services` Services are responsible for everything that requires accessing database like querying, updating and creating records in database.
5. `/src/models` Models define Sequelize schema based on database architecture. Also configures the associations




