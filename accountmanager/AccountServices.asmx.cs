using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

//we need these to talk to mysql
using MySql.Data;
using MySql.Data.MySqlClient;
//and we need this to manipulate data from a db
using System.Data;

namespace accountmanager
{
    /// <summary>
    /// Summary description for AccountServices
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class AccountServices : System.Web.Services.WebService
    {

        [WebMethod]
        public int NumberOfAccounts()
        {
            //here we are grabbing that connection string from our web.config file
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.
            string sqlSelect = "SELECT * from account";



            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);


            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //return the number of rows we have, that's how many accounts are in the system!
            return sqlDt.Rows.Count;
        }

        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public bool LogOn(string uid, string pass)
        {
            //we return this flag to tell them if they logged in or not
            bool success = false;

            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlSelect = "SELECT cust_email, admin FROM user WHERE cust_email=@idValue and cust_password=@passValue";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(uid));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account
            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they 
                //are 1) logged in at all, and 2) and admin or not
                Session["cust_email"] = sqlDt.Rows[0]["cust_email"];
                Session["admin"] = sqlDt.Rows[0]["admin"];
                success = true;
            }
            //return the result!
            return success;
        }

        [WebMethod(EnableSession = true)]
        public bool LogOff()
        {
            //if they log off, then we remove the session.  That way, if they access
            //again later they have to log back on in order for their ID to be back
            //in the session!
            Session.Abandon();
            return true;
        }

        //EXAMPLE OF AN INSERT QUERY WITH PARAMS PASSED IN.  BONUS GETTING THE INSERTED ID FROM THE DB!
        [WebMethod(EnableSession = true)]
        public void RequestAccount(string uid, string pass, string firstName, string lastName)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row.
            string sqlSelect = "insert into user (Cust_email, Cust_password, fname, lname) " +
                "values(@idValue, @passValue, @fnameValue, @lnameValue); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(uid));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));
            sqlCommand.Parameters.AddWithValue("@fnameValue", HttpUtility.UrlDecode(firstName));
            sqlCommand.Parameters.AddWithValue("@lnameValue", HttpUtility.UrlDecode(lastName));

            //this time, we're not using a data adapter to fill a data table.  We're just
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns (the ID, remember?).
            //don't forget to close the connection!
            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
            }
            catch (Exception e)
            {

            }
            sqlConnection.Close();
        }

        [WebMethod(EnableSession = true)]
        public Account[] GetAccount()
        {
            //check out the return type.  It's an array of Account objects.  You can look at our custom Account class in this solution to see that it's 
            //just a container for public class-level variables.  It's a simple container that asp.net will have no trouble converting into json.  When we return
            //sets of information, it's a good idea to create a custom container class to represent instances (or rows) of that information, and then return an array of those objects.  
            //Keeps everything simple.

            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["cust_email"] != null)
            {
                DataTable sqlDt = new DataTable("account");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select * from user where Cust_Email = @currentUser";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@currentUser", Session["cust_email"]);

                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.

                List<Account> account = new List<Account>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    //if (Convert.ToInt32(Session["admin"]) == 1)
                    account.Add(new Account
                    {
                        userId = sqlDt.Rows[i]["Cust_email"].ToString(),
                        password = sqlDt.Rows[i]["Cust_password"].ToString(),
                        firstName = sqlDt.Rows[i]["fname"].ToString(),
                        lastName = sqlDt.Rows[i]["lname"].ToString(),
                        admin = Convert.ToInt32(sqlDt.Rows[i]["admin"])
                    });
                }
                //convert the list of accounts to an array and return!
                return account.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Account[0];
            }
        }
        [WebMethod(EnableSession = true)]
        public void SubmitProblems(string Priority, string Subject, string description, string solution, string privacy)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "insert into submittedproblems (UserID, Priority, Subject, description, solution, privacy) " +
                "values(@UserID, @Priority, @Subject, @description, @solution, @privacy); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //sqlCommand.Parameters.AddWithValue("@problemID", HttpUtility.UrlDecode(problemID));
            //sqlCommand.Parameters.AddWithValue("@UserID", HttpUtility.UrlDecode(userID));
            sqlCommand.Parameters.AddWithValue("@Priority", HttpUtility.UrlDecode(Priority));
            sqlCommand.Parameters.AddWithValue("@Subject", HttpUtility.UrlDecode(Subject));
            sqlCommand.Parameters.AddWithValue("@description", HttpUtility.UrlDecode(description));
            sqlCommand.Parameters.AddWithValue("@solution", HttpUtility.UrlDecode(solution));
            sqlCommand.Parameters.AddWithValue("@UserID", Session["cust_email"]); //get username from current session
            sqlCommand.Parameters.AddWithValue("@privacy", HttpUtility.UrlDecode(privacy));
            //sqlCommand.Parameters.AddWithValue("@solved", true);

            sqlConnection.Open();

            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
            }
            catch (Exception e)
            {

            }
            sqlConnection.Close();
        }

        [WebMethod(EnableSession = true)]
        public SubmitProblems[] GetUserTickets()
        {
            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["cust_email"] != null)
            {
                DataTable sqlDt = new DataTable("submittedproblems");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select * from submittedproblems where UserID = @currentUserID";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@currentUserID", Session["cust_email"]);

                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                sqlDa.Fill(sqlDt);

                List<SubmitProblems> submitproblems = new List<SubmitProblems>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    submitproblems.Add(new SubmitProblems
                    {
                        problemID = Convert.ToInt32(sqlDt.Rows[i]["problemID"]),
                        UserID = sqlDt.Rows[i]["UserID"].ToString(),
                        Priority = sqlDt.Rows[i]["Priority"].ToString(),
                        Subject = sqlDt.Rows[i]["Subject"].ToString(),
                        description = sqlDt.Rows[i]["description"].ToString(),
                        solution = sqlDt.Rows[i]["solution"].ToString(),
                        Solved = Convert.ToBoolean(sqlDt.Rows[i]["Solved"])

                    });
                }
                //convert the list of accounts to an array and return!
                return submitproblems.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new SubmitProblems[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public SubmitProblems[] GetPublicTickets()
        {
            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["cust_email"] != null)
            {
                DataTable sqlDt = new DataTable("submittedproblems");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select * from submittedproblems where privacy = 'public' and solved = false;";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@currentUser", Session["cust_email"]);

                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                List<SubmitProblems> submitproblems = new List<SubmitProblems>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    submitproblems.Add(new SubmitProblems
                    {
                        problemID = Convert.ToInt32(sqlDt.Rows[i]["problemID"]),
                        UserID = sqlDt.Rows[i]["UserID"].ToString(),
                        Priority = sqlDt.Rows[i]["Priority"].ToString(),
                        Subject = sqlDt.Rows[i]["Subject"].ToString(),
                        description = sqlDt.Rows[i]["description"].ToString(),
                        solution = sqlDt.Rows[i]["solution"].ToString(),
                        Solved = Convert.ToBoolean(sqlDt.Rows[i]["Solved"])

                    });
                }
                //convert the list of accounts to an array and return!
                return submitproblems.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new SubmitProblems[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public SolvedProblems[] GetSolvedTickets()
        {
            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["cust_email"] != null)
            {
                DataTable sqlDt2 = new DataTable("solvedproblems");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select p.description, s.solution,  s.userID from solutions s, submittedproblems p where p.solutionId = s.solutionId and s.chosen = true and p.solved = true and s.userId = '" + Session["cust_email"].ToString() + "';";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@currentUser", Session["cust_email"]);

                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt2);

                List<SolvedProblems> solvedproblems = new List<SolvedProblems>();
                for (int i = 0; i < sqlDt2.Rows.Count; i++)
                {
                    solvedproblems.Add(new SolvedProblems
                    {
                        description = sqlDt2.Rows[i]["description"].ToString(),
                        solution = sqlDt2.Rows[i]["solution"].ToString(),
                        userID = sqlDt2.Rows[i]["userID"].ToString()
                    });
                }
                //convert the list of accounts to an array and return!
                return solvedproblems.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new SolvedProblems[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public void Suggest(string problemId, string solution)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "insert into solutions (problemId, solution, userId, chosen) " +
                "values(@problemId, @solution, @user, false); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@problemId", HttpUtility.UrlDecode(problemId));
            sqlCommand.Parameters.AddWithValue("@solution", HttpUtility.UrlDecode(solution));
            sqlCommand.Parameters.AddWithValue("@user", Session["cust_email"]); //get username from current session

            sqlConnection.Open();

            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
            }
            catch (Exception e)
            {

            }
            sqlConnection.Close();
        }

        [WebMethod(EnableSession = true)]
        public Solution[] GetSolutions()
        {
            if (Session["cust_email"] != null)
            {
                DataTable sqlDt = new DataTable("solutions");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select * from solutions";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                sqlCommand.Parameters.AddWithValue("@currentUser", Session["cust_email"]);

                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                List<Solution> solutions = new List<Solution>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    solutions.Add(new Solution
                    {
                        solutionId = Convert.ToInt32(sqlDt.Rows[i]["solutionId"]),
                        problemId = Convert.ToInt32(sqlDt.Rows[i]["problemId"]),
                        userId = sqlDt.Rows[i]["userID"].ToString(),
                        solution = sqlDt.Rows[i]["solution"].ToString()
                    });
                }
                //convert the list of accounts to an array and return!
                return solutions.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Solution[0];
            }
        }

        [WebMethod(EnableSession = true)]
        public void ChooseSolution(string solutionId, string problemId)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "UPDATE solutions SET chosen = true where solutionId = @solutionId;" +
                               "UPDATE submittedproblems SET solved = true where problemID = @problemId;" +
                               "UPDATE submittedproblems SET solutionId = @solutionId where problemID = @problemId;";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@solutionId", HttpUtility.UrlDecode(solutionId));
            sqlCommand.Parameters.AddWithValue("@problemId", HttpUtility.UrlDecode(problemId));

            sqlConnection.Open();

            try
            {
                int accountID = Convert.ToInt32(sqlCommand.ExecuteScalar());
            }
            catch (Exception e)
            {

            }
            sqlConnection.Close();
        }
    }
}

