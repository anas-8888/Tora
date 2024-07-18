function getFocusedElementId() {
      var activeElement = document.activeElement;
      return activeElement.id; // This will return the ID of the focused element
  }
  

function getCurrentFocusedRow() {
      var activeElement = document.activeElement;
      var currentRow = activeElement.closest('tr');
      return currentRow;
}
  
function focusNextRow(currentRow) {
      var nextRow = currentRow.nextElementSibling;
      if (nextRow) {
          var input = nextRow.querySelector('input');
          if (input) {
              input.focus();
          }
      }
  }
var i=2;

function addRow() {
      var table = document.getElementById('datatablesSimple');
      var newRow = table.insertRow(-1); // -1 appends the new row at the end of the table
      var cell1 = newRow.insertCell(0);
      var cell2 = newRow.insertCell(1);
      var cell3 = newRow.insertCell(2);
      var cell4 = newRow.insertCell(3);
      var cell5 = newRow.insertCell(4);
      var cell6 = newRow.insertCell(5);
      
      newRow.id = `row${i++}`; 
      cell1.innerHTML = "<i class='fas fa-trash-alt'></i>";
      cell2.innerHTML = `<input type="text" id="barcode${i}" class="pppar"/>`;
      cell3.innerHTML = `<input type="text" id="nameProduct${i}"/>`;
      cell4.innerHTML = `<input type="text" id="priceProduct${i}"/>`;
      cell5.innerHTML = `<input type="text" id="quantityProduct${i}"/>`;
      cell6.innerHTML = `<input type="text" id="totalPriceProduct${i}"/>`;
      setupFirstColumnClickToDeleteRow();
}
  
document.getElementById(`${getFocusedElementId()}`).addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
            addRow();
            focusNextRow(getCurrentFocusedRow());
      }
}); 

function deleteRowById() {
      var row = document.getElementById(getFocusedElementId());
      if (row && row.parentNode) {
          row.parentNode.removeChild(row);
      }
}

function setupFirstColumnClickToDeleteRow() {
      var table = document.getElementById('datatablesSimple');
      for (var i = 1; i < table.rows.length; i++) {
          var firstCell = table.rows[i].cells[0];
          firstCell.onclick = function() {
              var rowIndex = this.parentNode.rowIndex;
              table.deleteRow(rowIndex);
          };
      }
}


  
  