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
                window.location = "./loginpage.html";
            }
            else {
                alert("failed");
            }
        },
        error: function (e) {
            alert("boo...");
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
                        problem = "<div class='#'>" +
                        "<a class='#' href='javascript:LoadTicket(" + userTickets[j].problemID + ")'>" +
                        userTickets[j].problemID + " | " + userTickets[j].Subject + " | " + userTickets[j].Priority +
                        "</a></div>"

                        $("#openTicketsDiv").append(problem);
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
                    problem = "<div class='#'>" +
                    "<a class='#' href='javascript:LoadTicket(" + publicTickets[j].problemID + ")'>" +
                    publicTickets[j].problemID + " | " + publicTickets[j].Subject + " | " + publicTickets[j].Priority +
                    "</a></div>"

                    $("#publicTicketsDiv").append(problem);      
                }
            }
        },
        error: function (e) {
            alert("server error");
        }
    });
}

var adminTickets;
//get public tickets specifically for employee dashboard
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
                    problem = "<div class='#'>" +
                        "<a class='#' href='javascript:AdminSolve(" + adminTickets[j].problemID + ")'>" +
                        adminTickets[j].problemID + " | " + adminTickets[j].Subject + " | " + adminTickets[j].Priority + " | " + adminTickets[j].UserID +
                        "</a></div>"

                    $("#adminTicketsDiv").append(problem);
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
    GetUserTickets();
    GetPublicTickets();
}

function loadDashboardAdmin()
{
    GetAdminTickets();
}

function redirect()
{
    window.location = 'logingpage.html';
}


function LoadTicket(problemId)
{
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
    var ticketId = localStorage.getItem("ticketId");
    var ticketDesc = localStorage.getItem("ticketDesc");

    var problemHead = "<div>" + ticketId + " | " + ticketDesc + "</div>";

    $("#solutionHead").append(problemHead);
    console.log(problemHead);
}

function AdminSolve(problemId)
{
    //temporary location until we create page for admin to choose solution
    window.location = 'solve.html';
}
