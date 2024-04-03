const ROSTER = [
    'Liam A\'Hearn', 'Jodi Chui', 'RJ Quiban', 'Divya Syal', 'Chris Tamayo', 'Mack Atencia', 'Julia Cornejo', 'Sophie Criscione', 'Anika Dixit', 'Sneha Dubey', 'Shiv Jhalani', 'Jessie Jiang', 'Liam Kelly', 'Amy Kiyama', 'Aneal Kuverji', 'David Nguyen', 'Anika Sethi', 'Kavitha Vinod', 'Brian Wiebe', 'Gwyn Anawalt', 'Matt Beltran', 'Jack Carpenter', 'Christina Dai', 'Stevie Dean', 'Elia Doehler', 'Jake Esperson', 'Ian Kennar', 'Ryan Kiniris', 'Arran Kooner', 'Rachel Lee', 'Daniel Louie', 'Abem Lucas', 'Maggie Nostrand', 'Justin Odo', 'Vismaya Panicker', 'Lanie Pritchard', 'Samhita Rachapudi', 'Alyssa Rossio', 'Eden Steinbeck', 'Jessie Stone', 'Kolby Yamamoto', 'Caleb Yonas', 'Hanzhe Zhang' 
];
const SEED = 1;

window.onload = (event) => {
    const form = document.getElementById("inputNameForm");
    form.addEventListener("submit", getTarget);
};

function getTarget(event) {
    event.preventDefault();

    // shuffle roster, will always shuffle same
    const shuffled = [...ROSTER];
    shuffleTargets(shuffled, SEED);

    const input = document.getElementById("name").value;

    const targetIndex = (shuffled.indexOf(input) + 1) % shuffled.length;

    var paragraph = document.getElementById("target");

    paragraph.textContent = (targetIndex) ? "Target = " + shuffled[targetIndex] : 'Invalid Input';

    return targetIndex ? shuffled[targetIndex] : 'Invalid Input';
}

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
}