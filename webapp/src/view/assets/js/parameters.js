const allParams = [
  "download",
  "browse",
  "subscribe",
  "stream",
  "auto_download"
];

const colors = ["#b1063a", "#de6212", "#000000", "#ffffff", "#1b7700"];

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

$(function() {
  $("#startDatePicker").datepicker({ dateFormat: "yy-mm-dd" });
  $("#endDatePicker").datepicker({ dateFormat: "yy-mm-dd" });
  updateDateFields();
});

function updateDateFields() {
  $("#startDatePicker").datepicker("setDate", new Date(startDate));
  $("#endDatePicker").datepicker("setDate", new Date(endDate));
}

function dateFieldChanged() {
  startDate = $("#startDatePicker").val();
  endDate = $("#endDatePicker").val();
  updateCharts();
}

function updateCharts() {
  loadDataForChart1(fields);
  loadDataForChart2(fields, startDate, endDate);
  loadDataForChart3();
  updateDateFields();
}

function checkBoxChanged() {
  var tmpFields = [];
  allParams.forEach(function(param, index) {
    if (document.getElementById("checkbox" + index).checked)
      tmpFields.push(param);
  });
  fields = tmpFields;

  updateCharts();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
