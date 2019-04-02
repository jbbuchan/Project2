var account;
var admin;
function LogOn(uid, pass)
{
    var webMethod = "AccountServices.asmx/LogOn";
    var parameters = "{\"uid\":\"" + encodeURI(uid) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

        $.ajax({
            type: "POST",
            url: webMethod,
            data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg)
            {
                if (msg.d)
                {
                    LoadAccount();
                }
                else
                {
                    alert("logon failed");
                }
            },
            error: function (e)
            {
                alert("boo...");
            }
        });
}


function LoadAccount() {
    var webMethod = "AccountServices.asmx/GetAccount";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                account = msg.d;
                admin = account[0].admin;

                if (admin == "1") {
                    window.location = './empDashboardAdmin2.html';
                }
                if (admin == "0") {
                    
                    window.location = './empDashboard.html';
                    
                }
                
                
            }
        }
        ,
        error: function (e) { alert("server error"); }
    });
}

//logs the user off both at the client and at the server
function LogOff()
{
    var webMethod = "AccountServices.asmx/LogOff";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                //we logged off, so go back to logon page,
                //stop checking messages
                //and clear the chat panel
                window.location = "./loginpage.html";
            }
            else
            {
                alert("failed");
            }
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

function SubmitProblems(Priority, Subject, description, solution)
//store problemID, UserID, Priority, Subject, description, solution, solved
{
    var webMethod = "AccountServices.asmx/SubmitProblems";
    var parameters = "{\"Priority\":\"" + encodeURI(Priority) +
        "\",\"Subject\":\"" + encodeURI(Subject) +
        "\",\"description\":\"" + encodeURI(description) +
        "\",\"solution\":\"" + encodeURI(solution) + "\"}";
    console.log(parameters);

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            window.location = "./empDashboard.html";
        },
        error: function (e) {
            alert("Server error");
        }
    });
}        
	var problemsList;
    
	function GetProblems() {
		var webMethod = "AccountServices.asmx/GetProblems";
		$.ajax({
			type: "POST",
			url: webMethod,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (msg) {
                if (msg.d.length > 0)
                {
                    LoadAccount2();
                    problemsList = msg.d;
                    var problem;

                    for (var j = 0; j < problemsList.length; j++) {
                        var severity = problemsList[j].Priority;
                        if (severity == "low") {
                            problem = "<div class='#'>" +
                                "<a class='#' href='javascript:LoadProblem(" + problemsList[j].problemID + ")'>" +
                                problemsList[j].problemID + " | " + problemsList[j].Subject + " | " + problemsList[j].Priority +
                                "</a></div>"

                            $("#myProblemsDiv").append(problem);
                        }
                    }
                    for (var j = 0; j < problemsList.length; j++) {
                        var severity = problemsList[j].Priority;
                        if (severity == "medium") {
                            problem = "<div class='#'>" +
                                "<a class='#' href='javascript:LoadProblem(" + problemsList[j].problemID + ")'>" +
                                problemsList[j].problemID + " | " + problemsList[j].Subject + " | " + problemsList[j].Priority +
                                "</a></div>"

                            $("#myProblemsDiv").append(problem);
                        }
                    }
                    for (var j = 0; j < problemsList.length; j++) {
                        var severity = problemsList[j].Priority;
                        if (severity == "high") {
                            problem = "<div class='#'>" +
                                "<a class='#' href='javascript:LoadProblem(" + problemsList[j].problemID + ")'>" +
                                problemsList[j].problemID + " | " + problemsList[j].Subject + " | " + problemsList[j].Priority +
                                "</a></div>"

                            $("#myProblemsDiv").append(problem);
                        }
                    }
                    

					//for (var k = 0; k < submitproblemsArray.length; k++) {
					//  //if (submitproblemsArray[i].Solved === true) {
					//  //  submitproblemsTry.push(submitproblemsArray[i]);
					//  //}
					//  //else {
					//  submitproblemsTry.push(submitproblemsArray[k]);
					//}
					//}

					//for (var l = 0; l < submitproblemsTry.length; l++) {
					//	var restT2;
					//	restT2 = "<div class='submitproblemsRow' id='restT2" + [l].Priority + "'>" +
					//		"<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsTry[l].Priority + ")'>" +
					//		submitproblemsTry[l].Priority + " : "
					//	"</a>"

					//	$("#submitproblemsPriority").append(restT2);
					//}


					////for (var m = 0; m < submitproblemsArray.length; m++) {
					////  //if (submitproblemsArray[i].Solved === true) {
					////  //  submitproblemsTry.push(submitproblemsArray[i]);
					////  //}
					////  //else {
					////  submitproblemsTry.push(submitproblemsArray[m]);
					////}
					////}

					//for (var n = 0; n < submitproblemsTry.length; n++) {
					//	var restT3;
					//	restT3 = "<div class='submitproblemsRow' id='restT3" + [n].Subject + "'>" +
					//		"<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsTry[n].Subject + ")'>" +
					//		submitproblemsTry[n].Subject + " : "
					//	"</a>"

					//	$("#submitproblemsSubject").append(restT3);
					//}


					////for (var o = 0; o < submitproblemsArray.length; o++) {
					////  //if (submitproblemsArray[i].Solved === true) {
					////  //  submitproblemsTry.push(submitproblemsArray[i]);
					////  //}
					////  //else {
					////  submitproblemsTry.push(submitproblemsArray[o]);
					////}
					////}

					//for (var p = 0; p < submitproblemsTry.length; p++) {
					//	var restT4;
					//	restT4 = "<div class='submitproblemsRow' id='restT4" + [p].description + "'>" +
					//		"<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsTry[p].description + ")'>" +
					//		submitproblemsTry[p].description + " : "
					//	"</a>"

					//	$("#submitproblemsDescription").append(restT4);
					//}


					////for (var q = 0; q < submitproblemsArray.length; q++) {
					////  //if (submitproblemsArray[i].Solved === true) {
					////  //  submitproblemsTry.push(submitproblemsArray[i]);
					////  //}
					////  //else {
					////  submitproblemsTry.push(submitproblemsArray[q]);
					////}
					////}

					//for (var r = 0; r < submitproblemsTry.length; r++) {
					//	var restT5;
					//	restT5 = "<div class='submitproblemsRow' id='restT5" + [r].solution + "'>" +
					//		"<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsTry[r].solution + ")'>" +
					//		submitproblemsTry[r].solution + " : "
					//	"</a>"

					//	$("#submitproblemsSolution").append(restT5);
					//}


					////for (var s = 0; s< submitproblemsArray.length; s++) {
					////  //if (submitproblemsArray[i].Solved === true) {
					////  //  submitproblemsTry.push(submitproblemsArray[i]);
					////  //}
					////  //else {
					////  submitproblemsTry.push(submitproblemsArray[s]);
					////}
					////}

					//for (var t = 0; t < submitproblemsTry.length; t++) {
					//	var restT6;
					//	restT6 = "<div class='submitproblemsRow' id='restT6" + [t].UserID + "'>" +
					//		"<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsTry[t].UserID + ")'>" +
					//		submitproblemsTry[t].UserID + " : "
					//	"</a>"

					//	$("#submitproblemsUserID").append(restT6);
					//}

					////for (var k = 0; k < submitproblemsReviewed.length; k++) {
					////  var restR;
					////  restR = "<div class='restaurantRow' id='restR" + [k].problemID + "'>" +
					////      "<a class='nameTag' href='javascript:LoadSubmitProblems(" + submitproblemsReviewed[k].problemID + "'>" +
					////      submitproblemsReviewed[k].Priority + " : " + submitproblemsReviewed[k].solution +
					////      "</a>"

					////  $("#submitproblemsReviewed").append(restR);
					////}
				}
			},
			error: function (e) {
				alert("server error");
			}
		});
}

var account;
var admin;
function LoadAccount2() {
    var webMethod = "AccountServices.asmx/GetAccount";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                //let's put our accounts that we get from the
                //server into our accountsArray variable
                //so we can use them in other functions as well
                account = msg.d;
                //this clears out the div that will hold our account info
                admin = account[0].admin;
                //again, we assume we're not an admin unless we see data from the server
                //that we know only admins can see

            }
        }

    });
}

var adminProblems;

function GetProblemsAdmin() {
    var webMethod = "AccountServices.asmx/GetProblems";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                
                adminProblems = msg.d;

                for (var j = 0; j < adminProblems.length; j++) {
                    var severity = adminProblems[j].Priority;

                    if (severity == "critical") {
                        problem = "<div class='#'>" +
                            "<a class='#' href='javascript:LoadProblem(" + adminProblems[j].problemID + ")'>" +
                            adminProblems[j].problemID + " | " + adminProblems[j].Subject + " | " + adminProblems[j].Priority +
                            "</a></div>"

                        $("#myProblemsDiv").append(problem);
                    }
                }
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}


function loadDashboard()
{
    GetProblems();
}
function loadDashboardAdmin() {
    GetProblemsAdmin();
}

function redirect()
{
    window.location = 'logingpage.html';
}

