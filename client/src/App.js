import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import kill from "./assets/kill.png";
import shield from "./assets/shield.png";
import bigSpoon from "./assets/bigSpoon.png";

const SEED = 1;

function App() {
  const [ user, setUser ] = useState({});
  const [ target, setTarget ] = useState({});

  useEffect(() => {
      /* global google */
      google.accounts.id.initialize({
        client_id: "313177334063-gtgv18kpeomfa0rqe8rvhadcfe5kucvt.apps.googleusercontent.com",
        callback: handleCallbackResponse
      });

      google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large"}
      );

      google.accounts.id.prompt();

      function handleCallbackResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        const userObject = jwtDecode(response.credential);
        setUser(userObject);
        document.getElementById("signInDiv").hidden = true;
        document.getElementById("signInText").hidden = true;

        fetch(process.env.PUBLIC_URL + '/roster.csv')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch CSV file');
            }
            return response.text();
          })
          .then(csvString => {
            console.log("csv string: " + csvString);
    
            const lines = csvString.split('\n');
            const parsedData = lines.map(line => line.trim().split(','));
    
            const names = parsedData.map(row => row[0]);
            const emails = parsedData.map(row => row[1]);
    
            console.log("names: " + names);
            console.log("emails: " + emails);
            
            const target = getTarget(userObject, names, emails);
    
            setTarget(target);
          })
          .catch(error => {
            console.error('Error fetching or processing CSV:', error);
          });
      };

      function getTarget(user, names, emails) {
        // shuffle roster, will always shuffle same
        const shuffled = [...emails];
        shuffleTargets(shuffled, SEED);
    
        const email = user.email;
        if (shuffled.indexOf(email) === -1) {
          return {name: "no one! You're not in the game :P"};
        }

        const targetIndex = (shuffled.indexOf(email) + 1) % shuffled.length;
        const targetName = names[targetIndex];
        console.log("target: " +  targetName);
        return {name: targetName};
      };
    
      function shuffleTargets(names, seed) {
        let currentIndex = names.length;
    
        let random = function() {
          var x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        };
    
        // while still elements to shuffle
        while (0 !== currentIndex) {        
            // choose random element and swap
            let rand = Math.floor(random() * currentIndex);
            currentIndex -= 1;
            
            let temp = names[currentIndex];
            names[currentIndex] = names[rand];
            names[rand] = temp;
        }
    
        return names;
      };
  }, []);

  return (
    <div className="App">
      <header className="d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Theta Tau Spoon Assassin</h1>
        <img className="image" src={shield}></img>
      </header>
      <div>
        <p><u>Target Assignment</u></p>
        <p id="signInText">Sign in with your SCU account to get your target.</p>
        <div id="signInDiv"></div>
        { Object.keys(target).length !== 0 &&
          <div>
            <p>Welcome {user.name}</p>
            <p>Your objective: Eliminate {target.name}</p>
          </div>     
        }
      </div>

      <div>
        <p><u>Eliminations</u></p>
        {/* <p>You have two ways to kill:</p> */}
        <ol>
          <li>
            Spoon kills: Tap your target with a spoon in order to get them out. If your target is holding a spoon in their hand, the kill does not count. No throwing your spoon or using an abnormally large spoon. In other words, the spoon must be “regulation size”.
          </li>
          <br></br>
          <img className="image" src={bigSpoon}></img>
          <p>e.g. King Bach using a spoon NOT up to regulations.</p>
          
          {/* <li>
            Grenade kills: In order to kill your target with a grenade, you must roll/drop/throw a rolled up sock ball within a three feet radius of them and wait five seconds for it to explode. In order for the kill to count, when the grenade goes off you <b>cannot</b> be within a 3 foot radius of it. Targets can save themselves by getting more than three feet away from the sock ball before the five seconds are up. <b>This kill can have witnesses</b>.
          </li> */}
        </ol>
        <p>All kills will be made on the honor system.</p>
      </div>

      <div>
        <p><u>Safe Zones</u></p>
        <p>Kills cannot be made during:</p>
        <ul>
          <li>Class</li>
          <li>A course-related lab (Independent/undergraduate research does not protect you)</li>
          <li>Places of worship/religious events</li>
          <li>Active participation in a sporting event (practices or warmups do not count)</li>
          <li>Your bed when asleep / trying to sleep</li>
          <li>Places of work during work hours (for CFs this is only when you’re on rounds/at the desk/dealing with some crisis)</li>
          <li>Official theta tau events (tabling is fine as long as the person isn’t actively helping someone)</li>
          <li>A brodate where the hunter and target are in the same official brodate group. You can still be eliminated during a brodate if the hunter is not a part of the official brodate group. You can still be eliminated if you are in the same brodate group, just not during the brodate.</li>
        </ul>
      </div>

      <div>
        <p><u>What To Do After A Kill</u></p>
        <p>After killing your target, send a dramatic picture of your kill to Chris Tamayo and he will post it in the slack. Ask your target for the name of your new target (their target now becomes your new one).</p>
        <img className="image" src={kill}></img>
      </div>
      
      <div>
        <p><u>Deadlines</u></p>
        <p>You have deadlines to eliminate your target, otherwise you are eliminated. If you have not eliminated your first target by chapter after week 5 (May 5th), you are eliminated. If you have not eliminated your second target by chapter after week 7 (May 19th), you are eliminated. These are tentative dates and may be modified during the quarter depending on the pace of the game. Adequate warning will be given.</p>
      </div>
    </div>
  );
}

export default App;
