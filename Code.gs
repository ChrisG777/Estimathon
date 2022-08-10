var teamnames = ["3 idiots", "pie", "lemon", "Genshin Is better than arknights", "Team EEK", "Me, Myself, and I", "You're a math wizard Harry", "Underestimated", "zam s fanclub", "L", "W"];
var answers = [0, 8.87e13, 30552, 8877600, 4.31e10, 29650, 900000, 26055460, 18450000000, 4580000, 171476, 312000, 9.2e10, 29.046, 46000000000, 264000000]
var sorthelper = [];
var output = [];
var numteams = teamnames.length;

function formSubmitted(e) {
  putInContact(e.namedValues);
}

function putInContact(info) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const responsesSheet = spreadsheet.getSheetByName('Form Responses 1');
  const scoreSheet = spreadsheet.getSheetByName('Score Sheet');

  var responses = responsesSheet.getDataRange().getValues();
  //Logger.log(responses);
  /*
  we should have a dictionary of arrays each array's key is the team name, and the array is 17 elements which are the next 17 cells: their current answers to the first 15 questions, their score, then their submission count
  */
  var problemcount=answers.length-1;
  var scoreoutput = {};
  for (const team of teamnames)
  {
    scoreoutput[team] = [];
    for (var i =0; i<problemcount+2; i++)
    {
      scoreoutput[team].push();
    }
    scoreoutput[team][problemcount+1] = 0;
  }
  /*
  as we go through the responses, we update the score 
  If the number of submissions is 20, don't allow it and mark the submissions as red
  otherwise, increment the number of submissions

  Check if the range is valid; if not, update the problem value with bad
  If it is, change the value in the array to that value
  */
  for (const row of responses)
  {
    if (row[0] == "Timestamp")
    {
      continue;
    }
    var problem = row[1];
    var lower_bound = row[2];
    var upper_bound = row[3];
    var team_name = row[4];

    if (scoreoutput[team_name][problemcount+1] == 25)
    {
      continue;
    }
    if (lower_bound <= 0.00001 || upper_bound < lower_bound - 0.00001)
    {
      scoreoutput[team_name][problem-1] = "bad";
      continue;
    }

    scoreoutput[team_name][problemcount+1]++;
    var valid = (answers[problem] >= lower_bound) && (answers[problem] <= upper_bound);
    if (valid)
    {
      scoreoutput[team_name][problem-1] = (upper_bound*1.0)/lower_bound;
    }
    else
    {
      scoreoutput[team_name][problem-1] = "bad";
    }
  }
  
  /*
  calculate the scores of each team using the formula (100 + ratios) * 2^(15-correct)
  */

  for (const [team, arr] of Object.entries(scoreoutput))
  {
    var sum = 100.0;
    var numcorrect = 0;
    for (var i =0; i<problemcount; i++)
    {
      if (scoreoutput[team][i] != null && scoreoutput[team][i] != "bad")
      {
        numcorrect++;
        sum += (scoreoutput[team][i]);
      }
    }
    scoreoutput[team][problemcount] = sum * (1 << (15-numcorrect));
    //Logger.log(team);
    //Logger.log(arr);
    sorthelper.push([team, scoreoutput[team][problemcount]]);
  }

  /*
  make an output array to rank the teams by scores
  */
  sorthelper.sort(function(first, second) {
    if (first[1] > second[1])
    {
      return 1;
    }
    else if (first[1] < second[1])
    {
      return -1;
    }
    else
    {
      return 0;
    }
  });
  //Logger.log(sorthelper);

  /*
  output to the scoresheet. Anything that's bad should be marked red
  */
  var teamsoutput = [];
  var i = 0;
  for (element of sorthelper)
  {
    output.push(scoreoutput[element[0]]);
    for (var j =0; j<scoreoutput[element[0]].length; j++)
    {
      if (scoreoutput[element[0]][j] == "bad")
      {
        scoreSheet.getRange(2+i, 2+j, 1, 1).setBackground("red");
      }
      else
      {
        scoreSheet.getRange(2+i, 2+j, 1, 1).setBackground("white");
      }
    }
    teamsoutput.push([element[0]]);
    i++;
  }
  var range = scoreSheet.getRange(2, 2, numteams, problemcount+2);
  range.setValues(output);
  range = scoreSheet.getRange(2, 1, numteams, 1);
  range.setValues(teamsoutput);
  range = scoreSheet.getRange(1, 2, 1, problemcount+2);
  var titles = [[]];
  for (var i=1; i<=problemcount; i++)
  {
    titles[0].push(i);
  }
  titles[0].push(["Score"]); titles[0].push(["Submissions"]);
  range.setValues(titles);
  scoreSheet.setColumnWidths(2,2+problemcount, 50);
}
