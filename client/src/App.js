import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
const SEED = 10;

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
            // console.log("csv string: " + csvString);
    
            const lines = csvString.split('\n');
            const parsedData = lines.map(line => line.trim().split(','));
    
            const names = parsedData.map(row => row[0]);
            const emails = parsedData.map(row => row[1]);
            // console.log("names: " + names);
            // console.log("emails: " + emails);

            const userEmail = userObject.email;
            const target = getTarget(userEmail, names, emails);
            setTarget(target);

            //const target = getTarget(userObject, names, emails);
            // TESTING
            // for (let i = 0; i < emails.length; i++) {
            //   console.log(getTarget(emails[i], names, emails).name);
            // }
          })
          .catch(error => {
            console.error('Error fetching or processing CSV:', error);
          });
      };

      function getTarget(userEmail, names, emails) {
        console.log("user: " + userEmail);
        const userIndex = emails.indexOf(userEmail);
        console.log("user index: " + userIndex);
        if (userIndex === -1) {
          const target = {name: "no one! You're not in the game :P"};
          return target;
        } else {
          const length = emails.length;
          const targetIndex = (userIndex + SEED) % length;
          const target = {name: names[targetIndex]};
          return target;
        }
      }
  }, []);

  return (
    <div className="App">
      <header className="d-flex flex-column justify-content-center align-items-center">
        <h1 class="text-center">Senior Assassin</h1>
        <h5 class="text-center">Website by Chris Tamayo (ty chris)</h5>
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
        <ul>
          <li>Water gun kill: Shoot your target with water in order to get them out. If your target is <strong>wearing</strong> sunglasses, the kill does not count.</li>
        </ul>
        <p>All kills will be made on the honor system.</p>
      </div>

      <div>
        <p><u>Safe Zones</u></p>
        <p>Kills cannot be made during:</p>
        <ul>
          <li>Class</li>
          <li>A course-related lab (Independent/undergraduate research does not protect you)</li>
          <li>Office Hours</li>
          <li>Places of worship/religious events</li>
          <li>Active participation in a sporting event, workout, or dance/cultural show practice (you are not protected during water breaks, chatting between sets, scrolling on your phone between sets)</li>
          <li>Performances for dance/cultural show performers (spectators are not protected). This includes after the actual show during congratulations and photos.</li>
          <li>Your bed when asleep / trying to sleep</li>
          <li>Places of work during work hours (for CFs this is only when you’re on rounds/at the desk/dealing with some crisis)</li>
        </ul>
      </div>

      <div>
        <p><u>What To Do After A Kill</u></p>
        <p>After killing your target, send a dramatic picture of your kill to the TT Seniors group chat. Ask your target for the name of your new target (their target now becomes your new one).</p>
      </div>
      
      <div>
        <br></br>
        <p><u>Your Mission</u></p>
        <p>Make your first kill <strong>by Sunday, May 19</strong></p>
      </div>
    </div>
  );
}

export default App;
