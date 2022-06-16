let rowCounter = 0;
let colCounter = 0;
let costMatrix = [];
let supplyMatrix = [];
let demandMatrix = [];

class Allocator {
  constructor(id, row, col, cost, allocatedAmount = 0, consumed = false) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.cost = cost;
    this.allocatedAmount = allocatedAmount;
    this.consumed = consumed;
  }
  updateAllocaiton(amount) {
    this.allocatedAmount += amount;
  }
}

class Supply {
  constructor(row, amount, consumed = false) {
    this.row = row;
    this.amount = amount;
    this.consumed = consumed;
  }
  used(amount) {
    this.amount -= amount;
  }
}

class Demand {
  constructor(col, amount, consumed = false) {
    this.col = col;
    this.amount = amount;
    this.consumed = consumed;
  }
  used(amount) {
    this.amount -= amount;
  }
}

function checnum(as) {
  var a = as.value;

  for (var x = 0; x < a.length; x++) {
    var ff = a[x];
    if (isNaN(a) && ff != '.') {
      a = a.substring(0, a.length - 1);
      as.value = a;
    }
  }
}

function matrix_form() {
  document.getElementById('frtab').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  var nrw = $('#nrw').val();
  var ncn = $('#ncn').val();

  rowCounter = nrw;
  colCounter = ncn;

  if (nrw == '') {
    alert('Enter number of rows value');
    $('#nrw').focus();
  } else if (ncn == '') {
    alert('Enter number of columns value');
    $('#ncn').focus();
  } else if (parseFloat(nrw) > 15) {
    alert('Enter number of rows below 15');
    $('#nrw').focus();
  } else if (parseFloat(ncn) > 15) {
    alert('Enter number of columns below 15');
    $('#ncn').focus();
  } else {
    nrw = parseFloat(nrw);
    ncn = parseFloat(ncn);

    var tabary = new Array();
    for (b = 0; b <= nrw; b++) {
      tabary[b] = new Array(ncn);
      for (a = 0; a <= ncn; a++) {
        tabary[b][a] =
          '<input type=text id=x' + b + a + ' size=3 onkeyup=checnum(this)>';
      }
    }

    // Declare variables and create the header, footer, and caption.
    var oTable = document.createElement('TABLE');
    var oTHead = document.createElement('THEAD');
    var oTBody = document.createElement('TBODY');
    var oRow, oCell;
    var i, j;

    // Insert the created elements into oTable.
    oTable.appendChild(oTHead);
    oTable.appendChild(oTBody);
    oTable.setAttribute('class', 'bg5');

    // Inserted the Heading elemnts into table
    oRow = document.createElement('TR');
    oTHead.appendChild(oRow);
    for (i = 0; i <= ncn + 1; i++) {
      oCell = document.createElement('TH');
      if (i == 0) {
        oCell.innerHTML = ' ';
      } else if (i == ncn + 1) {
        oCell.innerHTML = 'Supply';
      } else {
        oCell.innerHTML = 'D' + i;
      }
      oRow.appendChild(oCell);
    }

    // Insert rows and cells into bodies.
    for (i = 0; i < tabary.length; i++) {
      oRow = document.createElement('TR');
      oCell = document.createElement('TH');
      if (i == tabary.length - 1) {
        oCell.innerHTML = 'Demand';
      } else {
        oCell.innerHTML = 'S' + (i + 1);
      }

      oRow.appendChild(oCell);
      oTBody.appendChild(oRow);
      for (j = 0; j < tabary[i].length; j++) {
        oCell = document.createElement('TD');
        if (i == tabary.length - 1 && j == tabary[i].length - 1) {
          oCell.innerHTML = ' ';
        } else {
          oCell.innerHTML = tabary[i][j];
        }
        oRow.appendChild(oCell);
      }
    }

    oRow = document.createElement('TR');
    oTBody.appendChild(oRow);
    oCell = document.createElement('TD');
    oCell.setAttribute('colspan', ncn + 2);
    oCell.innerHTML =
      "<center> <input type=button value='Calculate' onclick='least_cost()'> <input type=reset value=Reset onclick='clear_all()'></center>";
    oRow.appendChild(oCell);

    // Insert the table into the document tree.
    var frtb = document.getElementById('frtab');
    frtb.appendChild(oTable);
  }
}

function clear_all() {
  document.getElementById('result').innerHTML = '';
  document.getElementById('frtab').innerHTML = '';
  document.getElementById('t').innerHTML = '';
  $('#nrw').val('');
  $('#ncn').val('');
  rowCounter = 0;
  colCounter = 0;
  costMatrix = [];
  supplyMatrix = [];
  demandMatrix = [];
}

function least_cost() {
  let totalSupply = 0;
  let totalDemand = 0;
  for (let row = 0; row < rowCounter; row++) {
    for (let col = 0; col < colCounter; col++) {
      let id = 'x' + row + col;
      costMatrix.push(
        new Allocator(id, row, col, parseFloat($(`#${id}`).val()), 0, false)
      );
    }
    let value = parseFloat($(`#x${row}${colCounter}`).val());
    totalSupply += value;
    supplyMatrix.push(new Supply(row, value));
  }

  for (let col = 0; col < colCounter; col++) {
    let value = parseFloat($(`#x${rowCounter}${col}`).val());
    totalDemand += value;
    demandMatrix.push(new Demand(col, value));
  }

  if (totalSupply !== totalDemand) {
    alert('Total supply and demand is not equal');
  } else {
    while (!allDemandsConsumed() && !allSuppliesConsumed()) {
      let minCost = opportunityFinder();
      if (minCost !== null) {
        if (
          supplyMatrix[minCost.row].amount >= demandMatrix[minCost.col].amount
        ) {
          minCost.updateAllocaiton(demandMatrix[minCost.col].amount);
          supplyMatrix[minCost.row].used(demandMatrix[minCost.col].amount);
          demandMatrix[minCost.col].used(demandMatrix[minCost.col].amount);
        } else {
          minCost.updateAllocaiton(supplyMatrix[minCost.row].amount);
          demandMatrix[minCost.col].used(supplyMatrix[minCost.row].amount);
          supplyMatrix[minCost.row].used(supplyMatrix[minCost.row].amount);
        }

        if (supplyMatrix[minCost.row].amount == 0) {
          supplyMatrix[minCost.row].consumed = true;
          consumeRow(minCost.row);
        }

        if (demandMatrix[minCost.col].amount == 0) {
          demandMatrix[minCost.col].consumed = true;
          consumeCol(minCost.col);
        }
      } else {
        break;
      }
    }
  }
  $('#result').html('Result is : ' + resultGenerator());
}

function opportunityFinder() {
  let rowDifference = -1;
  let selectedRow = -1;
  let minInSelectedRow = Infinity;
  let colDifference = -1;
  let selectedCol = -1;
  let minInSelectedCol = Infinity;
  let rowCheckSorted = [];
  let colCheckSorted = [];

  for (let row = 0; row < rowCounter; row++) {
    let rowCheck = [];
    if (!supplyMatrix[row].consumed) {
      costMatrix.forEach((element) => {
        if (element.row == row && !element.consumed) {
          rowCheck.push(element.cost);
        }
      });
    }

    if (rowCheck.length > 1) {
      rowCheckSorted = rowCheck.sort((a, b) => a - b);
      if (rowCheckSorted[1] - rowCheckSorted[0] >= rowDifference) {
        rowDifference = rowCheckSorted[1] - rowCheckSorted[0];
        if (minInSelectedRow > rowCheckSorted[0]) {
          selectedRow = row;
          minInSelectedRow = rowCheckSorted[0];
        }
      }
    } else if (rowCheck.length == 1 && rowCheck[0] >= rowDifference) {
      rowDifference = rowCheck[0];
      if (minInSelectedRow > rowCheck[0]) {
        selectedRow = row;
        minInSelectedRow = rowCheck[0];
      }
    }
  }

  for (let col = 0; col < colCounter; col++) {
    let colCheck = [];
    if (!supplyMatrix[col].consumed) {
      costMatrix.forEach((element) => {
        if (element.col == col && !element.consumed) {
          colCheck.push(element.cost);
        }
      });
    }

    if (colCheck.length > 1) {
      colCheckSorted = colCheck.sort((a, b) => a - b);
      if (colCheckSorted[1] - colCheckSorted[0] >= colDifference) {
        colDifference = colCheckSorted[1] - colCheckSorted[0];
        if (minInSelectedCol > colCheckSorted[0]) {
          selectedCol = col;
          minInSelectedCol = colCheckSorted[0];
        }
      }
    } else if (colCheck.length == 1 && colCheck[0] >= colDifference) {
      colDifference = colCheck[0];
      if (minInSelectedCol > colCheck[0]) {
        selectedRow = row;
        minInSelectedCol = colCheck[0];
      }
    }
  }

  let selected = null;

  if (rowDifference > colDifference) {
    selected = findInRow(selectedRow, minInSelectedRow);
  } else if (rowDifference < colDifference) {
    selected = findInCol(selectedCol, minInSelectedCol);
  } else {
    if (minInSelectedRow < minInSelectedCol) {
      selected = findInRow(selectedRow, minInSelectedRow);
    } else {
      selected = findInCol(selectedCol, minInSelectedCol);
    }
  }
  return selected;
}

function findInRow(row, minInRow) {
  let selected = null;
  costMatrix.forEach((element) => {
    if (element.row == row && element.cost == minInRow && !element.consumed) {
      selected = element;
    }
  });

  return selected;
}

function findInCol(col, minInCol) {
  let selected = null;
  costMatrix.forEach((element) => {
    if (element.col == col && element.cost == minInCol && !element.consumed) {
      selected = element;
    }
  });
  return selected;
}

function consumeRow(row) {
  costMatrix.forEach((costs) => {
    if (costs.row === row) {
      costs.consumed = true;
    }
  });
}

function consumeCol(col) {
  costMatrix.forEach((costs) => {
    if (costs.col === col) {
      costs.consumed = true;
    }
  });
}

function allDemandsConsumed() {
  let allConsumed = true;
  demandMatrix.forEach((demand) => {
    if (!demand.consumed) {
      allConsumed = false;
    }
  });
  return allConsumed;
}

function allSuppliesConsumed() {
  let allConsumed = true;
  supplyMatrix.forEach((supply) => {
    if (!supply.consumed) {
      allConsumed = false;
    }
  });
  return allConsumed;
}

function resultGenerator() {
  result = 0;
  resultString = '';
  costMatrix.sort(function (a, b) {
    return a.cost - b.cost;
  });
  for (let index = 0; index < costMatrix.length; index++) {
    const element = costMatrix[index];
    if (element.allocatedAmount > 0) {
      result += element.allocatedAmount * element.cost;
      resultString += `(${element.allocatedAmount} x ${element.cost}) + `;
    }
  }

  return resultString.substring(0, resultString.length - 3) + ' = ' + result;
}
