const allParams = [
  "download",
  "browse",
  "subscribe",
  "stream",
  "auto_download"
];

var startDate,
  endDate,
  fields,
  charts = {};

var currentDate = new Date(2017, 10, 10); //10.11.2017 -> 09.11. toJson

startDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 1,
  2
).toJSON();
startDate = startDate.substring(0, startDate.indexOf("T"));
endDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
).toJSON();
endDate = endDate.substring(0, endDate.indexOf("T"));
fields = ["download"];

console.log(currentDate.toJSON());
console.log(
  currentDate.getFullYear() +
    " " +
    currentDate.getMonth() +
    " " +
    currentDate.getDate()
);

function dateToLast3Days() {
  //currentDate = new Date();
  var newStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 2
  ).toJSON();
  newStartDate = newStartDate.substring(0, newStartDate.indexOf("T"));
  var newEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  ).toJSON();
  newEndDate = newEndDate.substring(0, newEndDate.indexOf("T"));
  if (
    new Date(newStartDate) - new Date(startDate) != 0 ||
    new Date(newEndDate) - new Date(endDate)
  ) {
    startDate = newStartDate;
    endDate = newEndDate;
    updateCharts();
  }
}

function dateToLastWeek() {
  //currentDate = new Date();
  var newStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 6
  ).toJSON();
  newStartDate = newStartDate.substring(0, newStartDate.indexOf("T"));
  var newEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 1
  ).toJSON();
  newEndDate = newEndDate.substring(0, newEndDate.indexOf("T"));
  if (
    new Date(newStartDate) - new Date(startDate) != 0 ||
    new Date(newEndDate) - new Date(endDate)
  ) {
    startDate = newStartDate;
    endDate = newEndDate;
    updateCharts();
  }
}

function dateToLastMonth() {
  //currentDate = new Date();
  var newStartDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    2
  ).toJSON();
  newStartDate = newStartDate.substring(0, newStartDate.indexOf("T"));
  var newEndDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).toJSON();
  newEndDate = newEndDate.substring(0, newEndDate.indexOf("T"));
  if (
    new Date(newStartDate) - new Date(startDate) != 0 ||
    new Date(newEndDate) - new Date(endDate)
  ) {
    startDate = newStartDate;
    endDate = newEndDate;
    updateCharts();
  }
}

function updateCharts() {
  loadDataForChart1();
  loadDataForChart2();
  loadDataForChart3();
}

function checkBoxChanged() {
  var tmpFields = [];
  allParams.forEach((param, index) => {
    if (document.getElementById("checkbox" + index).checked)
      tmpFields.push(param);
  });
  fields = tmpFields;

  updateCharts();
}