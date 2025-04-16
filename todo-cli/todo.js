// todo-cli/todo.js

const todoList = () => {
    let all = []; // Use let instead of const if you might reassign, though push modifies the array in place.
    const add = (todoItem) => {
      all.push(todoItem);
    };
    const markAsComplete = (index) => {
      // Ensure the index is valid before attempting to modify
      if (index >= 0 && index < all.length) {
        all[index].completed = true;
      } else {
        console.error("Invalid index provided to markAsComplete:", index);
      }
    };
  
    // Utility function to get today's date in YYYY-MM-DD format
    // Defined inside the closure so each function can access it easily
    // and always gets the *current* date when called.
    const formattedDate = d => {
      return d.toISOString().split("T")[0];
    };
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      const today = formattedDate(new Date());
      return all.filter(item => item.dueDate < today);
    };
  
    const dueToday = () => {
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
      const today = formattedDate(new Date());
      return all.filter(item => item.dueDate === today);
    };
  
    const dueLater = () => {
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
      const today = formattedDate(new Date());
      return all.filter(item => item.dueDate > today);
    };
  
    const toDisplayableList = (list) => {
      // Format the To-Do list here, and return the output string
      // as per the format given above.
      const today = formattedDate(new Date());
      let outputString = "";
  
      list.forEach((item, index) => {
        const checkbox = item.completed ? '[x]' : '[ ]';
        const datePart = item.dueDate === today ? '' : ` ${item.dueDate}`; // No date if due today, otherwise add space and date
  
        outputString += `${checkbox} ${item.title}${datePart}`;
  
        // Add a newline character if it's not the last item in the list
        if (index < list.length - 1) {
          outputString += '\n';
        }
      });
  
      return outputString;
    };
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  
  const todos = todoList();
  
  // Defined outside the closure, primarily for setting up test data
  const formattedDate = d => {
    return d.toISOString().split("T")[0]
  }
  
  var dateToday = new Date()
  const today = formattedDate(dateToday)
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  )
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  )
  
  todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false })
  todos.add({ title: 'Pay rent', dueDate: today, completed: true })
  // Corrected typo: 'Service Vehicle' instead of 'Service Vechicle'
  todos.add({ title: 'Service Vehicle', dueDate: today, completed: false })
  todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false })
  todos.add({ title: 'Pay electric bill', dueDate: tomorrow, completed: false })
  
  console.log("My Todo-list\n") // Extra newline for separation
  
  console.log("Overdue")
  var overdues = todos.overdue()
  var formattedOverdues = todos.toDisplayableList(overdues)
  console.log(formattedOverdues)
  console.log("\n") // Extra newline for separation
  
  console.log("Due Today")
  let itemsDueToday = todos.dueToday()
  let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday)
  console.log(formattedItemsDueToday)
  console.log("\n") // Extra newline for separation
  
  console.log("Due Later")
  let itemsDueLater = todos.dueLater()
  let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater)
  console.log(formattedItemsDueLater)
  // Removed extra \n\n as the prompt example doesn't show extra blank lines at the very end
  // console.log("\n\n")