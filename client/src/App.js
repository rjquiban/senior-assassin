import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

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
      <h1>Theta Tau Assassin</h1>
      <div id="signInDiv"></div>
      { Object.keys(target).length !== 0 &&
        <div>
          <p>Welcome {user.name}</p>
          <p>Your objective: Eliminate {target.name}</p>
        </div>     
      }
    </div>
  );
}

export default App;
