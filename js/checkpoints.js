/* =====================================================================
   js/checkpoints.js
   Checkpoints: the questions for every stage (CHECKPOINTS), the quiz
   page and the mission patches.
   Every stage ends with a short quiz. The questions are in CHECKPOINTS:
     q = the question     a = three answers     r = which answer is right
     (0 is the first)     why = one sentence shown after the check.
   A student who gets all but one right earns the patch of that stage.
   Uses things from: helpers.js, pages.js, saved.js, playground.js, checks.js, quizzes.js, demos.js, tools.js, practice.js, terminal.js, wordgames.js
   ===================================================================== */
'use strict';

const CHECKPOINTS = {
  // ----- solo track -----
  look: [
    { q: 'What does a portfolio do that a CV cannot?', a: ['It shows real things that you made', 'It lists your school grades', 'It proves that you are hard-working'], r: 0, why: 'A CV tells. A portfolio shows.' },
    { q: 'How long does an employer usually look at a portfolio?', a: ['A minute or two', 'About an hour', 'Until every word is read'], r: 0, why: 'Put the important things where two minutes can find them.' },
    { q: 'You like how another portfolio puts its projects first. What may you do?', a: ['Borrow the idea, with your own text and pictures', 'Copy the page and change the name', 'Copy the text but not the pictures'], r: 0, why: 'Borrow ideas. Do not copy work.' },
    { q: 'Which of these counts as a project?', a: ['A web page you built, or a problem you fixed', 'Only work that you were paid for', 'Only code with more than 1,000 lines'], r: 0, why: 'A project needs a clear result. It does not need to be big.' }
  ],
  html: [
    { q: 'Which tag holds the text for the browser tab?', a: ['<title>', '<h1>', '<header>'], r: 0, why: '<title> is in the head. Visitors see it on the tab.' },
    { q: 'How many <h1> elements should a page have?', a: ['One', 'One for every section', 'As many as you like'], r: 0, why: 'One <h1>, like the title on the front of a book.' },
    { q: 'You want a numbered list of steps. Which tag goes around the items?', a: ['<ol>', '<ul>', '<li>'], r: 0, why: '<ol> is an ordered list. Each item inside it is an <li>.' },
    { q: 'What is alt text for?', a: ['People who cannot see the picture, and times when it does not load', 'Making the picture bigger', 'Telling the browser where the file is'], r: 0, why: 'src says where the file is. alt says what the picture shows.' }
  ],
  css: [
    { q: 'In the rule h1 { color: navy; } what is color?', a: ['The property', 'The selector', 'The value'], r: 0, why: 'h1 is the selector, color is the property, navy is the value.' },
    { q: 'Which rule styles every element that has class="card"?', a: ['.card { … }', 'card { … }', '<card> { … }'], r: 0, why: 'In CSS the name of a class starts with a dot.' },
    { q: 'Padding is space…', a: ['inside the border', 'outside the border', 'between two pages'], r: 0, why: 'Padding is inside. Margin is outside.' },
    { q: 'Why is yellow text on a white background a bad idea?', a: ['The contrast is low, so it is hard to read', 'Yellow is not a real colour name', 'Browsers print yellow as black'], r: 0, why: 'Good contrast means dark on light, or light on dark.' }
  ],
  git: [
    { q: 'What is a commit?', a: ['One saved change, with a message and your name on it', 'A copy of your password', 'A request to join a team'], r: 0, why: 'Every commit stays in the history of the repository.' },
    { q: 'Which commit message is best?', a: ['Fix spelling in About me heading', 'update', 'I fixed the thing we talked about on Monday'], r: 0, why: 'It starts with a verb and says what changed and where.' },
    { q: 'Why must the first page be called index.html?', a: ['A web server looks for that name first', 'GitHub deletes files with other names', 'It makes the page load faster'], r: 0, why: 'index.html is the front door of a website.' },
    { q: 'You found a good photo with a search engine. What do you check before you upload it?', a: ['Whether you are allowed to use it, and how to credit it', 'Only that it is under 1 MB', 'Nothing: pictures on the internet are free'], r: 0, why: 'A picture belongs to the person who made it. Look for the licence.' }
  ],
  vsc: [
    { q: 'You are on the page of a repository on GitHub. You press the full stop key. What happens?', a: ['The repository opens in an editor in the browser', 'The repository is deleted', 'GitHub signs you out'], r: 0, why: 'The full stop opens the browser version of VS Code.' },
    { q: 'In VS Code, where do you commit your changes?', a: ['In the Source Control view', 'In the Explorer', 'In the Status Bar'], r: 0, why: 'Source Control is the icon that looks like a branch.' },
    { q: 'You are on a shared university computer. Which VS Code needs nothing installed?', a: ['The browser version', 'The desktop version', 'Neither of them'], r: 0, why: 'The browser version runs in a tab. Your work is safe once you commit.' },
    { q: 'Why hide the AI suggestions while you practise?', a: ['You learn the tags by typing them yourself', 'AI suggestions are always wrong', 'Each suggestion costs money'], r: 0, why: 'A robot that lifts your weights does not make you stronger.' }
  ],
  push: [
    { q: 'What does push do?', a: ['It sends your commits to GitHub', 'It saves the file', 'It deletes old commits'], r: 0, why: 'You push your work away from you, to GitHub.' },
    { q: 'On your own computer you click Commit, and nothing else. Where is the commit now?', a: ['On your computer only, until you push', 'On GitHub, at once', 'On your live page'], r: 0, why: 'Commit saves the step in your own history. Push sends it to GitHub.' },
    { q: 'Your push is refused, because GitHub has commits that you do not have. What do you do first?', a: ['Pull', 'Push again, harder', 'Delete your folder'], r: 0, why: 'Pull brings the new commits to you. After that, your push fits.' },
    { q: 'How can you prove that a push arrived?', a: ['Your commit is in the list of commits on GitHub', 'The file is saved on your computer', 'VS Code is still open'], r: 0, why: 'Open the repository on GitHub and click the clock with the number of commits.' }
  ],
  proj: [
    { q: 'What does a project need before it goes into your Project bank?', a: ['A clear result, and something that you learned', 'At least 100 lines of code', 'A certificate'], r: 0, why: 'Small projects count, if you can say what you learned.' },
    { q: 'What is a wireframe?', a: ['A simple drawing of a page: boxes and labels, no colours', 'The finished design in full colour', 'The cable behind the router'], r: 0, why: 'Developers draw before they build.' },
    { q: 'Why draw before you build?', a: ['Changing a drawing takes seconds. Changing code takes longer.', 'Employers mark the drawing', 'HTML cannot be changed later'], r: 0, why: 'A draft is a first version that you plan to change.' },
    { q: 'What should a project card say?', a: ['What it is, the tools, and what you learned', 'How many hours you slept that week', 'Only the title'], r: 0, why: 'Employers want to know what you did and what you learned.' }
  ],
  net: [
    { q: 'On LinkedIn, what is the headline?', a: ['The line under your name, which people see in search results', 'Your newest post', 'A hint for your password'], r: 0, why: 'A clear headline does a lot of work.' },
    { q: 'Follow or connect?', a: ['Follow organisations. Connect with people you have met.', 'Connect with every stranger. Follow nobody.', 'They are the same thing'], r: 0, why: 'Following is free, and nobody is offended.' },
    { q: 'Which of these should not be on a public profile?', a: ['Your home address and date of birth', 'Your course', 'Your skills'], r: 0, why: 'Public means public.' },
    { q: 'An event promises a “guaranteed job” if you pay. What do you do?', a: ['Do not pay. Choose free events.', 'Pay quickly, before the price goes up', 'Send them your bank details'], r: 0, why: 'Nobody can sell you a guaranteed job.' }
  ],
  js: [
    { q: 'HTML is what is on the page. CSS is how it looks. JavaScript is…', a: ['what it does', 'where it is stored', 'who made it'], r: 0, why: 'JavaScript makes a page react.' },
    { q: 'What does button.addEventListener("click", …) do?', a: ['It waits for a click, then runs the code', 'It clicks the button for you', 'It adds a second button'], r: 0, why: 'A click is an event. The listener waits for it.' },
    { q: 'The Console says: mesage is not defined. What is the most likely cause?', a: ['A spelling mistake in a name', 'The internet is down', 'The file is too big'], r: 0, why: 'Computers do not guess. message and mesage are two different names.' },
    { q: 'The code starts with let count = 0; and each click runs count = count + 1; What is count after three clicks?', a: ['3', '1', '0'], r: 0, why: 'Each click adds one to the number that is already there.' }
  ],
  // ----- team track -----
  start: [
    { q: 'What is the project manager?', a: ['The person who remembers, and writes down what the team decides', 'The boss', 'The only person who may commit'], r: 0, why: 'The team decides. The project manager writes it down.' },
    { q: 'The team website is public. What must stay off it?', a: ['Phone numbers and student numbers', 'Photos of buildings', 'Jokes about the library'], r: 0, why: 'Anyone can see the site and every change to it.' },
    { q: 'What is the rule of the warm-up?', a: ['One change, one commit, one clear message', 'One big commit at the end', 'No commits until the tutor says so'], r: 0, why: 'Small changes are how you learn where the buttons are.' },
    { q: 'A collaborator is…', a: ['a person who is allowed to change the repository', 'a person who may only read it', 'a robot that reviews code'], r: 0, why: 'Your tutor adds you as a collaborator.' }
  ],
  plan: [
    { q: 'On GitHub, one job written down for the whole team is…', a: ['an issue', 'a commit', 'a branch'], r: 0, why: 'Each issue is a card on the board.' },
    { q: 'What does the project board show?', a: ['The state of every job, and who is doing it', 'The passwords of the team', 'The final marks'], r: 0, why: 'With a board, nobody has to ask.' },
    { q: 'What makes a good issue?', a: ['A title that starts with a verb, and a description of what “done” means', 'One word, such as “page”', 'A title in capital letters'], r: 0, why: 'Everyone should know when the job is finished.' },
    { q: 'You start work on your issue. What do you do with its card?', a: ['Move it to In Progress', 'Delete it', 'Wait for the project manager to move it'], r: 0, why: 'You move your own card.' }
  ],
  flow: [
    { q: 'Why does the team use pull requests?', a: ['So that a second person checks every change before it is live', 'To make commits slower', 'Because main has been deleted'], r: 0, why: 'A mistake on main is a mistake on the internet.' },
    { q: 'Can you approve your own pull request?', a: ['No. A teammate must do it.', 'Yes, always', 'Yes, after one hour'], r: 0, why: 'Two people read every change.' },
    { q: 'GitHub says: “This branch has conflicts.” What does it mean?', a: ['Two people changed the same lines, and a person must choose', 'The repository is broken for ever', 'Somebody has been hacked'], r: 0, why: 'A conflict is normal. Read both versions and decide.' },
    { q: 'Which review comment helps the author most?', a: ['Could you add alt text to the picture in line 14?', 'This is wrong.', 'ok'], r: 0, why: 'A good comment says where, and what to do.' }
  ],
  build: [
    { q: 'Why two small pull requests and not one big one?', a: ['Small ones are quick and easy to review', 'GitHub charges for big ones', 'Big ones cannot be merged'], r: 0, why: 'A reviewer who sees forty changed lines makes a cup of tea first.' },
    { q: 'css/style.css belongs to everyone. What do you do before you change it?', a: ['Tell the team, then make one small pull request', 'Change it at night, when nobody is looking', 'Keep your own secret copy'], r: 0, why: 'Shared files need care.' },
    { q: 'A useful update has three lines. Which three?', a: ['Done, next, stuck', 'Me, you, them', 'Monday, Tuesday, Wednesday'], r: 0, why: 'What I did, what I will do, where I need help.' },
    { q: 'The starter page has a line with the word viewport. What do you do with it?', a: ['Leave it. It makes the page fit a phone.', 'Delete it to save space', 'Copy it ten times'], r: 0, why: 'Without it, a phone shows the page very small.' }
  ],
  finish: [
    { q: 'Who is the best person to test your website?', a: ['Someone outside the team, who has never seen it', 'The person who built it', 'Nobody, if the code is tidy'], r: 0, why: 'You know where everything is. A visitor does not.' },
    { q: 'During a user test, what do you do?', a: ['Watch, write, and do not explain', 'Hold the mouse for the person', 'Tell the person where to click'], r: 0, why: 'On the real internet you will not be standing beside them.' },
    { q: 'A good bug report has three parts. Which?', a: ['What I did, what I expected, what happened', 'Who to blame, when, and why', 'A title and nothing else'], r: 0, why: 'With those three, a teammate can see the bug too.' },
    { q: 'What does a team talk about in a retrospective?', a: ['The work: what to keep, stop and start', 'Who the worst teammate is', 'The marks'], r: 0, why: 'A retrospective is about the work, not about the people.' }
  ],
  // ----- make it yours -----
  fork: [
    { q: 'What is a fork?', a: ['Your own copy of a repository, in your own account', 'A second branch in the team repository', 'A broken repository'], r: 0, why: 'You can change your fork freely.' },
    { q: 'You change a file in your fork. What happens to the team website?', a: ['Nothing. It stays as it was.', 'It changes too', 'It is deleted'], r: 0, why: 'A fork is a separate copy.' },
    { q: 'Your teammates\' pages came with the copy. What is the fair thing to do?', a: ['Remove them, or ask before you keep them', 'Put your own name on them', 'Leave them and say nothing'], r: 0, why: 'Their words and photos are theirs.' },
    { q: 'A repository called your-username.github.io is published at…', a: ['https://your-username.github.io/', 'https://github.com/pages/', 'https://your-username.github.io/your-username.github.io/'], r: 0, why: 'That special name gives the shortest address.' }
  ],
  remake: [
    { q: 'Which file holds the colours and fonts of the whole site?', a: ['css/style.css', 'README.md', 'images/README.md'], r: 0, why: 'One style sheet, linked from every page.' },
    { q: 'What goes on a project card?', a: ['What the project is, the tools, and what you learned', 'Only a picture', 'Your date of birth'], r: 0, why: 'The same three things as in your Project bank.' },
    { q: 'The team website is one of your projects. How do you describe it honestly?', a: ['Say what your own part was', 'Say that you built all of it alone', 'Do not mention the team'], r: 0, why: 'Employers ask. An honest answer is easy to defend.' },
    { q: 'What is a quick way to edit several files in your fork?', a: ['Open it with the full stop key and commit from Source Control', 'Email the files to yourself', 'Type everything again on your phone'], r: 0, why: 'The browser editor shows all your files at once.' }
  ],
  launch: [
    { q: 'A fork does not publish itself. Where do you switch the website on?', a: ['Settings, then Pages', 'The Issues tab', 'Your profile picture'], r: 0, why: 'Deploy from a branch: main, and / (root).' },
    { q: 'Where should the address of your portfolio go?', a: ['On your LinkedIn profile and on your CV', 'Nowhere. Keep it secret.', 'Only in a message to your tutor'], r: 0, why: 'A portfolio that nobody can find shows nothing.' },
    { q: 'What do you do before you share the link?', a: ['Open the site on a phone and click every link', 'Look at it once on your own computer', 'Nothing'], r: 0, why: 'Many employers will open it on a phone.' },
    { q: 'Your live site shows a 404 page. What do you check first?', a: ['That index.html is at the top level of the repository', 'That your computer is switched on', 'That you have paid GitHub'], r: 0, why: 'A site needs index.html at the top, not inside a folder.' }
  ],
  // ----- notes track -----
  first: [
    { q: 'Why write things down?', a: ['Your brain is for thinking, not for storing the name of a button', 'Tutors mark your notes', 'Notion deletes empty accounts'], r: 0, why: 'All developers forget things. The good ones write them down.' },
    { q: 'In Notion, what is a block?', a: ['One piece of a page, such as a paragraph or a picture', 'A banned user', 'A whole workspace'], r: 0, why: 'A page is made of blocks.' },
    { q: 'What does not belong in your notes?', a: ['Passwords and bank details', 'An error message and how you fixed it', 'A link to a useful video'], r: 0, why: 'Notes are for learning, not for secrets.' },
    { q: 'What is worth saving after a coding session?', a: ['A command that worked, and an error that you fixed', 'Nothing', 'Only the date'], r: 0, why: 'In three weeks you will be glad.' }
  ],
  tpl: [
    { q: 'What is a template?', a: ['A page that somebody already built, which you copy and change', 'A course that you pay for', 'A kind of password'], r: 0, why: 'You do not have to start with an empty page.' },
    { q: 'What is the collector\'s trap?', a: ['Collecting twenty templates and writing zero notes', 'Paying for Notion', 'Using only one template'], r: 0, why: 'A template is useful only when you use it.' },
    { q: 'Where is a safe place to look for templates?', a: ['Notion\'s own collection, with the filter for free ones', 'A pop-up advert', 'An email from a stranger'], r: 0, why: 'Start with the official collection.' },
    { q: 'Which is worth more?', a: ['One template that you open every week', 'Twenty templates that you admire', 'A template with many colours'], r: 0, why: 'Use beats beauty.' }
  ],
  db: [
    { q: 'In Notion, a database is…', a: ['a list where every row is also a page', 'a kind of chart', 'a folder of pictures'], r: 0, why: 'Click a row and it opens as a page.' },
    { q: 'A view is…', a: ['one way to show the same database: a table, a board or cards', 'a copy that you must fill in again', 'a comment on a page'], r: 0, why: 'You enter the information once and look at it in several ways.' },
    { q: 'How do cards move on a Kanban board?', a: ['From column to column: To do, Doing, Done', 'Only up and down', 'They never move'], r: 0, why: 'The column shows the state of the job.' },
    { q: 'A property is…', a: ['one column of a database, such as Topic or Link', 'the icon of a page', 'the owner of a workspace'], r: 0, why: 'Every row has the same properties.' }
  ],
  hub: [
    { q: 'How do you get your own study hub?', a: ['Duplicate the class template into your own workspace', 'Ask a classmate for the password', 'Build it from an empty page'], r: 0, why: 'The copy is yours.' },
    { q: 'In Resources, what does the tab “To try next” show?', a: ['Free things that you have not started', 'The most expensive courses', 'Your marks'], r: 0, why: 'It answers the question: what shall I do today?' },
    { q: 'Where does the hub show your plan as a board?', a: ['On its first page', 'Only in the tutor\'s copy', 'On GitHub'], r: 0, why: 'Scroll down on the first page.' },
    { q: 'You change something in your copy of the hub. Who else sees the change?', a: ['Nobody. The copy is yours.', 'The whole class', 'Everyone on the internet'], r: 0, why: 'A duplicate is separate from the template.' }
  ],
  ob: [
    { q: 'What is Obsidian?', a: ['Another free app for notes: powerful, and slower to learn', 'A paid version of Notion', 'A web browser'], r: 0, why: 'This site only looks through its window.' },
    { q: 'What is the advice on this site about Obsidian?', a: ['Learn Notion first. Look at Obsidian next year.', 'Change to it today', 'Never use it'], r: 0, why: 'One new tool at a time.' },
    { q: 'In an Obsidian note you see [[padding]]. What is it?', a: ['A link to another note', 'A CSS rule that runs', 'An error'], r: 0, why: 'Double square brackets link notes together.' },
    { q: 'Notion is “a furnished flat”. What is Obsidian?', a: ['A workshop with very good tools and no furniture', 'A castle', 'A tent'], r: 0, why: 'Move into the flat first.' }
  ],
  // ----- what next track -----
  choose: [
    { q: 'What is tutorial hell?', a: ['Watching course after course and never building anything of your own', 'A very hard exam', 'A video that will not load'], r: 0, why: 'The way out is one small project of your own.' },
    { q: 'How many directions should you choose for the next few months?', a: ['One', 'All four', 'None'], r: 0, why: 'You do not have to marry it. You only have to choose.' },
    { q: 'What does a simulator let you do?', a: ['Test a circuit without buying parts', 'Skip the course', 'Print a certificate'], r: 0, why: 'A simulator behaves like real hardware.' },
    { q: 'Who gets good at this?', a: ['People who keep going when no one is checking', 'People with the newest laptop', 'People who never ask questions'], r: 0, why: 'Nobody becomes a developer in one semester.' }
  ],
  learn: [
    { q: 'A “free” course asks for your bank card. What do you do?', a: ['Stop and check', 'Type the number in quickly', 'Borrow a friend\'s card'], r: 0, why: 'You should not need a card for any course in the tables.' },
    { q: 'In the UK, getting into a computer system without permission is…', a: ['a crime, even “just to look”', 'fine for students', 'only bad manners'], r: 0, why: 'Practise only on sites that are made for practice.' },
    { q: 'What is the advice about prices on Udemy?', a: ['Never pay the full price. Wait for a sale.', 'Always pay the highest price', 'Prices never change'], r: 0, why: 'There is a sale. Then another sale.' },
    { q: 'When is the right time to buy a course?', a: ['After you have finished a free one', 'Before you try anything free', 'When an advert tells you to'], r: 0, why: 'Finish one free course first.' }
  ],
  ask: [
    { q: 'What is a subreddit?', a: ['One forum on Reddit about one topic', 'A private message', 'A kind of virus'], r: 0, why: 'Its name starts with r/.' },
    { q: 'What do you remove before you post your CV for feedback?', a: ['Your name, address, phone number, email and student number', 'Your skills', 'Your projects'], r: 0, why: 'Reviewers need your experience, not your identity.' },
    { q: 'An AI assistant states something false in a confident voice. What is this called?', a: ['A hallucination', 'A prompt', 'An upvote'], r: 0, why: 'Always verify in a second place that you trust.' },
    { q: 'You used an AI tool for part of your work. What is good practice?', a: ['Check it, and acknowledge the use, by the rules of your unit', 'Hide it', 'Blame the tool for the mistakes'], r: 0, why: 'Ask your tutor what is allowed in assessed work.' }
  ],
  career: [
    { q: 'Which of these does not belong on a CV in the UK?', a: ['Your date of birth and a photo', 'Your email address', 'Your projects'], r: 0, why: 'Employers should judge your skills, not your age or your face.' },
    { q: 'How long should your CV be at this stage?', a: ['One page. Never more than two.', 'As long as possible', 'Three lines'], r: 0, why: 'A recruiter reads fast.' },
    { q: 'What does STAR stand for?', a: ['Situation, Task, Action, Result', 'Skills, Talent, Ambition, Results', 'Start, Try, Ask, Repeat'], r: 0, why: 'It gives every interview story a shape.' },
    { q: 'In an interview story, which word should do most of the work?', a: ['“I”: say what you did', '“We”: stay inside the team', '“They”: say what the others did wrong'], r: 0, why: 'The interviewer is hiring you, not your team.' }
  ],
  sem2: [
    { q: 'What happens to skills that you do not use?', a: ['They fade quickly', 'They stay for ever', 'They grow by themselves'], r: 0, why: 'By April the angle brackets look like a foreign alphabet again.' },
    { q: 'How much practice keeps your skills alive?', a: ['One or two hours a week', 'Eight hours a day', 'None'], r: 0, why: 'A little and often.' },
    { q: 'The “100 days” of practice…', a: ['do not have to be in a row', 'must be every day, or you start again', 'are a law'], r: 0, why: 'Three days a week is fine. It takes longer, and that is allowed.' },
    { q: 'Where does your plan go?', a: ['In your study hub, next to your notes', 'On a paper napkin', 'In four different apps'], r: 0, why: 'One place. No searching.' }
  ],
  // ----- language lab -----
  say: [
    { q: 'In British English, what is the symbol # called?', a: ['Hash', 'Pound', 'Star'], r: 0, why: 'In the UK the pound sign is £. The symbol # is a hash.' },
    { q: 'How do you say the symbol / ?', a: ['Forward slash', 'Backslash', 'Dash'], r: 0, why: 'A backslash leans the other way: \\' },
    { q: 'How do you say the file name style.css ?', a: ['Style dot C S S', 'Style point cuss', 'Style full stop C S S'], r: 0, why: 'In file names and addresses the full stop is called “dot”.' },
    { q: 'Which of these are curly brackets?', a: ['{ }', '[ ]', '( )'], r: 0, why: '[ ] are square brackets and ( ) are round brackets.' }
  ],
  read: [
    { q: 'What is the best way to use a reference page?', a: ['Scan the headings and search for the word you need', 'Read every line from the top', 'Learn it by heart'], r: 0, why: 'Reference pages are for looking things up.' },
    { q: 'On a reference page, what does “deprecated” mean?', a: ['Old. Do not use it in new code.', 'Very popular', 'Required'], r: 0, why: 'It may still work, and it may stop working.' },
    { q: 'What is the default value of an attribute?', a: ['What the browser uses when you write nothing', 'The biggest value that is allowed', 'A mistake'], r: 0, why: 'For example, images load at once unless you write loading="lazy".' },
    { q: 'A picture is only decoration. What alt text does MDN describe for it?', a: ['Empty: alt=""', 'The file name', 'The word “image”'], r: 0, why: 'An empty alt tells a screen reader to skip the picture.' }
  ],
  write: [
    { q: 'Which commit message has the right verb form?', a: ['Add contact page', 'Added contact page', 'Adding contact page'], r: 0, why: 'A commit message is written like an instruction.' },
    { q: 'What does a good summary do?', a: ['It keeps the main ideas, in your own words, with no examples', 'It copies the first sentence of every paragraph', 'It adds your opinion'], r: 0, why: 'Shorter, and still true to the text.' },
    { q: 'In an argument, what is a refutation?', a: ['Your answer to the best point of the other side', 'A second introduction', 'A list of sources'], r: 0, why: 'First the counter-argument, then your answer to it.' },
    { q: 'About how long may the first line of a commit message be?', a: ['50 characters', '500 characters', 'Exactly five words'], r: 0, why: 'Short lines fit in every list on GitHub.' }
  ],
  present: [
    { q: 'What is a reflective talk mostly about?', a: ['What you learned, and what you would do differently', 'Everything that you clicked', 'The history of the internet'], r: 0, why: 'Reflection is thinking about your own experience.' },
    { q: 'How much text should be on a slide?', a: ['A few words. You say the rest.', 'Your whole script', 'As much as fits in a small font'], r: 0, why: 'People cannot read and listen at the same time.' },
    { q: 'Your talk must take 3 to 5 minutes. The first rehearsal takes 6:40. What do you do?', a: ['Cut something, then time it again', 'Speak twice as fast', 'Hope for the best'], r: 0, why: 'A shorter talk at a calm speed is the better talk.' },
    { q: 'Which sentence is reflective?', a: ['At first I committed everything at once. Now I make small commits, because they are easier to review.', 'HTML has tags.', 'GitHub is a website.'], r: 0, why: 'It says what changed in you, and why.' }
  ],
  // ----- pathways -----
  ee: [
    { q: 'Why does an LED need a resistor?', a: ['To limit the current, so that the LED does not burn out', 'To make it blink', 'To change its colour'], r: 0, why: 'Without a resistor, too much current flows.' },
    { q: 'On a datasheet, what are the “absolute maximum ratings”?', a: ['Limits that you must never go past', 'The best values for every day', 'Numbers for the factory only'], r: 0, why: 'Past these limits the part may be damaged.' },
    { q: 'How many ohms is 4.7 kΩ?', a: ['4,700', '47', '0.0047'], r: 0, why: 'k means kilo: one thousand.' },
    { q: 'In an Arduino sketch, how long does delay(1000) wait?', a: ['One second', 'One thousand seconds', 'One minute'], r: 0, why: 'The number is in milliseconds.' }
  ],
  cyber: [
    { q: 'You committed a password to a public repository by mistake. What do you do first?', a: ['Change the password. Deleting the line is not enough.', 'Delete the line and relax', 'Rename the file'], r: 0, why: 'The old version stays in the history.' },
    { q: 'Which is the strongest sign of a phishing email?', a: ['It hurries you, and the link goes to a strange address', 'It has a greeting', 'It arrives on a Monday'], r: 0, why: 'Pressure and a wrong address are the classic pair.' },
    { q: 'In the UK, where can you forward a suspicious email?', a: ['report@phishing.gov.uk', 'To everyone in your contacts', 'Back to the sender'], r: 0, why: 'The National Cyber Security Centre checks the reports.' },
    { q: 'You look at the source code of a public web page. What is that?', a: ['Normal reading. Every browser can do it.', 'Hacking', 'Impossible'], r: 0, why: 'Reading is fine. Getting into systems without permission is not.' }
  ],
  cs: [
    { q: 'What does DNS do?', a: ['It turns a name such as github.io into a number that computers use', 'It draws the page', 'It stores your passwords'], r: 0, why: 'It is the address book of the internet.' },
    { q: 'A server answers with the code 404. What does that mean?', a: ['The page was not found', 'Everything is fine', 'The server is too hot'], r: 0, why: '200 means OK. 404 means not found.' },
    { q: 'What is a good habit before you run a piece of code?', a: ['Predict what it will do', 'Close your eyes', 'Delete the comments'], r: 0, why: 'A wrong prediction shows you exactly what you have not understood yet.' },
    { q: 'name = "Robin" in Python and const name = "Robin"; in JavaScript. What do both lines do?', a: ['They store a value under a name', 'They print the name', 'They delete the name'], r: 0, why: 'The idea is the same. Only the spelling of the language changes.' }
  ]
};

// The letters on each patch
const PATCH_TAGS = { look: 'LOOK', html: 'HTML', css: 'CSS', git: 'GIT', vsc: 'VSC', push: 'PUSH', proj: 'PROJ', net: 'LINK', js: 'JS',
  start: 'GO', plan: 'PLAN', flow: 'PR', build: 'BUILD', finish: 'DONE', fork: 'FORK', remake: 'MINE', launch: 'LIVE',
  first: 'NOTE', tpl: 'TPL', db: 'DATA', hub: 'HUB', ob: 'Y2', choose: 'PICK', learn: 'LEARN', ask: 'ASK', career: 'CV', sem2: 'SEM2',
  say: 'SAY', read: 'READ', write: 'WRITE', present: 'TALK', ee: 'EE', cyber: 'CYBER', cs: 'CS' };

const stageTrack = stage => { const t = tasks.find(x => x.dataset.stage === stage); return t ? t.dataset.track : 'solo'; };
const cpPassed = stage => Number(store.get('cp:' + stage) || 0) >= CHECKPOINTS[stage].length - 1;
const patchCount = () => openStages().filter(cpPassed).length;

// Draws one mission patch: a six-sided badge in the colour of its track.
function patchFor(stage, earned) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  const add = (tag, attrs, text) => {
    const el = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    if (text) el.textContent = text;
    svg.append(el);
  };
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'patch p-' + stageTrack(stage) + (earned ? ' is-earned' : ''));
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Mission patch for ' + STAGES[stage].name + (earned ? ': earned' : ': not earned yet'));
  add('polygon', {points: '50,3 91,26.5 91,73.5 50,97 9,73.5 9,26.5', class: 'patch-edge'});
  add('polygon', {points: '50,13 82,31.5 82,68.5 50,87 18,68.5 18,31.5', class: 'patch-in'});
  add('circle', {cx: 50, cy: 33, r: 9, class: 'patch-ring'});
  add('circle', {cx: 50, cy: 33, r: 3.4, class: 'patch-dot'});
  add('text', {x: 50, y: 64, class: 'patch-tag'}, PATCH_TAGS[stage] || '');
  add('text', {x: 50, y: 77, class: 'patch-sub'}, earned ? 'PASSED' : 'NOT YET');
  return svg;
}

// Draws the checkpoint page for one stage. Gives back the track, so the page gets its colour.
function drawCheckpoint(stage) {
  const box = $('#checkpoint-body'), track = stageTrack(stage), list = CHECKPOINTS[stage];
  box.textContent = '';
  const form = h('div', {class: 'cp-form'});
  const order = shuffle(list.map((item, n) => n));
  const picks = {};
  order.forEach((n, shown) => {
    const item = list[n];
    const opts = h('div', {class: 'cp-opts'});
    shuffle(item.a.map((text, k) => k)).forEach(k => {
      const id = 'cp-' + n + '-' + k;
      const radio = h('input', {type: 'radio', name: 'cp-' + n, id: id, value: String(k)});
      radio.addEventListener('change', () => { picks[n] = k; });
      opts.append(h('label', {for: id, class: 'cp-opt'}, radio, h('span', {text: item.a[k]})));
    });
    form.append(h('fieldset', {class: 'q ask cp-q', 'data-n': String(n)},
      h('legend', {text: (shown + 1) + '. ' + item.q}), opts, h('p', {class: 'q-why', hidden: true})));
  });
  const result = h('div', {class: 'cp-result', role: 'status'});
  const check = h('button', {type: 'button', class: 'btn primary', text: 'Check my answers'});
  check.addEventListener('click', () => {
    if (Object.keys(picks).length < list.length) { result.textContent = 'Answer every question first.'; return; }
    let score = 0;
    $$('.cp-q', form).forEach(fs => {
      const n = Number(fs.dataset.n), item = list[n], ok = picks[n] === item.r;
      if (ok) score++;
      $$('input', fs).forEach(r => {
        r.disabled = true;
        const lab = r.closest('label');
        if (Number(r.value) === item.r) lab.classList.add('is-right');
        else if (r.checked) lab.classList.add('is-wrong');
      });
      const why = $('.q-why', fs);
      why.textContent = (ok ? 'Correct. ' : 'Not quite. ') + item.why;
      why.hidden = false;
    });
    if (score > Number(store.get('cp:' + stage) || 0)) store.set('cp:' + stage, String(score));
    const passed = score >= list.length - 1;
    check.hidden = true;
    result.textContent = '';
    result.append(
      h('p', {class: 'cp-score', text: score + ' of ' + list.length + (passed ? '. Checkpoint passed.' : '. You need ' + (list.length - 1) + ' to pass.')}),
      passed ? h('div', {class: 'cp-patch'}, patchFor(stage, true), h('p', {text: 'You earned the mission patch for ' + STAGES[stage].name + '. It is on your record page.'})) : null,
      h('p', {class: 'btnrow'},
        passed ? null : h('a', {class: 'btn primary', href: '#cp-' + stage, text: 'Try again'}),
        h('a', {class: 'btn', href: '#' + track, text: 'Back to ' + BACK_TO[track]}),
        passed ? h('a', {class: 'btn', href: '#record', text: 'See my record'}) : null));
    const again = $('a[href="#cp-' + stage + '"]', result);
    if (again) again.addEventListener('click', e => { e.preventDefault(); show('cp-' + stage, true); });
    drawLists();
  });
  box.append(
    h('header', {class: 'task-head'},
      h('p', {class: 'crumbs'}, h('a', {href: '#' + track, text: TRACKS[track]}), h('span', {text: 'Checkpoint'})),
      h('h1', {text: 'Checkpoint: ' + STAGES[stage].name}),
      h('p', {class: 'chips'}, h('span', {class: 'chip of-stage', text: STAGES[stage].name}),
        h('span', {class: 'meta', text: list.length + ' questions'}), h('span', {class: 'meta', text: 'Pass with ' + (list.length - 1)}),
        cpPassed(stage) ? h('span', {class: 'chip', text: 'Patch earned'}) : null)),
    h('p', {class: 'read cp-intro', text: 'A quick check of this stage. No timer, and you can try as often as you like. The questions come back in a new order each time.'}),
    form, h('p', {class: 'btnrow'}, check), result);
  return track;
}
