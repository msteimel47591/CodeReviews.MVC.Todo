# Todo List

This is a project for the c# academy roadmap MVC section. It is a single page application
that utilizes minimal api and fetch api to perform CRUD operations on todo items in a
sqlite database.

## Project Requirements

* This is an application where you should manage a todo list.

* Users should be able to Add, Delete, Update and Read from a database, using a SPA (single-page application). The user should never be redirected to a new page.

* You need to write a minimal API to connect the front-end and database.

* You need to use the JS Fetch API from your front-end to call your minimal API in the backend.

* You need to use Entity Framework, raw SQL isn't allowed.

* You don't need a navigation bar. No menu is necessary since you'll only have one page.

* Once you execute any operation, the todo-list needs to be updated accordingly.

* Your data model is only one table with to-dos. You. might be tempted to create more complex data-models (categories of todos for example) but avoid that for now. We're focusing on the front-end.

* When deleting, present an 'Are you sure?' confirmation message

* Upon updating, present a message saying the record hasn't been updated until the user submits the new todo. Then present a success message.

### Notes

* The last requirement was unclear to me. I ended up adding a popover on the save changes button of the update modal that displays
  "Item is not updated until the save button is clicked" in attempt to satisfy the last requirement.
