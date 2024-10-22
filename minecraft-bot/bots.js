const mineflayer = require('mineflayer');

// Funcția de creare a botului
function createBot(botName) {
  const bot = mineflayer.createBot({
    host: '2.56.246.111', // Adresa serverului Minecraft
    port: 25570,          // Portul serverului Minecraft
    username: botName     // Numele botului
  });

  // Când botul se conectează
  bot.on('spawn', () => {
    console.log(`${botName} s-a conectat și începe să zboare.`);
    startMovement(bot);
  });

  // Funcția care începe mișcarea
  function startMovement(bot) {
    let totalDistance = 0;
    let direction = 'forward'; // Începe mergând înainte

    // Generăm random distanțele pentru fiecare bot
    let steps = [
      { direction: 'forward', distance: Math.floor(Math.random() * 5000) + 500 },  // 500-5500 blocuri înainte
      { direction: 'left', distance: Math.floor(Math.random() * 1000) + 100 },    // 100-1100 blocuri la stânga
      { direction: 'right', distance: Math.floor(Math.random() * 1000) + 100 }    // 100-1100 blocuri la dreapta
    ];

    let currentStepIndex = 0;
    let blocksTraveled = 0;

    // Setăm o mișcare constantă
    function move() {
      if (blocksTraveled >= steps[currentStepIndex].distance) {
        // Când botul a parcurs numărul dorit de blocuri, schimbă direcția
        blocksTraveled = 0; // Resetează numărul de blocuri parcurse pentru noua direcție
        currentStepIndex = (currentStepIndex + 1) % steps.length; // Trece la următorul pas
        direction = steps[currentStepIndex].direction;
        console.log(`${botName} schimbă direcția în ${direction}.`);
      }

      // Botul începe să se miște în direcția dorită și zboară
      bot.setControlState(direction, true);
      bot.setControlState('jump', true); // Activează zborul

      // După 1 secundă, considerăm că a parcurs 1 bloc
      setTimeout(() => {
        bot.setControlState(direction, false); // Oprește mișcarea temporar
        bot.setControlState('jump', false); // Oprește zborul temporar
        blocksTraveled++; // Incrementează blocurile parcurse
        totalDistance++;
        console.log(`${botName} a parcurs un total de ${totalDistance} blocuri.`);

        // Apelează funcția din nou pentru a continua mișcarea
        move();
      }, 40); // Așteaptă 100ms înainte de a continua, simulând mișcarea bloc cu bloc
    }

    // Începem mișcarea
    move();
  }

  bot.on('error', err => console.log(`Eroare la ${botName}: ${err}`));
  bot.on('end', () => console.log(`${botName} a ieșit de pe server.`));
}

// Funcția pentru a crea câte un bot la fiecare 3 secunde
function createMultipleBots(totalBots, delay) {
  let botsCreated = 0;

  const interval = setInterval(() => {
    if (botsCreated < totalBots) {
      createBot(`Botul${botsCreated + 1}`); // Creează bot cu nume unic: Botul1, Botul2, etc.
      botsCreated++;
    } else {
      clearInterval(interval); // Oprește crearea boților după ce s-au creat toți cei 100
    }
  }, delay);
}

// Crează 100 de boți cu un interval de 3 secunde între fiecare
createMultipleBots(100, 5000); // 3000ms = 3 secunde
