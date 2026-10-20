let currentStep = 'name'; // name -> format -> prize -> theme -> layout -> players -> ready
let selectedRound = 'ALL';

let tourneyData = {
    name: 'CHAMPIONSHIP TOURNAMENT',
    venue: 'MAIN HALL',
    totalPool: 0,
    prizes: { first: 0, second: 0, third: 0 },
    format: 'round-robin', // round-robin | single-elimination
    theme: 'cyber',
    layout: 'box', // box | brackets | list
    players: [],
    rounds: [],
    thirdPlaceMatch: null,
    byeCounts: {}, // tracks how many passes each player has received so it always rotates fairly
    points: { win: 3, draw: 1, loss: 0 }
};

const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const placeholderView = document.getElementById('placeholderView');
const dashboardView = document.getElementById('dashboardView');
const chatDoneBar = document.getElementById('chatDoneBar');
const liveCustomizer = document.getElementById('liveCustomizer');

window.addEventListener('DOMContentLoaded', () => {
    initWelcome();
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    });
});

function initWelcome() {
    chatHistory.innerHTML = '';
    addMessage(
        `Welcome to BracketForge AI. Let's build your custom tournament.<br><br><strong>1. What is the name of your tournament?</strong>`,
        'bot'
    );
}

// PRIZE POOL CALCULATOR:
// 1st gets 50% (half).
// From the remaining 50%: 2nd gets 75% (37.5% of total) and 3rd gets 25% (12.5% of total).
function calculatePrizeSplit(inputStr) {
    const cleaned = String(inputStr).replace(/[^0-9.]/g, '');
    const total = parseFloat(cleaned);

    if (isNaN(total) || total <= 0) {
        tourneyData.totalPool = 0;
        tourneyData.prizes = { first: 0, second: 0, third: 0 };
        updateBannerUI();
        return false;
    }

    const firstHalf = total * 0.5;
    const secondHalf = total - firstHalf;

    const first = Math.round(firstHalf * 100) / 100;
    const second = Math.round((secondHalf * 0.75) * 100) / 100;
    const third = Math.round((secondHalf * 0.25) * 100) / 100;

    tourneyData.totalPool = total;
    tourneyData.prizes = { first, second, third };
    updateBannerUI();
    return true;
}

function updateBannerUI() {
    document.getElementById('tourneyTitle').innerText = tourneyData.name;
    document.getElementById('venueDisplay').innerText = tourneyData.venue;
    document.getElementById('totalPrizeDisplay').innerText = tourneyData.totalPool;
    document.getElementById('prize1Display').innerText = tourneyData.prizes.first;
    document.getElementById('prize2Display').innerText = tourneyData.prizes.second;
    document.getElementById('prize3Display').innerText = tourneyData.prizes.third;
    document.getElementById('tourneyMeta').innerText = `${tourneyData.format.toUpperCase()} // ${tourneyData.players.length} PLAYERS`;
}

function addMessage(text, sender, chips = []) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;

    if (chips.length > 0) {
        const chipBox = document.createElement('div');
        chipBox.className = 'quick-chips';
        chips.forEach(c => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip-btn';
            if (c.color) {
                btn.innerHTML = `<span class="chip-color-dot" style="background:${c.color};"></span>${c.label}`;
            } else {
                btn.innerText = c.label;
            }
            btn.onclick = () => {
                userInput.value = c.value;
                handleSend();
            };
            chipBox.appendChild(btn);
        });
        bubble.appendChild(chipBox);
    }

    chatHistory.appendChild(bubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';

    setTimeout(() => {
        processResponse(text);
    }, 250);
}

function processResponse(text) {
    const lower = text.toLowerCase().trim();

    // Global command: if user says "done" after tournament is built, minimize chat and show fullscreen
    if (currentStep === 'ready' && (lower === 'done' || lower === 'finish' || lower === 'close')) {
        minimizeBotToFullscreen();
        return;
    }

    if (currentStep === 'name') {
        tourneyData.name = text;
        currentStep = 'format';
        addMessage(
            `Tournament Name set to <strong>${tourneyData.name}</strong>.<br><br><strong>2. Choose the tournament format:</strong>`,
            'bot',
            [
                { label: 'Round-Robin (Everyone plays everyone)', value: 'round-robin' },
                { label: 'Single-Elimination (Knockout)', value: 'single-elimination' }
            ]
        );
    } else if (currentStep === 'format') {
        if (lower.includes('elim') || lower.includes('knockout') || lower.includes('single')) {
            tourneyData.format = 'single-elimination';
        } else {
            tourneyData.format = 'round-robin';
        }
        currentStep = 'prize';
        addMessage(
            `Format set to <strong>${tourneyData.format.toUpperCase()}</strong>.<br><br><strong>3. How much is the total prize pool?</strong><br><em>Type any amount you want (e.g. 500, 1000, 240). It will automatically divide: 50% to 1st place, 75% of the second half to 2nd place, and 25% of the second half to 3rd place.</em>`,
            'bot'
        );
    } else if (currentStep === 'prize') {
        const ok = calculatePrizeSplit(text);
        if (!ok) {
            addMessage(`Please enter a valid number for the prize pool (for example: <code>500</code> or <code>1000</code>).`, 'bot');
            return;
        }
        currentStep = 'theme';
        addMessage(
            `Total Pool of <strong>${tourneyData.totalPool}</strong> divided:<br>- 1st Place (50%): <strong>${tourneyData.prizes.first}</strong><br>- 2nd Place (37.5%): <strong>${tourneyData.prizes.second}</strong><br>- 3rd Place (12.5%): <strong>${tourneyData.prizes.third}</strong><br><br><strong>4. Pick a color theme:</strong>`,
            'bot',
            [
                { label: 'Cyber Cyan', value: 'cyber', color: '#00f0ff' },
                { label: 'Broadcast Gold', value: 'gold', color: '#d4af37' },
                { label: 'Pitch Emerald', value: 'emerald', color: '#00ff88' },
                { label: 'Crimson Red', value: 'crimson', color: '#ff4d6d' },
                { label: 'Royal Purple', value: 'royal', color: '#c084fc' },
                { label: 'Clean Slate Dark', value: 'slate', color: '#ffffff' }
            ]
        );
    } else if (currentStep === 'theme') {
        applyThemeFromText(lower);
        currentStep = 'layout';
        addMessage(
            `Color theme applied.<br><br><strong>5. How do you want the tournament matches displayed?</strong><br><em>Note: You can enter 20, 27, or any number of players. The connected Brackets tree view activates when 8 or fewer players remain.</em>`,
            'bot',
            [
                { label: 'Brackets (Connected Knockout Tree)', value: 'brackets' },
                { label: 'Normal Box (Arena Match Cards)', value: 'box' },
                { label: 'List (Compact Match Rows)', value: 'list' }
            ]
        );
    } else if (currentStep === 'layout') {
        applyLayoutFromText(lower);
        currentStep = 'players';
        addMessage(
            `Display style set to <strong>${tourneyData.layout.toUpperCase()}</strong>.<br><br><strong>6. Enter the player names separated by commas (or type how many players to auto-generate, e.g. "15 players" or "27 players"):</strong><br><em>If there is an odd number of players, a different player receives the automatic pass each round.</em>`,
            'bot',
            [
                { label: 'Generate 5 Players (Odd - Test Rotating Bye)', value: '5 players' },
                { label: 'Generate 8 Players (Test Top-8 Brackets)', value: '8 players' },
                { label: 'Generate 19 Players (Large Odd Roster)', value: '19 players' }
            ]
        );
    } else if (currentStep === 'players') {
        const parsedPlayers = parsePlayerInput(text);
        if (parsedPlayers.length < 2) {
            addMessage(`Please enter at least 2 player names separated by commas, or type a count like <code>12 players</code>.`, 'bot');
            return;
        }

        tourneyData.players = parsedPlayers;
        currentStep = 'ready';
        generateTournament();
        chatDoneBar.classList.remove('hidden');
        document.getElementById('resetBtn').classList.remove('hidden');

        addMessage(
            `<strong>Tournament created with ${tourneyData.players.length} players.</strong><br><br>Before closing this menu, you can still change anything by typing:<br>- <code>prize 1200</code> (updates prize split)<br>- <code>color gold</code> / <code>cyber</code> / <code>emerald</code> / <code>crimson</code> / <code>royal</code><br>- <code>style brackets</code> / <code>box</code> / <code>list</code><br>- <code>format round-robin</code> or <code>format single-elimination</code><br>- <code>venue Hall B</code><br>- <code>add PlayerName</code><br><br>When you are satisfied, type <strong>done</strong> or click the green <strong>DONE</strong> button below to close this menu and view the tournament full screen.`,
            'bot',
            [
                { label: 'DONE - Close Menu & Fullscreen', value: 'done' },
                { label: 'Style: Brackets', value: 'style brackets' },
                { label: 'Style: Normal Box', value: 'style box' },
                { label: 'Style: List', value: 'style list' }
            ]
        );
    } else if (currentStep === 'ready') {
        handleLiveEditCommands(text, lower);
    }
}

function parsePlayerInput(text) {
    // Check if user typed "20 players" or just a number like "15"
    const countMatch = text.trim().match(/^(\d+)\s*(players|people|names|entrants)?$/i);
    if (countMatch) {
        const count = parseInt(countMatch[1], 10);
        if (count >= 2 && count <= 64) {
            const generated = [];
            for (let i = 1; i <= count; i++) {
                generated.push(`Competitor ${i}`);
            }
            return generated;
        }
    }
    return text.split(',').map(s => s.trim()).filter(Boolean);
}

function applyThemeFromText(lower) {
    if (lower.includes('gold')) changeTheme('gold');
    else if (lower.includes('emerald') || lower.includes('green')) changeTheme('emerald');
    else if (lower.includes('crimson') || lower.includes('red')) changeTheme('crimson');
    else if (lower.includes('royal') || lower.includes('purple')) changeTheme('royal');
    else if (lower.includes('slate') || lower.includes('dark')) changeTheme('slate');
    else changeTheme('cyber');
}

function applyLayoutFromText(lower) {
    if (lower.includes('bracket') || lower.includes('tree') || lower.includes('fifa')) {
        tourneyData.layout = 'brackets';
    } else if (lower.includes('list') || lower.includes('row') || lower.includes('compact')) {
        tourneyData.layout = 'list';
    } else {
        tourneyData.layout = 'box';
    }
    document.getElementById('liveLayoutSelect').value = tourneyData.layout;
}

function handleLiveEditCommands(text, lower) {
    if (lower.startsWith('prize ') || lower.startsWith('pool ')) {
        const val = text.split(' ').slice(1).join(' ');
        if (calculatePrizeSplit(val)) {
            addMessage(`Prize pool updated to <strong>${tourneyData.totalPool}</strong> (1st: ${tourneyData.prizes.first} | 2nd: ${tourneyData.prizes.second} | 3rd: ${tourneyData.prizes.third}). Type <strong>done</strong> when ready.`, 'bot');
        }
    } else if (!isNaN(parseFloat(text)) && /^\d+(\.\d+)?$/.test(text.trim())) {
        calculatePrizeSplit(text);
        addMessage(`Prize pool updated to <strong>${tourneyData.totalPool}</strong> (1st: ${tourneyData.prizes.first} | 2nd: ${tourneyData.prizes.second} | 3rd: ${tourneyData.prizes.third}).`, 'bot');
    } else if (lower.startsWith('color ') || lower.startsWith('theme ')) {
        applyThemeFromText(lower);
        addMessage(`Color theme updated to <strong>${tourneyData.theme.toUpperCase()}</strong>.`, 'bot');
    } else if (lower.startsWith('style ') || lower.startsWith('view ') || lower.startsWith('layout ')) {
        applyLayoutFromText(lower);
        renderRoundPills();
        renderBoard();
        addMessage(`Board style switched to <strong>${tourneyData.layout.toUpperCase()}</strong>.`, 'bot');
    } else if (lower.startsWith('venue ')) {
        tourneyData.venue = text.substring(6).trim().toUpperCase();
        updateBannerUI();
        addMessage(`Venue updated to <strong>${tourneyData.venue}</strong>.`, 'bot');
    } else if (lower.startsWith('format ')) {
        tourneyData.format = (lower.includes('elim') || lower.includes('knockout')) ? 'single-elimination' : 'round-robin';
        generateTournament();
        addMessage(`Format switched to <strong>${tourneyData.format.toUpperCase()}</strong> and matches regenerated.`, 'bot');
    } else if (lower.startsWith('add ')) {
        const newPlayer = text.substring(4).trim();
        if (newPlayer) {
            tourneyData.players.push(newPlayer);
            generateTournament();
            addMessage(`Added <strong>${newPlayer}</strong> (Total: ${tourneyData.players.length} players) and recalculated rotating byes.`, 'bot');
        }
    } else if (lower.startsWith('players ')) {
        const list = parsePlayerInput(text.substring(8));
        if (list.length >= 2) {
            tourneyData.players = list;
            generateTournament();
            addMessage(`Player roster replaced (${tourneyData.players.length} players).`, 'bot');
        }
    } else {
        addMessage(
            `You can type:<br>- <code>prize 500</code><br>- <code>color gold</code><br>- <code>style brackets</code> / <code>style box</code> / <code>style list</code><br>- <code>add PlayerName</code><br>- Or type <strong>done</strong> to close this chat and view fullscreen.`,
            'bot'
        );
    }
}

// =========================================================================
// TOURNAMENT ENGINE: ROUND-ROBIN & SINGLE-ELIMINATION WITH ROTATING BYES
// =========================================================================
function generateTournament() {
    placeholderView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    liveCustomizer.classList.remove('hidden');
    updateBannerUI();

    tourneyData.rounds = [];
    tourneyData.thirdPlaceMatch = null;
    tourneyData.byeCounts = {};
    tourneyData.players.forEach(p => { tourneyData.byeCounts[p] = 0; });

    if (tourneyData.format === 'round-robin') {
        buildRoundRobinSchedule();
        selectedRound = 1;
    } else {
        buildSingleEliminationRound1();
        selectedRound = 'ALL';
    }

    renderRoundPills();
    renderBoard();
    updateStandings();
}

// ROUND-ROBIN: Circle Method guarantees every player gets at most 1 bye in a different round
function buildRoundRobinSchedule() {
    let roster = [...tourneyData.players];
    const isOdd = roster.length % 2 !== 0;
    if (isOdd) {
        roster.push('__BYE__');
    }

    const n = roster.length;
    const totalRounds = n - 1;
    const half = n / 2;

    for (let r = 0; r < totalRounds; r++) {
        let roundMatches = [];
        let roundByePlayer = null;
        let tableCounter = 1;

        for (let i = 0; i < half; i++) {
            const p1 = roster[i];
            const p2 = roster[n - 1 - i];

            if (p1 === '__BYE__') {
                roundByePlayer = p2;
            } else if (p2 === '__BYE__') {
                roundByePlayer = p1;
            } else {
                roundMatches.push({
                    id: `rr_r${r + 1}_m${tableCounter}`,
                    roundNum: r + 1,
                    table: tableCounter++,
                    p1: p1,
                    p2: p2,
                    winner: null,
                    completed: false
                });
            }
        }

        if (roundByePlayer) {
            tourneyData.byeCounts[roundByePlayer] = (tourneyData.byeCounts[roundByePlayer] || 0) + 1;
        }

        tourneyData.rounds.push({
            roundNum: r + 1,
            title: `Round ${r + 1}`,
            entrantCount: tourneyData.players.length,
            byePlayer: roundByePlayer,
            matches: roundMatches
        });

        // Rotate clockwise while keeping index 0 fixed -> guarantees a different person gets the bye every round
        roster.splice(1, 0, roster.pop());
    }
}

// SINGLE-ELIMINATION: Supports any number of players (e.g. 5, 19, 27) with fair rotating byes
function buildSingleEliminationRound1() {
    let pool = [...tourneyData.players];
    createNextKnockoutRound(pool, 1);
}

function getStageTitle(playerCount, roundNum) {
    if (playerCount === 2) return 'Grand Final';
    if (playerCount <= 4) return 'Semi-Finals';
    if (playerCount <= 8) return 'Quarter-Finals';
    return `Elimination Round ${roundNum} (${playerCount} Players)`;
}

function createNextKnockoutRound(activePlayers, roundNum) {
    let pool = [...activePlayers];
    const entrantCount = pool.length;
    let byePlayer = null;

    // If odd number of players in this round, pick the player with the lowest byeCount so the bye rotates fairly
    if (pool.length % 2 !== 0) {
        let minByes = Infinity;
        let chosenIndex = 0;

        for (let i = 0; i < pool.length; i++) {
            const p = pool[i];
            const c = tourneyData.byeCounts[p] || 0;
            if (c < minByes) {
                minByes = c;
                chosenIndex = i;
            }
        }

        byePlayer = pool.splice(chosenIndex, 1)[0];
        tourneyData.byeCounts[byePlayer] = (tourneyData.byeCounts[byePlayer] || 0) + 1;
    }

    let matches = [];
    let tableNum = 1;
    for (let i = 0; i < pool.length; i += 2) {
        matches.push({
            id: `se_r${roundNum}_m${tableNum}`,
            roundNum: roundNum,
            table: tableNum++,
            p1: pool[i],
            p2: pool[i + 1],
            winner: null,
            loser: null,
            completed: false
        });
    }

    tourneyData.rounds.push({
        roundNum: roundNum,
        title: getStageTitle(entrantCount, roundNum),
        entrantCount: entrantCount,
        byePlayer: byePlayer,
        matches: matches
    });
}

function setMatchResult(matchId, resultWinner) {
    if (tourneyData.thirdPlaceMatch && tourneyData.thirdPlaceMatch.id === matchId) {
        tourneyData.thirdPlaceMatch.winner = resultWinner;
        tourneyData.thirdPlaceMatch.completed = true;
        renderBoard();
        updateStandings();
        return;
    }

    let foundRoundIndex = -1;
    for (let i = 0; i < tourneyData.rounds.length; i++) {
        const m = tourneyData.rounds[i].matches.find(x => x.id === matchId);
        if (m) {
            // In single-elimination, draws are not allowed because someone must advance
            if (tourneyData.format === 'single-elimination' && resultWinner === 'DRAW') {
                return;
            }
            m.winner = resultWinner;
            m.loser = (resultWinner === m.p1) ? m.p2 : (resultWinner === m.p2 ? m.p1 : null);
            m.completed = true;
            foundRoundIndex = i;
            break;
        }
    }

    // If Single-Elimination and user changed an earlier round, rebuild subsequent rounds cleanly
    if (tourneyData.format === 'single-elimination' && foundRoundIndex !== -1) {
        // Remove any rounds after the edited round and recalculate
        if (foundRoundIndex < tourneyData.rounds.length - 1) {
            tourneyData.rounds.splice(foundRoundIndex + 1);
            tourneyData.thirdPlaceMatch = null;
        }
        checkAndAdvanceSingleElimination();
    }

    renderRoundPills();
    renderBoard();
    updateStandings();
}

function checkAndAdvanceSingleElimination() {
    const lastRound = tourneyData.rounds[tourneyData.rounds.length - 1];
    if (!lastRound) return;

    const allCompleted = lastRound.matches.every(m => m.completed && m.winner);
    if (!allCompleted) return;

    let advancingPlayers = [];
    let roundLosers = [];

    // Put the bye player at the end of the advancing list so someone else gets priority for the next bye
    lastRound.matches.forEach(m => {
        advancingPlayers.push(m.winner);
        if (m.loser) roundLosers.push(m.loser);
    });
    if (lastRound.byePlayer) {
        advancingPlayers.push(lastRound.byePlayer);
    }

    // If Semi-Finals just finished (2 matches -> 2 losers), create 3rd Place Playoff match automatically
    if (lastRound.matches.length === 2 && roundLosers.length === 2 && advancingPlayers.length === 2) {
        tourneyData.thirdPlaceMatch = {
            id: `se_third_place`,
            roundNum: lastRound.roundNum + 1,
            table: 2,
            p1: roundLosers[0],
            p2: roundLosers[1],
            winner: null,
            completed: false
        };
    }

    if (advancingPlayers.length <= 1) {
        return; // Tournament Champion Decided!
    }

    createNextKnockoutRound(advancingPlayers, lastRound.roundNum + 1);

    // If a round just reached 8 or fewer players, and user chose 'brackets', show all Top-8 rounds
    const newestRound = tourneyData.rounds[tourneyData.rounds.length - 1];
    if (selectedRound !== 'ALL') {
        selectedRound = newestRound.roundNum;
    }
}

function renderRoundPills() {
    const bar = document.getElementById('roundFilterBar');
    let html = `<button class="round-pill ${selectedRound === 'ALL' ? 'active' : ''}" onclick="selectRound('ALL')">ALL ROUNDS</button>`;
    tourneyData.rounds.forEach(r => {
        html += `<button class="round-pill ${selectedRound === r.roundNum ? 'active' : ''}" onclick="selectRound(${r.roundNum})">R${r.roundNum}: ${r.title.toUpperCase()}</button>`;
    });
    bar.innerHTML = html;
}

function selectRound(rNum) {
    selectedRound = rNum;
    renderRoundPills();
    renderBoard();
}

function renderBoard() {
    const container = document.getElementById('matchesContainer');
    const byeContainer = document.getElementById('byeBannerContainer');
    const noticeContainer = document.getElementById('stageNoticeContainer');

    container.innerHTML = '';
    byeContainer.innerHTML = '';
    noticeContainer.innerHTML = '';

    const roundsToShow = (selectedRound === 'ALL')
        ? tourneyData.rounds
        : tourneyData.rounds.filter(r => r.roundNum === selectedRound);

    // Always show the Rotating Bye Summary banner at the top so you can clearly see who got the pass in each round
    const byeBannersHTML = roundsToShow
        .filter(r => r.byePlayer)
        .map(r => `
            <div class="bye-banner">
                <span>ROUND ${r.roundNum} (${r.title.toUpperCase()}) AUTOMATIC PASS / BYE: <strong>${r.byePlayer}</strong></span>
                <span>ADVANCES (+1 WIN)</span>
            </div>
        `).join('');
    byeContainer.innerHTML = byeBannersHTML;

    // RULE: Brackets (FIFA Connected Tree) is specifically for the Top-8 stage (<= 8 players left).
    // If there are rounds with > 8 players and rounds with <= 8 players:
    if (tourneyData.layout === 'brackets') {
        const top8Rounds = tourneyData.rounds.filter(r => r.entrantCount <= 8);
        const prelimRounds = roundsToShow.filter(r => r.entrantCount > 8);

        if (prelimRounds.length > 0 && top8Rounds.length === 0) {
            noticeContainer.innerHTML = `
                <div class="stage-notice">
                    PRELIMINARY QUALIFYING STAGE (${prelimRounds[0].entrantCount} PLAYERS): Complete matches below until 8 or fewer players remain to unlock the connected Top-8 Knockout Bracket Tree.
                </div>
            `;
            container.className = `matches-arena layout-box`;
            prelimRounds.forEach(r => {
                r.matches.forEach(m => {
                    container.innerHTML += createNormalBoxCard(m, r);
                });
            });
            return;
        }

        // Render Top-8 Brackets Tree
        container.className = `matches-arena layout-brackets`;
        const bracketRoundsToRender = top8Rounds.length > 0 ? top8Rounds : roundsToShow;

        bracketRoundsToRender.forEach((r, idx) => {
            let colHtml = `
                <div class="fifa-column">
                    <div class="fifa-col-header">${r.title}</div>
                    <div class="fifa-matches-wrap">
            `;

            if (r.byePlayer) {
                colHtml += `
                    <div class="bye-banner" style="font-size:12px; padding:8px 12px; margin-bottom:8px;">
                        <span>ROUND ${r.roundNum} PASS: <strong>${r.byePlayer}</strong></span>
                        <span>ADVANCES</span>
                    </div>
                `;
            }

            r.matches.forEach(m => {
                colHtml += createFifaBracketCard(m, r.title, false);
            });

            // If this is the Grand Final column and there is a 3rd place match, render 3rd place playoff underneath
            if (r.title === 'Grand Final' && tourneyData.thirdPlaceMatch) {
                colHtml += `
                    <div class="third-place-section">
                        <div class="fifa-col-header">Third place play-off</div>
                        ${createFifaBracketCard(tourneyData.thirdPlaceMatch, '3rd Place', true)}
                    </div>
                `;
            }

            colHtml += `</div></div>`;
            container.innerHTML += colHtml;
        });
        return;
    }

    // STYLE 2: LIST VIEW
    if (tourneyData.layout === 'list') {
        container.className = `matches-arena layout-list`;
        roundsToShow.forEach(r => {
            r.matches.forEach(m => {
                container.innerHTML += createListRowCard(m, r);
            });
        });
        if (tourneyData.thirdPlaceMatch && selectedRound === 'ALL') {
            container.innerHTML += createListRowCard(tourneyData.thirdPlaceMatch, { roundNum: '3RD', title: '3RD PLACE PLAYOFF' });
        }
        return;
    }

    // STYLE 3: NORMAL BOX VIEW
    container.className = `matches-arena layout-box`;
    roundsToShow.forEach(r => {
        r.matches.forEach(m => {
            container.innerHTML += createNormalBoxCard(m, r);
        });
    });
    if (tourneyData.thirdPlaceMatch && selectedRound === 'ALL') {
        container.innerHTML += createNormalBoxCard(tourneyData.thirdPlaceMatch, { roundNum: '3RD', title: '3RD PLACE PLAYOFF' });
    }
}

function createFifaBracketCard(m, stageTitle, isThirdPlace) {
    const w1 = m.winner === m.p1;
    const w2 = m.winner === m.p2;
    const isDraw = m.winner === 'DRAW';
    const score1 = m.completed ? (w1 ? '1' : isDraw ? '1' : '0') : '-';
    const score2 = m.completed ? (w2 ? '1' : isDraw ? '1' : '0') : '-';

    const allowDraw = tourneyData.format === 'round-robin';

    return `
        <div class="fifa-card ${m.completed ? 'completed' : ''} ${isThirdPlace ? 'third-place-card' : ''}">
            <div class="fifa-meta-top">
                <span>${stageTitle} • Match ${m.table}</span>
                <span class="fifa-status-pill ${m.completed ? 'ft' : ''}">${m.completed ? 'FT' : 'LIVE'}</span>
            </div>
            <div class="fifa-team-row ${w1 ? 'winner' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p1)}')">
                <div class="fifa-team-left">
                    <span class="team-color-bar"></span>
                    <span>${m.p1}</span>
                </div>
                <div class="fifa-score-right">
                    <span>${score1}</span>
                    ${w1 ? '<span class="winner-caret">&#9664;</span>' : ''}
                </div>
            </div>
            <div class="fifa-team-row ${w2 ? 'winner' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p2)}')">
                <div class="fifa-team-left">
                    <span class="team-color-bar"></span>
                    <span>${m.p2}</span>
                </div>
                <div class="fifa-score-right">
                    <span>${score2}</span>
                    ${w2 ? '<span class="winner-caret">&#9664;</span>' : ''}
                </div>
            </div>
            ${allowDraw ? `
                <div style="margin-top:6px; text-align:right;">
                    <button class="win-btn draw-btn ${isDraw ? 'selected' : ''}" style="padding:3px 8px; font-size:10px;" onclick="setMatchResult('${m.id}', 'DRAW')">DRAW</button>
                </div>
            ` : ''}
        </div>
    `;
}

function createNormalBoxCard(m, r) {
    const w1 = m.winner === m.p1;
    const w2 = m.winner === m.p2;
    const isDraw = m.winner === 'DRAW';
    const allowDraw = tourneyData.format === 'round-robin';

    return `
        <div class="pitch-card ${m.completed ? 'completed' : ''}">
            <div class="pitch-header">
                <span>${r.title.toUpperCase()} // MATCH ${m.table}</span>
                <span>${m.completed ? 'FT' : 'LIVE'}</span>
            </div>
            <div class="pitch-body">
                <div class="player-slot ${w1 ? 'winner-slot' : ''}">
                    <span>${m.p1}</span>
                    <span>${w1 ? 'WINNER' : ''}</span>
                </div>
                <div class="vs-badge-center">VS</div>
                <div class="player-slot ${w2 ? 'winner-slot' : ''}">
                    <span>${m.p2}</span>
                    <span>${w2 ? 'WINNER' : ''}</span>
                </div>
                <div class="quick-win-bar">
                    <button class="win-btn ${w1 ? 'selected' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p1)}')">${m.p1} WINS</button>
                    ${allowDraw ? `<button class="win-btn draw-btn ${isDraw ? 'selected' : ''}" onclick="setMatchResult('${m.id}', 'DRAW')">DRAW</button>` : ''}
                    <button class="win-btn ${w2 ? 'selected' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p2)}')">${m.p2} WINS</button>
                </div>
            </div>
        </div>
    `;
}

function createListRowCard(m, r) {
    const w1 = m.winner === m.p1;
    const w2 = m.winner === m.p2;
    const isDraw = m.winner === 'DRAW';
    const allowDraw = tourneyData.format === 'round-robin';

    return `
        <div class="compact-row ${m.completed ? 'completed' : ''}">
            <span class="meta-badge">${r.title.toUpperCase()} // M${m.table}</span>
            <div class="compact-players">
                <span style="${w1 ? 'color:var(--win-green)' : ''}">${m.p1} ${w1 ? '[WIN]' : ''}</span>
                <span style="color:var(--text-dim); margin:0 12px;">VS</span>
                <span style="${w2 ? 'color:var(--win-green)' : ''}">${m.p2} ${w2 ? '[WIN]' : ''}</span>
            </div>
            <div class="quick-win-bar" style="margin-top:0; min-width:260px;">
                <button class="win-btn ${w1 ? 'selected' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p1)}')">${m.p1} WINS</button>
                ${allowDraw ? `<button class="win-btn draw-btn ${isDraw ? 'selected' : ''}" onclick="setMatchResult('${m.id}', 'DRAW')">DRAW</button>` : ''}
                <button class="win-btn ${w2 ? 'selected' : ''}" onclick="setMatchResult('${m.id}', '${escapeQuotes(m.p2)}')">${m.p2} WINS</button>
            </div>
        </div>
    `;
}

function escapeQuotes(str) {
    return String(str).replace(/'/g, "\\'");
}

function updateStandings() {
    const stats = {};
    tourneyData.players.forEach(p => {
        stats[p] = { wins: 0, draws: 0, losses: 0, passes: 0, pts: 0, passRounds: [] };
    });

    tourneyData.rounds.forEach(r => {
        if (r.byePlayer && stats[r.byePlayer]) {
            stats[r.byePlayer].passes++;
            stats[r.byePlayer].wins++;
            stats[r.byePlayer].pts += tourneyData.points.win;
            stats[r.byePlayer].passRounds.push(`R${r.roundNum}`);
        }
        r.matches.forEach(m => {
            if (!m.completed) return;
            if (m.winner === m.p1) {
                stats[m.p1].wins++;
                stats[m.p1].pts += tourneyData.points.win;
                stats[m.p2].losses++;
            } else if (m.winner === m.p2) {
                stats[m.p2].wins++;
                stats[m.p2].pts += tourneyData.points.win;
                stats[m.p1].losses++;
            } else if (m.winner === 'DRAW') {
                stats[m.p1].draws++;
                stats[m.p2].draws++;
                stats[m.p1].pts += tourneyData.points.draw;
                stats[m.p2].pts += tourneyData.points.draw;
            }
        });
    });

    if (tourneyData.thirdPlaceMatch && tourneyData.thirdPlaceMatch.completed) {
        const tm = tourneyData.thirdPlaceMatch;
        if (tm.winner === tm.p1) {
            stats[tm.p1].wins++;
            stats[tm.p1].pts += tourneyData.points.win;
            stats[tm.p2].losses++;
        } else if (tm.winner === tm.p2) {
            stats[tm.p2].wins++;
            stats[tm.p2].pts += tourneyData.points.win;
            stats[tm.p1].losses++;
        }
    }

    const sorted = Object.keys(stats).sort((a, b) => {
        if (stats[b].pts !== stats[a].pts) return stats[b].pts - stats[a].pts;
        if (stats[b].wins !== stats[a].wins) return stats[b].wins - stats[a].wins;
        return stats[a].losses - stats[b].losses;
    });

    const body = document.getElementById('standingsBody');
    body.innerHTML = sorted.map((p, idx) => {
        const s = stats[p];
        const rank = idx + 1;
        const rankLabel = rank === 1 ? '1ST' : rank === 2 ? '2ND' : rank === 3 ? '3RD' : `#${rank}`;
        const passBadge = s.passes > 0
            ? `<span class="pass-tag">BYE PASS: ${s.passRounds.join(', ')}</span>`
            : '';

        return `
            <div class="score-row-card rank-${rank}">
                <div class="score-left">
                    <div class="rank-badge">${rankLabel}</div>
                    <div>
                        <span class="score-player-name">${p}</span>
                        ${passBadge}
                    </div>
                </div>
                <div class="score-right">
                    <div class="record-pill">${s.wins}W - ${s.draws}D - ${s.losses}L</div>
                    <div class="pts-big">${s.pts} PTS</div>
                </div>
            </div>
        `;
    }).join('');
}

function changeTheme(themeName) {
    tourneyData.theme = themeName;
    document.body.setAttribute('data-theme', themeName);
}

function changeLayout(layoutName) {
    tourneyData.layout = layoutName;
    document.getElementById('liveLayoutSelect').value = layoutName;
    renderRoundPills();
    renderBoard();
}

function minimizeBotToFullscreen() {
    document.getElementById('chatSidebar').classList.add('minimized');
    const btn = document.getElementById('toggleChatBtn');
    btn.classList.remove('hidden');
    btn.innerText = 'OPEN BOT CHAT';
}

function toggleChatSidebar() {
    const sidebar = document.getElementById('chatSidebar');
    const btn = document.getElementById('toggleChatBtn');
    sidebar.classList.toggle('minimized');
    btn.innerText = sidebar.classList.contains('minimized') ? 'OPEN BOT CHAT' : 'HIDE BOT CHAT';
}

function resetTournament() {
    currentStep = 'name';
    selectedRound = 'ALL';
    tourneyData.players = [];
    tourneyData.rounds = [];
    tourneyData.thirdPlaceMatch = null;
    tourneyData.totalPool = 0;
    tourneyData.prizes = { first: 0, second: 0, third: 0 };

    placeholderView.classList.remove('hidden');
    dashboardView.classList.add('hidden');
    chatDoneBar.classList.add('hidden');
    liveCustomizer.classList.add('hidden');
    document.getElementById('resetBtn').classList.add('hidden');
    document.getElementById('chatSidebar').classList.remove('minimized');
    document.getElementById('toggleChatBtn').classList.add('hidden');

    initWelcome();
}

function switchTab(tab) {
    document.getElementById('tabBtnBracket').classList.toggle('active', tab === 'bracket');
    document.getElementById('tabBtnStandings').classList.toggle('active', tab === 'standings');
    document.getElementById('bracketTab').classList.toggle('hidden', tab !== 'bracket');
    document.getElementById('standingsTab').classList.toggle('hidden', tab !== 'standings');
}