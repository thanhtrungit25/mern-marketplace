# MERN Skeleton

A skeleton application with basic user CRUD and auth features - developed using React, Node, Express and MongoDB.

![MERN Skeleton](https://mernbook.s3.amazonaws.com/git+/skeleton2.png "MERN Skeleton")

### [Live Demo](http://skeleton2.mernbook.com/ "MERN Skeleton")

#### What you need to run this code
1. Node (13.12.0)
2. NPM (6.14.4) or Yarn (1.22.4)
3. MongoDB (4.2.0)

####  How to run this code
1. Make sure MongoDB is running on your system
2. Clone this repository
3. Open command line in the cloned folder,
   - To install dependencies, run ```  npm install  ``` or ``` yarn ```
   - To run the application for development, run ```  npm run development  ``` or ``` yarn development ```
4. Open [localhost:3000](http://localhost:3000/) in the browser
----

#### Features
- [x] Users with seller accounts #feature @trungdg 2021-05-15
  - [x] Update the user model
  - [x] Edit Profile view
  - [x] Add a MY SHOPS link to the menu that will only by visible to sellers
- [ ] Shop management
  - [ ] Adding shops to the marketplace
    - [x] Defining a shop model
    - [x] Creating a new shop
      - [x] The create shop API
      - [x] Test create shop API
      - [x] Load image API for specific shop
    - [x] Listing all shops
      - [x] Listing all shops API
      - [x] fetch method on frontend to request to API
      - [x] React component to display the list of shops
    - [x] Listing shops by owner
    - [ ] Displaying a shop
    - [ ] Editing a shop
    - [ ] Deleting a shop
- [ ] Product management
- [ ] Product search by name and category

