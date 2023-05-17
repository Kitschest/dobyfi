document.addEventListener('DOMContentLoaded', function() {
    // Get the "Load Balance" button element
    var loadBalanceButton = document.querySelector('.btn-success');
    
    // Add a click event listener to the button
    loadBalanceButton.addEventListener('click', function() {
      console.log('Load Balance button clicked!');
      // Perform other actions or function calls for your dashboard
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Get the list items containing the tasks
    var listItems = document.querySelectorAll('.list-group-item');
    
    // Iterate over each list item
    listItems.forEach(function(listItem) {
      // Get the "Validate" button within the current list item
      var validateButton = listItem.querySelector('.btn-success:first-of-type');
      
      // Add a click event listener to the "Validate" button
      validateButton.addEventListener('click', function() {
        // Add your logic for handling the validation action here
        console.log('Validated task:', listItem.textContent.trim());
      });
      
      // Get the "Delete" button within the current list item
      var deleteButton = listItem.querySelector('.btn-success:last-of-type');
      
      // Add a click event listener to the "Delete" button
      deleteButton.addEventListener('click', function() {
        // Add your logic for handling the delete action here
        console.log('Deleted task:', listItem.textContent.trim());
        listItem.remove(); // Remove the list item from the DOM
      });
    });
  });
  