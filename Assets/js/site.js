var data;
$(document).ready(function () {
    initData(function () { initGrid() });
});

function initData(callback) {
    // data = [
    //     {
    //         name: "Prashik Dhakane",
    //         billable: true,
    //         otherSkills: "Angular, React etc.",
    //         comments: ["Comment1", "Comment2"],
    //         designation: "Manager"
    //     },
    //     {
    //         name: "Ganesh Ronge",
    //         billable: true,
    //         otherSkills: "Angular, React etc.",
    //         comments: ["Comment1", "Comment2"],
    //         designation: "Manager"
    //     },
    //     {
    //         name: "Dnyanewar Bhosale",
    //         billable: true,
    //         otherSkills: "Angular, React etc.",
    //         comments: ["Comment1", "Comment2"],
    //         designation: "Manager"
    //     },
    //     {
    //         name: "Pratiksha Jadhav",
    //         billable: true,
    //         otherSkills: "C#",
    //         comments: ["Comment1", "Comment2"],
    //         designation: "Employee"
    //     }
    // ];

    $.ajax({
        url: "https://localhost:7152/Employee",
        type: "GET",
        success: function (response) {
            data = response.employeeList;
            callback();
        }
    });
}

function initGrid() {
    var columnsArray = getColumns();

    if (!columnsArray)
        return false;

    var columns = "";
    var tr = "<tr>";
    $(columnsArray).each(function (i, e) {
        tr += "<th>" + e + "</th>";
    });
    tr += "</tr>";
    columns += tr;

    var rows = "";
    $(data).each(function (rowIndex, e) {
        var tr = "<tr>";

        var weeklyTotal = 0;
        $(columnsArray).each(function (i, val) {
            switch (i) {
                case 0: tr += "<td>" + (rowIndex + 1) + "</td>"; break;
                case 1: tr += "<td>" + e.name + "</td>"; break;
                case 2: tr += "<td>" + (e.billable ? "Yes" : "No") + "</td>"; break;
                case 3: tr += "<td>" + e.otherSkills + "</td>"; break;
                case 4: tr += "<td>" + e.comments.length + "</td>"; break;
                default: {

                    if (val == "Total") {
                        var weeklyPer = (weeklyTotal * 100) / 160;
                        tr += "<td><hr style='background-image: linear-gradient(to right, green " + weeklyPer + "% , yellow)' class='weeklyChart'/></td>";
                        weeklyTotal = 0;
                    }
                    else {
                        var number = getRandomNumber(1, 40);
                        weeklyTotal += parseInt(number);
                        tr += "<td>" + number + "</td>";
                    }
                };
            }
        });

        tr += "</tr>";
        rows += tr;
    });

    $(".tblTimesheet thead").html(columns);
    $(".tblTimesheet tbody").html(rows);
}

function getColumns() {
    var columnsArray = ["#", "RESOURCE", "BILLABLE", "OTHER SKILLS", "COMMENTS"];
    //Logic to calculate number columns based upon start and end dates

    var startDateStr = $("input[name='startDate']").val();
    var endDateStr = $("input[name='endDate']").val();

    if (startDateStr == "") {
        alert("Please select start date.")
        return false;
    }

    if (endDateStr == "") {
        alert("Please select end date.")
        return false;
    }

    var startDate = moment(startDateStr);
    var endDate = moment(endDateStr);
    var noOfDays = endDate.diff(startDate, "days");

    //var noOfWeeks = 4;
    var noOfWeekDays = 7;

    for (var i = 1; i <= noOfDays / noOfWeekDays; i++) {
        var date = moment(startDate).format('DD/MM');
        columnsArray.push(date);

        startDate = startDate.add(noOfWeekDays, "days");
        if (i % 4 == 0) {
            columnsArray.push("Total");
        }
    }

    return columnsArray;
}

function getRandomNumber(min, max) {
    return (Math.random() * (max - min) + min).toFixed(0);
}