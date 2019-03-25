function LogOn(uid, pass)
{
    var webMethod = "AccountServices.asmx/LogOn";
    var parameters = "{\"uid\":\"" + encodeURI(uid) + "\",\"pass\":\"" + encodeURI(pass) + "\"}";

        $.ajax({
            //post is more secure than get, and allows
            //us to send big data if we want.  really just
            //depends on the way the service you're talking to is set up, though
            type: "POST",
            //the url is set to the string we created above
            url: webMethod,
            //same with the data
            data: parameters,
            //these next two key/value pairs say we intend to talk in JSON format
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //jQuery sends the data and asynchronously waits for a response.  when it
            //gets a response, it calls the function mapped to the success key here
            success: function (msg)
            {
                //the server response is in the msg object passed in to the function here
                //since our logon web method simply returns a true/false, that value is mapped
                //to a generic property of the server response called d (I assume short for data
                //but honestly I don't know...)
                if (msg.d)
                {
                    LoadAccount();
                    //server replied true, so show the accounts panel
                    //alert("success!");
                    if (admin == "1") {
                        window.location = './empDashboardAdmin.html';
                    }
                    if(admin == "0") {
                        window.location = './empDashboard.html';
                    }
                }
                else
                {
                    //server replied false, so let the user know
                    //the logon failed
                    alert("logon failed");
                }
            },
            error: function (e)
            {
                //if something goes wrong in the mechanics of delivering the
                //message to the server or the server processing that message,
                //then this function mapped to the error key is executed rather
                //than the one mapped to the success key.  This is just a garbage
                //alert becaue I'm lazy
                alert("boo...");
            }
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
var account;
var admin;
function LoadAccount() {
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
        
	var userProblems;

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
					userProblems = msg.d;

                    for (var j = 0; j < userProblems.length; j++)
                    {
						var problem;
						problem = "<div class='#'>" +
							"<a class='#' href='javascript:LoadProblem(" + userProblems[j].problemID + ")'>" +
							userProblems[j].problemID + " : " + userProblems[j].Subject +
						"</a></div>"

						$("#myProblemsDiv").append(problem);
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

function loadDashboard()
{
    GetProblems();
}

function redirect()
{
    window.location = 'logingpage.html';
}