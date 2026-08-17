// 平假名与罗马音对照表（可扩展）
const kanaList = [
    { char: 'あ', romaji: 'a' },
    { char: 'い', romaji: 'i' },
    { char: 'う', romaji: 'u' },
    { char: 'え', romaji: 'e' },
    { char: 'お', romaji: 'o' },
    { char: 'か', romaji: 'ka' },
    { char: 'き', romaji: 'ki' },
    { char: 'く', romaji: 'ku' },
    { char: 'け', romaji: 'ke' },
    { char: 'こ', romaji: 'ko' },
    { char: 'さ', romaji: 'sa' },
    { char: 'し', romaji: 'shi' },
    { char: 'す', romaji: 'su' },
    { char: 'せ', romaji: 'se' },
    { char: 'そ', romaji: 'so' },
    { char: 'た', romaji: 'ta' },
    { char: 'ち', romaji: 'chi' },
    { char: 'つ', romaji: 'tsu' },
    { char: 'て', romaji: 'te' },
    { char: 'と', romaji: 'to' },
    { char: 'な', romaji: 'na' },
    { char: 'に', romaji: 'ni' },
    { char: 'ぬ', romaji: 'nu' },
    { char: 'ね', romaji: 'ne' },
    { char: 'の', romaji: 'no' },
    { char: 'は', romaji: 'ha' },
    { char: 'ひ', romaji: 'hi' },
    { char: 'ふ', romaji: 'fu' },
    { char: 'へ', romaji: 'he' },
    { char: 'ほ', romaji: 'ho' },
    { char: 'ま', romaji: 'ma' },
    { char: 'み', romaji: 'mi' },
    { char: 'む', romaji: 'mu' },
    { char: 'め', romaji: 'me' },
    { char: 'も', romaji: 'mo' },
    { char: 'や', romaji: 'ya' },
    { char: 'ゆ', romaji: 'yu' },
    { char: 'よ', romaji: 'yo' },
    { char: 'ら', romaji: 'ra' },
    { char: 'り', romaji: 'ri' },
    { char: 'る', romaji: 'ru' },
    { char: 'れ', romaji: 're' },
    { char: 'ろ', romaji: 'ro' },
    { char: 'わ', romaji: 'wa' },
    { char: 'を', romaji: 'wo' },
    { char: 'ん', romaji: 'n' }
];

// 游戏状态
let currentKana = null;
let score = 0;
let answered = false; // 是否已经回答当前题目

// DOM 元素
const kanaEl = document.getElementById('kana');
const optionsEl = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const nextBtn = document.getElementById('nextBtn');
const speakerBtn = document.getElementById('speaker');

// 初始化游戏
function initGame() {
    score = 0;
    updateScore();
    nextQuestion();
}

// 随机获取一个不重复的假名（避免连续相同）
function getRandomKana() {
    const filtered = kanaList.filter(k => k !== currentKana);
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
}

// 生成四个选项（一个正确，三个错误且不重复）
function generateOptions(correctRomaji) {
    const options = [correctRomaji];
    const allRomaji = kanaList.map(k => k.romaji);
    
    // 洗牌所有罗马音
    const shuffled = [...allRomaji].sort(() => Math.random() - 0.5);
    
    for (let romaji of shuffled) {
        if (options.length >= 4) break;
        if (!options.includes(romaji)) {
            options.push(romaji);
        }
    }
    
    // 再次洗牌选项顺序
    return options.sort(() => Math.random() - 0.5);
}

// 显示新题目
function nextQuestion() {
    answered = false;
    feedbackEl.textContent = '';
    nextBtn.disabled = true;
    
    // 清除按钮颜色
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });

    currentKana = getRandomKana();
    kanaEl.textContent = currentKana.char;

    const options = generateOptions(currentKana.romaji);
    optionsEl.innerHTML = '';
    
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => handleAnswer(btn, option));
        optionsEl.appendChild(btn);
    });
}

// 处理用户选择
function handleAnswer(btn, selected) {
    if (answered) return; // 已经回答过，防止重复点击
    answered = true;
    nextBtn.disabled = false;

    // 禁用所有按钮
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = selected === currentKana.romaji;
    
    if (isCorrect) {
        btn.classList.add('correct');
        feedbackEl.textContent = '✅ 正确！';
        feedbackEl.style.color = 'green';
        score++;
        updateScore();
    } else {
        btn.classList.add('wrong');
        // 高亮正确答案
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.textContent === currentKana.romaji) {
                b.classList.add('correct');
            }
        });
        feedbackEl.textContent = '❌ 错误，正确答案是：' + currentKana.romaji;
        feedbackEl.style.color = 'red';
    }
}

// 更新分数显示
function updateScore() {
    scoreEl.textContent = score;
}

// 播放发音（使用 Web Speech API）
function speak() {
    if (!('speechSynthesis' in window)) {
        alert('你的浏览器不支持语音合成，请使用最新版 Chrome 或 Edge。');
        return;
    }
    
    const utterance = new SpeechSynthesisUtterance(currentKana.char);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.8; // 语速稍慢
    window.speechSynthesis.cancel(); // 取消之前的语音
    window.speechSynthesis.speak(utterance);
}

// 事件监听
nextBtn.addEventListener('click', nextQuestion);
speakerBtn.addEventListener('click', speak);

// 开始游戏
initGame();
