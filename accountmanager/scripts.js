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

//logs the user off both at the client and at the server
function LogOff() {
    var webMethod = "AccountServices.asmx/LogOff";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d) {
                window.location = "./logingpage.html";
            }
            else {
                alert("failed");
            }
        },
        error: function (e) {
            alert("Server Error");
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
                account = msg.d;
                admin = account[0].admin;

                if (admin == "1") {
                    window.location = './adminDashboard.html';
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

function SubmitProblems(Priority, Subject, description, solution)
//store problemID, UserID, Priority, Subject, description, solution, solved
{
    var privacy;
    var privOps = document.getElementsByName('privacy');

    for (var i = 0; i < privOps.length; i++)
    {
        if (privOps[i].checked)
        {
            privacy = privOps[i].value;
        }
    }

    var webMethod = "AccountServices.asmx/SubmitProblems";
    var parameters = "{\"Priority\":\"" + encodeURI(Priority) +
        "\",\"Subject\":\"" + encodeURI(Subject) +
        "\",\"description\":\"" + encodeURI(description) +
        "\",\"solution\":\"" + encodeURI(solution) +
        "\",\"privacy\":\"" + encodeURI(privacy) + "\"}";
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

var userTickets;
//get tickets user has entered specifically for employee dashboard
function GetUserTickets()
{
	var webMethod = "AccountServices.asmx/GetUserTickets";
	$.ajax({
		type: "POST",
		url: webMethod,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (msg) {
               if (msg.d.length > 0)
               {
                  userTickets = msg.d;
                   var problem;

                   for (var j = 0; j < userTickets.length; j++)
                   {
                       if (userTickets[j].Solved == false)
                       {
                           var private = "";
                           if (userTickets[j].privacy == "private") { private = userTickets[j].privacy; }
                           problem = "<div class='ticketsDiv'>" +
                               "<a class='userTickets' href='javascript:LoadProblemDetail(" + userTickets[j].problemID + ")'><span class='spanner1'>" +
                               userTickets[j].description + "</span> <span class='spanner2'>" + userTickets[j].Priority + " : " + userTickets[j].Subject + "</span> <span class='spannerpriv'>" + private +
                               "</span></a></div>"

                           $("#openTicketsDiv").append(problem);
                       }

                    }
                }
			},
			error: function (e) {
				alert("server error");
			}
		});
}

var publicTickets;
//get public tickets specifically for employee dashboard
function GetPublicTickets() {
    var webMethod = "AccountServices.asmx/GetPublicTickets";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0)
            {   
                publicTickets = msg.d;
                for (var j = 0; j < publicTickets.length; j++)
                {
                    problem = "<div class='ticketsDiv'>" +
                    "<a class='userTickets' href='javascript:LoadTicket(" + publicTickets[j].problemID + ")'><span class='spanner1'>" +
                        publicTickets[j].description + "</span><span class='spanner2'> " + publicTickets[j].Priority +
                        " : " + publicTickets[j].Subject +
                    "</span></a></div>"

                    $("#publicTicketsDiv").append(problem);      
                }
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}

var solvedTickets;
//get public tickets specifically for employee dashboard
function GetSolvedTickets() {
    var webMethod = "AccountServices.asmx/GetSolvedTickets";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                solvedTickets = msg.d;
                for (var j = 0; j < solvedTickets.length; j++) {
                    problem = "<div class='ticketsDiv'>" +
                        "<a class='userTickets'>" + solvedTickets[j].description + "<span class='spanner5'> " +
                        solvedTickets[j].solution +
                        "</span></a></div>";

                    $("#solvedTicketsDiv").append(problem);
                }
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}

var adminTickets;
//get public tickets specifically for admin dashboard
function GetAdminTickets() {
    var webMethod = "AccountServices.asmx/GetPublicTickets";
    //using same service as GetPublicTickets since it will be the same results. We will construct them as links differently below
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                adminTickets = msg.d;
                for (var j = 0; j < adminTickets.length; j++) {
                    problem = "<div class='ticketsDiv'>" +
                        "<a class='userTickets' href='javascript:AdminSolve(" + adminTickets[j].problemID + ")'><span class='spanner1'>" +
                        adminTickets[j].description + "</span>  <span class='spanner2'>" + adminTickets[j].Priority + " : " + adminTickets[j].Subject +
                        "</span> &nbsp <span class='spanner3'>" + adminTickets[j].UserID +
                        "</span></a></div>"

                    $("#adminTicketsDiv").append(problem);
                }

                localStorage.setItem("adminTickets", JSON.stringify(msg.d));
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}

function LoadTicket(problemId)
{
    //grabs the ticket id and description and stores it using JSON to use on the next page
    var ticketDesc;
    for (var i = 0; i < publicTickets.length; i++)
    {
        if (problemId == publicTickets[i].problemID)
        {
            problemDesc = publicTickets[i].description;
        }
    }

    ticketId = JSON.stringify(problemId);
    ticketDesc = JSON.stringify(problemDesc);

    localStorage.setItem("ticketId", ticketId);
    localStorage.setItem("ticketDesc", ticketDesc);

    window.location = 'solve.html';
}

function LoadTicket2()
{
    //grabs the info we stored in previous function, diplays for user to see what problem they are solving
    var ticketId = localStorage.getItem("ticketId");
    var ticketDesc = localStorage.getItem("ticketDesc");

    var problemHead = ticketDesc;

    $("#solutionHead").append(problemHead);
    console.log(problemHead);
}

function Suggest(solution)
{
    var problemId = localStorage.getItem("ticketId");

    var webMethod = "AccountServices.asmx/Suggest";
    var parameters =
        "{\"problemId\":\"" + encodeURI(problemId) +
        "\",\"solution\":\"" + encodeURI(solution) + "\"}";
    console.log(parameters);

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            localStorage.clear();
            window.location = "./empDashboard.html";
        },
        error: function (e) {
            alert("Server error");
        }
    });
}

function AdminSolve(problemId)
{
    //grabs the ticket id and description and stores it using JSON to use on the next page
    var ticketDesc;
    for (var i = 0; i < adminTickets.length; i++)
    {
        if (problemId == adminTickets[i].problemID)
        {
            ticketDesc = adminTickets[i].description;
        }
    }

    ticketId = JSON.stringify(problemId);
    ticketDesc = JSON.stringify(ticketDesc);

    localStorage.setItem("adminTId", ticketId);
    localStorage.setItem("adminTdesc", ticketDesc);

    window.location = 'adminSolve.html';
}

function AdminSolve2()
{
    //this needs to display the problem info as wel as the suggested solutions
    var ticketId = localStorage.getItem("adminTId");
    var ticketDesc = localStorage.getItem("adminTdesc");

    var problemHead = ticketDesc;

    $("#solveHead").append(problemHead);
    console.log(problemHead);


    var webMethod = "AccountServices.asmx/GetSolutions";
    var parameters =
        "{\"problemId\":\"" + encodeURI(ticketId) + "\"}";
    console.log(parameters);

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            var suggestedSolutions = new Array();
            var allSolutions = msg.d;

            for (i = 0; i < allSolutions.length; i++)
            {
                if (allSolutions[i].problemId == ticketId)
                {
                    suggestedSolutions.push(allSolutions[i]);
                }
            }

            for (i = 0; i < suggestedSolutions.length; i++)
            {
                problem = "<div class='solutionsDiv'>" +
                    "<a class='solutionLink' href='javascript:ChooseSolution(" + suggestedSolutions[i].solutionId + ", " + ticketId + ")'>" +
                    suggestedSolutions[i].solution + " &nbsp<span class='spanner3'>" + suggestedSolutions[i].userId +
                    "</span></a></div>"

                $("#solutionsDiv").append(problem);
            }
        },
        error: function (e) {
            alert("Server error");
        }
    });
}

function ChooseSolution(solutionId, problemId) {
    var webMethod = "AccountServices.asmx/ChooseSolution";
    var parameters =
        "{\"problemId\":\"" + encodeURI(problemId) +
        "\",\"solutionId\":\"" + encodeURI(solutionId) + "\"}";
    console.log(parameters);

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            console.log(msg);
            localStorage.clear();
            window.location = "./adminDashboard.html";
        },
        error: function (e) {
            alert("Server error");
        }
    });
}

function loadDashboard() {
    GetUserTickets();
    GetPublicTickets();
	GetSolvedTickets();
	GetCompanyWideSolvedTickets();
}

function LoadAdminDashboard() {
    GetAdminTickets();
}

function redirect() {
    window.location = 'logingpage.html';
}

//var companywidesolvedTickets;
////get public tickets specifically for employee dashboard
//function GetCompanyWideSolvedTickets() {
//	var webMethod = "AccountServices.asmx/GetCompanyWideSolvedTickets";
//	var problem2;
//	$.ajax({
//		type: "POST",
//		url: webMethod,
//		contentType: "application/json; charset=utf-8",
//		dataType: "json",
//		success: function (msg) {
//			if (msg.d.length > 0) {
//				companywidesolvedTickets = msg.d;
//				for (var j = 0; j < companywidesolvedTickets.length; j++) {
//					problem2 = "<div class='ticketsDiv2'>" +
//						"<a class='userTickets2'  >" + companywidesolvedTickets[j].userID + " | " +
//						companywidesolvedTickets[j].description +
//						"</a></div>";

//					$("#companywidesolvedTicketsDiv").append(problem2);
//				}
//			}
//		},
//		error: function (e) {
//			alert("server error");

//		}
//	});
//}

var companywidesolvedTickets;
//get public tickets specifically for employee dashboard
function GetCompanyWideSolvedTickets() {
	var webMethod = "AccountServices.asmx/GetCompanyWideSolvedTickets";
	var problem2;
	$.ajax({
		type: "POST",
		url: webMethod,
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (msg) {
			if (msg.d.length > 0) {
				companywidesolvedTickets = msg.d;
				for (var j = 0; j < companywidesolvedTickets.length; j++) {
					problem2 = "<div class='ticketsDiv2'>" +
						"<a class='userTickets2'><span class='spanner1'>" + companywidesolvedTickets[j].description + "<br></span> <span class='spanner5'>" +
						companywidesolvedTickets[j].solution + "</span> <span class='spanner4'>" + companywidesolvedTickets[j].userID +
						"</span></a></div>";

					$("#companywidesolvedTicketsDiv").append(problem2);
				}
			}
		},
		error: function (e) {
			alert("server error");

		}
	});
}

var currentProblem;
function LoadProblemDetail(problemID) {
    window.location = './listviewProject2.html?pid=' + problemID;

}

function detailsLoad() {
    currentProblem = null;
    problemID = new URLSearchParams(window.location.search).get('pid');
    var webMethod = "AccountServices.asmx/GetUserTickets";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                problemsList = msg.d;

                for (var i = 0; i < problemsList.length; i++) {
                    if (problemsList[i].problemID == problemID) {
                        currentProblem = problemsList[i]
                    }
                }
                if (currentProblem != null) {
                    $('#UserIdValue').val(currentProblem.UserID);
                    $('#ProblemIdValue').val(currentProblem.problemID);
                    $('#PriorityValue').val(currentProblem.Priority);
                    $('#SubjectValue').val(currentProblem.Subject);
                    $('#DescriptionValue').val(currentProblem.description);
                    $('#SolutionValue').val(currentProblem.solution);

                }
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}


