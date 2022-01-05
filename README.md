# Biobot Kits

This app provides Search for Kits functionality.

## Available Scripts

In the project directory, you can run:

### `yarn db-setup`

Creates a Sqlite3 db and saves to db/local.sqlite3. It will also setup the kits table.

You can reset the DB by deleting the db/local.sqlite3 file and run this command again.

### `yarn api-start`

Runs the Koa api app in the development mode.\
Reachable at the url: [http://localhost:3001](http://localhost:3001). 

The api will reload on changes.

### `yarn api-build`

Builds the Koa api app for production to the `api/build` folder.

### `yarn ui-start`

Runs the React app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn ui-test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn ui-build`

Builds the React app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your React app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn ui-eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
