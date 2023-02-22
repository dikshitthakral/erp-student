# ERP School Management Service
The Task is Building a RESTful APIs from scratch using Express - Node.js. The Entities are a “School” and “Students”.


# Prerequisites
 
What things you need to install the software and how to install them

* Node : https://nodejs.org/en/download/
* Postgres : https://www.postgresql.org/download/

# How to Run the application

  * install npm packages:
    ```
    npm install
    ```
  * download postgres and setup the database and change the URL is properties-config 
    in DB : postgres://YourUserName:YourPassword@YourHost:5432/YourDatabase (For 
    reference) 
  * run the service
    ```
    npm start
    ```
  * This will start the server and you can visit the API endpoint on localhost:2000 to 
    start using the API.
    ```
    http://localhost:2000
    ```
  * Please add few sample records in tables :

    INSERT INTO public."Categories" (name, type, model) VALUES
        ('Nikon', 'mocroless', 2010),
        ('Nikon', 'shoot', 2018),
        ('Canon', 'point', 2018),
        ('Canon', 'Full Frame', 2016)

    Insert Into public."Products" (name, description, price, make, "categoryId") 
        Values
        ('Nikon D3200', 'Nikon microless', 32000, 2010, 1),
        ('Nikon D5100', 'Nikon shoot', 48000, 2018, 2),
        ('Canon I12', 'Canon full frame', 28000, 2016, 3)

## Build With
* Node - The runtime server framework used
* ExpressJS - minimalist web framework for Node.js

## Development

Default port is 8080.

### UnitTests
 * Command to run Unit test cases
   ```
   npm run test
   Just have setup the framework for writing test 
   cases.Added modules like mocha ,chai and sinon.
   ```
   
If you're using VSCode as your IDE, simply hit F5 to run the service.  While the service is running, you can use swagger, 
Postman, or curl to exercise the API.

## Happy Contributing!
