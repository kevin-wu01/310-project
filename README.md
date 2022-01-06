# CPSC 310 Project Repository

This is a full-stack web application developed in my CPSC 310 class. The frontend is simple HTML/CSS/JS with a Typescript backend and express for the API endpoints.
The backend implements querying on past statistics gathered on the courses offered at UBC (ex. class average, pass count, instructor name, etc.). It also supports querying on the individual classrooms (ex. # of seats, lat/lon location, etc.). This information is then passed to the frontend to be displayed.  

### Testing

Both the API endpoints and the backend implementation was unit tested using mocha and chai. 

## Project commands


1. `yarn install` to download the project packages.

1. `yarn build` to compile the project. You must run this command after making changes to the TypeScript files.

1. `yarn test` to run the test suite.

1. `yarn pretty` to prettify project code.

