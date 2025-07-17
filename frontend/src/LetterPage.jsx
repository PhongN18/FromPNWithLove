import { useEffect, useRef, useState } from 'react';
import { letters, passwords } from './data';

export default function LetterPage() {
    const [input, setInput] = useState('');
    const [name, setName] = useState(null);
    const [error, setError] = useState('');
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.05);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    // For intro modals
    const [showIntroModal, setShowIntroModal] = useState(true);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isVideoDone, setIsVideoDone] = useState(false);

    const letterImgStyle = {
    }

    const showLoadingThen = async (callback, delay = 800) => {
        setLoading(true);
        setTimeout(() => {
            callback();
            setLoading(false);
        }, delay);
    };

    const handleSubmit = () => {
        // Check if the code is valid
        const matchedName = passwords[input];

        if (matchedName) {
            setName(matchedName); // Set name first
            fetch('https://from-pn-with-love-ucie.vercel.app/api/send-code-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: matchedName, code: input })
            })
            .then(res => res.json())
            .then(data => console.log('✅ Email sent:', data))
            .catch(err => console.error('❌ Error sending email:', err));
            setError('');
            showLoadingThen(() => {
                // no need to re-set name here
            }, 1500);
        } else {
            setName(null); // Clear name
            setError('❌ Mã không đúng. Hãy thử lại nhé!');
        }
    };

    const [isModalOpen, setModalOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        const res = await fetch('https://from-pn-with-love-ucie.vercel.app/api/send-message-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, message }),
        });

        if (res.ok) {
            setSent(true);
            setMessage('');
            setTimeout(() => {
                setModalOpen(false);
                setSent(false);
            }, 2000);
        } else {
            alert("❌ Failed to send message");
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.addEventListener('ended', () => {
                setIsVideoDone(true);
            });
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
    const style = document.createElement('style');
        style.innerHTML = `
        @keyframes scrollBackground {
            from {
            background-position: 0 0;
            }
            to {
            background-position: -3000px 0;
            }
        }
        `;
        document.head.appendChild(style);
    }, []);

    return (
        <div className='relative min-h-screen w-full flex justify-center items-center'>
            {loading && (
                <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center">
                    {name ? (
                        <div className="text-white text-2xl font-bold animate-pulse">Xin chào {name} ạ!</div>
                    ) : (
                        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
                    )}
                </div>
            )}
            {/* Background Music */}
            <audio ref={audioRef} loop muted={muted}>
                <source src="/vanlaemtronganh-NgocThanh.mp3" type="audio/mpeg" />
            </audio>
            {!showIntroModal && (
                <div className={`p-2 absolute z-100 text-white top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent`} >
                    <div className='absolute'>
                        <span>Volume</span>
                        <button
                            onClick={() =>
                            setVolume((v) => Math.max(0, parseFloat((v - 0.1).toFixed(2))))
                            }
                            style={{ marginLeft: '0.5rem' }}
                        >
                            ➖
                        </button>
                        <button
                            onClick={() =>
                            setVolume((v) => Math.min(1, parseFloat((v + 0.1).toFixed(2))))
                            }
                            style={{ marginLeft: '0.5rem' }}
                        >
                            ➕
                        </button>
                        <button className='ml-2' onClick={() => setMuted((prev) => !prev)}>
                            {muted ? '🔇 Unmute' : '🔊 Mute'}
                        </button>
                    </div>
                    <p className='text-center font-semibold'>Now playing: Vẫn là em trong anh - Ngọc Thành</p>
                    <a className='absolute right-2 top-2 hover:font-semibold' href="https://www.youtube.com/watch?v=AM0x-IJsJYo" target='_blank'>Support on Youtube</a>
                </div>
            )}

            {/* Step 1: Music Warning Modal */}
            {showIntroModal && (
                <div className='bg-blue-400 min-h-screen w-full flex justify-center items-center'>
                    <div className='flex flex-col justify-center items-center text-white'>
                        <i className="text-blue-800 text-9xl fa-solid fa-headphones mb-10"></i>
                        <h2 className='text-2xl font-bold'>This website contains sound/music</h2>
                        <h3 className='text-xl font-bold mb-4'>Trang web có âm thanh/nhạc</h3>
                        <p className='font-semibold'>Please use headphones for the best experience</p>
                        <p className='font-semibold'>Hãy đeo tai nghe để có trải nghiệm tốt nhất</p>
                        <button className='bg-blue-800 px-4 py-2 mt-10 rounded-2xl font-semibold cursor-pointer hover:bg-blue-900 transition ease-in-out hover:scale-105' onClick={() => {
                            showLoadingThen(() => {
                                setShowIntroModal(false);
                                setShowVideoModal(true);
                                if (audioRef.current) {
                                    audioRef.current.volume = volume;
                                    audioRef.current.play().catch((err) => {
                                    console.warn("Audio play blocked:", err);
                                    });
                                }
                            })
                        }}>Got it / Hiểu gòi</button>
                    </div>
                </div>
            )}

            {/* Step 2: Video Modal */}
            {showVideoModal && !isVideoDone && (
                <div className='min-h-screen w-full flex justify-center bg-blue-400 pt-12'>
                    <div className='w-3/4 flex flex-col items-center justify-center'>
                        <video ref={videoRef} width="100%" autoPlay controls className='rounded-2xl'>
                            <source src="/intro-vid.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={() => showLoadingThen(() => {setIsVideoDone(true)})} className='text-white bg-blue-800 px-4 py-2 mt-4 rounded-2xl font-semibold cursor-pointer hover:bg-blue-900 transition ease-in-out hover:scale-105'>
                            Skip Video / Bỏ qua
                        </button>
                    </div>
                </div>
            )}

            {/* Main content only when modals done */}
            {!showIntroModal && isVideoDone && (
                <div className='w-full'>
                    <div className='w-full min-h-screen flex justify-center items-center'
                        style={{
                            backgroundImage: 'url("/bg.png")',
                            backgroundRepeat: 'repeat-x',
                            backgroundSize: 'auto 100%',
                            animation: 'scrollBackground 60s linear infinite',
                    }}>
                        <div className="absolute inset-0 bg-[#00000050] z-0"></div>
                        {!name ? (
                            <div className='bg-blue-400 z-10 w-1/3 p-8 rounded-4xl flex flex-col justify-center items-center text-white'>
                                <h2 className='text-2xl font-bold'>Input your code here</h2>
                                <h3 className='text-xl font-semibold'>Nhập mã vô đây nha</h3>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value.trim())}
                                    className='bg-white rounded-2xl p-4 outline-none my-4 text-blue-400 w-2/3 font-bold text-center'
                                />
                                <button
                                    onClick={handleSubmit}
                                    className='px-4 py-2 rounded-2xl bg-blue-600 font-bold cursor-pointer hover:bg-blue-900 hover:scale-105 transition ease-in-out'
                                >
                                    Xem thư
                                </button>
                                {error && <p className='mt-4 text-red-500'>{error}</p>}
                            </div>
                        ) : (
                            <div className="relative w-5/6 z-10">
                                <div className="absolute bg-red-500 rounded-2xl w-full h-full top-10 left-5 -z-50 -translate-y-10 -translate-x-4"></div>

                                {/* Orange background box */}
                                <div className="absolute bg-orange-400 rounded-2xl w-full h-3/4 top-10 left-5 -z-50 rotate-170 -translate-x-5 translate-y-5"></div>

                                {/* Rotated blue box */}
                                <div className="bg-blue-500 p-12 rounded-2xl transform rotate-3 relative">
                                    {/* Counter-rotate content to keep it straight */}
                                    <div className="transform -rotate-3 flex items-center gap-4">
                                        <div className='text-white font-semibold rounded-2xl p-4'>
                                            <p>{letters[name]}</p>
                                            <h3 className='text-right font-bold mt-4 text-lg'>From PN with love ❤️</h3>
                                        </div>
                                        <div className="relative h-100 w-100 flex-shrink-0 bg-white rounded-full">
                                            <img
                                                className={`h-full w-full object-contain z-100 ${letterImgStyle[name] || "scale-120 -translate-y-20"}`}
                                                src={`/${name}.png`}
                                                alt=""
                                            />
                                            <div style={{ backgroundImage: 'url("/brush.png")', fontFamily: '"Playwrite VN", cursive', fontWeight: 400 }} className='absolute w-full h-32 -bottom-10 bg-no-repeat bg-cover text-white flex justify-center items-center text-4xl pt-4'>
                                                To {name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-[50%] translate-x-[-50%] -bottom-20">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-900 font-semibold cursor-pointer hover:scale-105 transition ease-in-out text-white px-6 py-4 rounded-2xl"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        💌 Leave a message
                                    </button>
                                </div>

                                {/* Modal */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000088]">
                                        <div className="bg-white p-8 rounded-lg w-full max-w-xl shadow-lg">
                                            <h2 className="text-lg font-bold mb-4 text-blue-500">Gửi một lời nhắn dành cho Phong 💬</h2>
                                            <textarea
                                                rows="5"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                className="w-full border-2 border-blue-500 p-2 rounded mb-4 outline-none text-blue-500"
                                            />
                                            <div className="flex flex-col justify-center items-center space-y-4">
                                                <button
                                                    className="px-16 py-2 bg-blue-500 text-white rounded-xl cursor-pointer hover:bg-blue-900 hover:scale-105 transition ease-in-out"
                                                    onClick={handleSendMessage}
                                                >
                                                    Gửi nè
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-sm bg-gray-300 rounded-xl cursor-pointer hover:bg-gray-400 hover:scale-105 transition ease-in-out"
                                                    onClick={() => setModalOpen(false)}
                                                >
                                                    Thôi không gửi đâu
                                                </button>
                                            </div>
                                            {sent && <p className="text-green-600 mt-2">✅ Đã gửi lời nhắn!</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
