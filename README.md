# Estimathon
Code for live updating estimathon round scoreboard

The most fun round of any math contest. Trust me. 

The Estimathon round is a series of estimation questions with a twist: teams get live feedback on their responses, and have more than one chance to get some of the questions right. Here's an extract of the rules for the 2022 Summer Mission Math Tournament (hosted by MSJ Math Club :D)

Contest Format
* Team round
* 15 Fermi-style estimation questions
* 45 minutes


Teams will submit their answers on a Google Form for each problem, where they will input a lower bound and an upper bound, making a range that they think the answer is in. If their range contains the correct answer, the scoreboard will update with their score (the ratio of the upper bound to the lower bound) for that question. If it doesn’t, the scoreboard will update with “bad.” You can submit up to 25 times, meaning you can submit multiple times for a single problem. 

Here is an example of what the scoreboard looks like: 
![Sample Estimathon Scoreboard](https://i.ibb.co/PwpQ9zP/Estimathon-Scoreboard.png)


Now, here are the steps you need to follow to successfully create your own estimathon leaderboard.

1. Make a google form with four required questions: 1. team name (multiple choice, put all the teams that will be participating as options) 2. Problem number 3. Lower Bound 4. Upper Bound 
![Step 1](https://i.ibb.co/MRX400M/Estimathon-step-1.png)
2. Open up the attached spreadsheet. Make a new sheet and call it "Score Sheet" (verbatim). This will be your leaderboard. On the top menu, click apps script. Rename the project at the top left if you want
3. Under Services, click + and add the Google Sheets API
4. Copy paste the code from Code.gs into the Apps Script editor and press control S to save. 
5. On the left menu, go to Triggers. In the bottom right, press Add Trigger. Make the function Add Trigger, the event type On form submit, and the failure notification settings how often you want emails. Press save: when the popup appears, click your own account, and when it says "Google hasn’t verified this app" with an angry red triangle, press the small "Advanced" text on the bottom left and then click the underlined "Go to (project name) (unsafe)"
![Step 5](https://i.ibb.co/9GC819m/step-5.png)
6. Go back to the code editor. At the very top, replace the team names like "3 idiots" with the team names for your contest, verbatim. Replace the answers with the answers to the problems from your contest in order, but DON'T CHANGE THE 0: that's there because arrays are 0-indexed, so start from the second number (8.87e13). Change the problemcount to the number of problems on your contest. Change maxresponses to what you want the maximum number of responses per team to be. 
7. At the top menu, click formSubmitted with a triangle next to it and change it to putInContact. Then, press Run. You should see now your leaderboard setup. You can close the apps script now: your leaderboard is ready to use. Just give the google form out for teams to start submitting their answers. 

Usage Tips
1. Scientific notation is possible through the google form: type it like 1.5e+10 for 1.5 * 10^10
2. The Scoring system is ![Estimathon Scoring](https://i.ibb.co/Cn5Gs85/estimathon-score.png). To change this, you'd need to go into the code (control F for 100). 
3. Inevitably, some teams will forget how to do scientific notation properly. If there's a mistake, you can change it live on the Form responses page directly (no need to go through the google form) and it will reflect on the leaderboard the next time someone makes a submission. 
4. For responses where the lower bound is larger than the upper bound or there's a negative number or 0 or the numbers are just too big, the code won't count the response. 
