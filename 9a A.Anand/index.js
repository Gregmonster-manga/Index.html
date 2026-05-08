 const questions = [
     { q: 'Arduino UNO юу вэ?', options: ['Микроконтроллер', 'Дэлгэц', 'Чанга яригч', 'Камер'], correct: 0 },
     { q: 'HC-05 модуль ямар үүрэгтэй вэ?', options: ['Bluetooth холболт', 'Зай цэнэглэх', 'Дуу гаргах', 'Температур хэмжих'], correct: 0 },
     { q: 'L298N юуг удирддаг вэ?', options: ['LED гэрэл', 'Мотор', 'Дэлгэц', 'Камер'], correct: 1 },
     { q: 'MIT App Inventor юунд ашиглагддаг вэ?', options: ['Апп хийх', 'Хувцас оёх', 'Зураг хэвлэх', 'Видео засах'], correct: 0 },
     { q: 'Ultrasonic sensor ямар үүрэгтэй вэ?', options: ['Зай хадгалах', 'Зай хэмжих', 'Температур өсгөх', 'Дуу тоглуулах'], correct: 1 },
     { q: 'Servo motor юу хийдэг вэ?', options: ['Хаалга хөдөлгөнө', 'Дэлгэц асаана', 'Интернет өгнө', 'Зай цэнэглэнэ'], correct: 0 }
     {
        q:''
     },
   ];


   const players = [
     { id: 1, pos: 16, score: 0, wrong: 0, el: null, scoreEl: null },
     { id: 2, pos: 16, score: 0, wrong: 0, el: null, scoreEl: null },
     { id: 3, pos: 16, score: 0, wrong: 0, el: null, scoreEl: null },
   ];


   let currentIndex = 0;
   let currentPlayerIndex = 0;
   let timeLeft = 45;
   let gameOver = false;
   let soundOn = true;
   let timerInterval;


   const loadingScreen = document.getElementById('loadingScreen');
   const startScreen = document.getElementById('startScreen');
   const questionEl = document.getElementById('question');
   const answersEl = document.getElementById('answers');
   const statusEl = document.getElementById('status');
   const turnLabel = document.getElementById('turnLabel');
   const timerEl = document.getElementById('timer');
   const winnerScreen = document.getElementById('winnerScreen');
   const winnerText = document.getElementById('winnerText');
   const winnerEmoji = document.getElementById('winnerEmoji');
   const soundBtn = document.getElementById('soundBtn');
   const soundBtn2 = document.getElementById('soundBtn2');


   players[0].el = document.getElementById('car1'); players[0].scoreEl = document.getElementById('score1');
   players[1].el = document.getElementById('car2'); players[1].scoreEl = document.getElementById('score2');
   players[2].el = document.getElementById('car3'); players[2].scoreEl = document.getElementById('score3');


   function beep(freq = 440, duration = 0.12) {
     if (!soundOn) return;
     const ctx = new (window.AudioContext || window.webkitAudioContext)();
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.type = 'sine';
     osc.frequency.value = freq;
     gain.gain.value = 0.06;
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + duration);
   }


   function toggleSound() {
     soundOn = !soundOn;
     const text = 'Дуу: ' + (soundOn ? 'Асаалттай' : 'Унтраалттай');
     if (soundBtn) soundBtn.textContent = text;
     if (soundBtn2) soundBtn2.textContent = text;
     if (soundOn) beep(660, 0.08);
   }


   function startExperience() {
     startScreen.style.display = 'none';
     renderQuestion();
     startTimer();
     beep(740, 0.1);
   }


   function startTimer() {
     clearInterval(timerInterval);
     timerInterval = setInterval(() => {
       if (gameOver) return;
       timeLeft--;
       timerEl.textContent = timeLeft;
       if (timeLeft <= 0) finishByScore();
     }, 1000);
   }


   function renderQuestion() {
     const current = questions[currentIndex];
     const player = players[currentPlayerIndex];
     questionEl.textContent = current.q;
     turnLabel.textContent = player.id + '-р машин';
     answersEl.innerHTML = '';
     current.options.forEach((option, index) => {
       const btn = document.createElement('button');
       btn.className = 'option';
       btn.textContent = option;
       btn.onclick = () => selectAnswer(index);
       answersEl.appendChild(btn);
     });
   }


   function animateCar(el) {
     el.classList.add('move');
     setTimeout(() => el.classList.remove('move'), 300);
   }


   function updateScores() {
     players.forEach(p => p.scoreEl.textContent = p.score);
   }


   function selectAnswer(index) {
     if (gameOver) return;
     const current = questions[currentIndex];
     const player = players[currentPlayerIndex];
     const correct = index === current.correct;


     if (correct) {
       player.pos += 70;
       player.score += 10;
       player.wrong = 0;
       statusEl.textContent = player.id + '-р машин зөв хариуллаа! Урагшиллаа.';
       beep(880, 0.12);
     } else {
       player.wrong++;
       beep(220, 0.14);
       if (player.wrong >= 2) {
         player.pos -= 40;
         if (player.pos < 16) player.pos = 16;
         player.wrong = 0;
         statusEl.textContent = player.id + '-р машин 2 дахь буруу хариулт өглөө. Ухарлаа.';
       } else {
         statusEl.textContent = player.id + '-р машин буруу хариуллаа. Байрандаа үлдлээ.';
       }
     }


     player.el.style.left = player.pos + 'px';
     animateCar(player.el);
     updateScores();


     if (player.pos >= 900) {
       showWinner(player.id + '-р машин барианд орж яллаа! 🎉', '🏆');
       return;
     }


     currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
     nextQuestion();
   }


   function nextQuestion() {
     if (gameOver) return;
     currentIndex = (currentIndex + 1) % questions.length;
     renderQuestion();
   }


   function showWinner(text, emoji) {
     gameOver = true;
     clearInterval(timerInterval);
     winnerText.textContent = text;
     winnerEmoji.textContent = emoji;
     winnerScreen.style.display = 'flex';
     statusEl.textContent = 'Тоглоом дууслаа!';
     beep(990, 0.15);
     setTimeout(() => beep(1180, 0.18), 160);
   }
   function finishByScore() {
     const maxScore = Math.max(...players.map(p => p.score));
     const winners = players.filter(p => p.score === maxScore);
     if (winners.length === 1) {
       showWinner('Хугацаа дууслаа. ' + winners[0].id + '-р машин оноогоор яллаа!', '🏁');
     } else {
       showWinner('Хугацаа дууслаа. Тэнцлээ!', '🤝');
     }
   }
   function closeWinner() { winnerScreen.style.display = 'none'; }
   function resetRace() {
     currentIndex = 0;
     currentPlayerIndex = 0;
     timeLeft = 45;
     gameOver = false;
     players.forEach(p => { p.pos = 16; p.score = 0; p.wrong = 0; p.el.style.left = '16px'; });
     updateScores();
     timerEl.textContent = timeLeft;
     winnerScreen.style.display = 'none';
     statusEl.textContent = 'Тоглоом дахин эхэллээ. 1-р машин эхэлнэ.';
     renderQuestion();
     startTimer();
     beep(620, 0.08);
   }   