const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "LONG_ZINGMP3";

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const music = $('.music');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const endTime = $('#end-time');

const app = {
    currentIndex: 0,
    arr: [0],
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Perfect two',
            singer: 'Auburn',
            path: './assets/music/PerfectTwoSpeedUp-Auburn-4428573.mp3',
            image: './assets/img/music-img/perfectTwo.jpg'
        },
        {
            name: 'Phải có em',
            singer: 'Kai Đinh',
            path: './assets/music/PhaiCoEm-KaiDinh-4749623.mp3',
            image: './assets/img/music-img/phaiCoEm.jpg'
        },
        {
            name: 'Aloha',
            singer: 'Cool',
            path: './assets/music/Aloha-Cool_ck5v.mp3',
            image: './assets/img/music-img/Aloha.jpg'
        },
        {
            name: 'Chiều nay không có mưa bay',
            singer: 'Trung Quân idol',
            path: './assets/music/ChieuNayKhongCoMuaBay-TrungQuanIdol-3314229.mp3',
            image: './assets/img/music-img/chieu_nay_khong_co_mua_bay.jpg'
        },
        {
            name: 'Nắm lấy tay anh',
            singer: 'Tuấn Hưng',
            path: './assets/music/NamLayTayAnh-TuanHung-3110396.mp3',
            image: './assets/img/music-img/namLayTayAnh.jpg'
        },
        {
            name: 'Perfect two',
            singer: 'Auburn',
            path: './assets/music/PerfectTwoSpeedUp-Auburn-4428573.mp3',
            image: './assets/img/music-img/perfectTwo.jpg'
        },
        {
            name: 'Phải có em',
            singer: 'Kai Đinh',
            path: './assets/music/PhaiCoEm-KaiDinh-4749623.mp3',
            image: './assets/img/music-img/phaiCoEm.jpg'
        },
        {
            name: 'Aloha',
            singer: 'Cool',
            path: './assets/music/Aloha-Cool_ck5v.mp3',
            image: './assets/img/music-img/Aloha.jpg'
        },
        {
            name: 'Chiều nay không có mưa bay',
            singer: 'Trung Quân idol',
            path: './assets/music/ChieuNayKhongCoMuaBay-TrungQuanIdol-3314229.mp3',
            image: './assets/img/music-img/chieu_nay_khong_co_mua_bay.jpg'
        },
        {
            name: 'Nắm lấy tay anh',
            singer: 'Tuấn Hưng',
            path: './assets/music/NamLayTayAnh-TuanHung-3110396.mp3',
            image: './assets/img/music-img/namLayTayAnh.jpg'
        }
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class = "song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class = "thumb"
                        style = "background-image: url('${song.image}');">
                    </div>
                    <div class = "body">
                        <h3 class = "title">${song.name}</h3>
                        <p class = "author">${song.singer}</p>
                    </div>
                    <div class = "option">
                        <i class="ti-more-alt"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
        endTime.textContent = Number(audio.duration);
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {  
                audio.pause();
            } else {
                audio.play();
            }
            
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true;
            music.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            music.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý khi kết thúc song
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Xử lý khi click playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                //Xử lý khi click vào option
            }
        }

        // Xử lý random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Xử lý repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Tua song
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        if (this.arr.length === Math.floor((this.songs.length) / 2)) {
            while (this.arr.length > 0) {
                this.arr.pop();
            }
        }
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.arr.includes(newIndex) === true || newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.arr.push(newIndex);
        this.loadCurrentSong();
        console.log(this.arr);
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    start: function() {
        // Load cấu hình
        this.loadConfig();

        // Định nghĩa thuộc tính cho object
        this.defineProperties();

        //Render playlist
        this.render();

        // Xử lý sự kiện
        this.handleEvents();

        //Load bài hát đầu tiên
        this.loadCurrentSong();

        // Hiển thị trạng thái đầu của button
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
}

app.start();