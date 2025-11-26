import React, { useEffect, useRef, useState } from 'react';
import './home.css';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [musicStarted, setMusicStarted] = useState(false);
    const [showAudioBtn, setShowAudioBtn] = useState(true);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const backgroundMusicRef = useRef<HTMLAudioElement>(null);
    const loveMusicRef = useRef<HTMLAudioElement>(null);

    // Audio Links
    const backgroundMusicSrc = "/background.mp3";
    const loveMusicSrc = "/love.mp3";

    // Memories (25 IMÁGENES + 7 VIDEOS) 💖✨
    const memories = [
        { type: 'image', src: '/img-1.jpg' },
        { type: 'image', src: '/img-2.jpg' },
        { type: 'image', src: '/img-3.jpg' },
        { type: 'video', src: '/video-1.mp4' },
        { type: 'image', src: '/img-4.jpg' },
        { type: 'image', src: '/img-5.jpg' },
        { type: 'image', src: '/img-6.jpg' },
        { type: 'image', src: '/img-7.jpg' },
        { type: 'video', src: '/video-2.mp4' },
        { type: 'image', src: '/img-8.jpg' },
        { type: 'image', src: '/img-9.jpg' },
        { type: 'image', src: '/img-10.jpg' },
        { type: 'image', src: '/img-11.jpg' },
        { type: 'video', src: '/video-3.mp4' },
        { type: 'image', src: '/img-12.jpg' },
        { type: 'image', src: '/img-13.jpg' },
        { type: 'image', src: '/img-14.jpg' },
        { type: 'image', src: '/img-15.jpg' },
        { type: 'video', src: '/video-4.mp4' },
        { type: 'image', src: '/img-16.jpg' },
        { type: 'image', src: '/img-17.jpg' },
        { type: 'image', src: '/img-18.jpg' },
        { type: 'image', src: '/img-19.jpg' },
        { type: 'video', src: '/video-5.mp4' },
        { type: 'image', src: '/img-20.jpg' },
        { type: 'image', src: '/img-21.jpg' },
        { type: 'image', src: '/img-22.jpg' },
        { type: 'image', src: '/img-23.jpg' },
        { type: 'video', src: '/video-7.mp4' },
        { type: 'image', src: '/img-24.jpg' },
        { type: 'image', src: '/img-25.jpg' },
        { type: 'video', src: '/video-8.mp4' },
    ];

    // Canvas Animation & Mouse Effects
    useEffect(() => {
        const canvas = canvasRef.current;
        const cursorFollow = cursorRef.current;
        if (!canvas || !cursorFollow) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = 0, height = 0;
        let mouse = { x: 0, y: 0 };
        let animationFrameId: number;

        function resize() {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resize);
        resize();

        // Classes defined before usage
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            life: number;
            brightness: number;

            constructor() {
                this.x = 0;
                this.y = 0;
                this.vx = 0;
                this.vy = 0;
                this.size = 0;
                this.color = '';
                this.life = 0;
                this.brightness = 0;
                this.reset();
                this.life = Math.random() * 100;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1;
                this.color = `hsl(${Math.random() * 60 + 300}, 100%, ${Math.random() * 30 + 60}%)`;
            }

            update() {
                this.life++;
                
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.vx += (dx / dist) * force * 0.2;
                    this.vy += (dy / dist) * force * 0.2;
                }

                this.x += this.vx;
                this.y += this.vy;

                this.vx *= 0.99;
                this.vy *= 0.99;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }

                const pulse = Math.sin(this.life * 0.05) * 0.5 + 0.5;
                this.brightness = pulse;
            }

            draw(ctx: CanvasRenderingContext2D) {
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');

                ctx.globalAlpha = this.brightness;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        class Constellation {
            points: {x: number, y: number}[];
            alpha: number;
            rotation: number;

            constructor() {
                this.points = [];
                const centerX = Math.random() * width;
                const centerY = Math.random() * height;
                
                for (let t = 0; t < Math.PI * 2; t += 0.5) {
                    const x = 16 * Math.pow(Math.sin(t), 3);
                    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    this.points.push({
                        x: centerX + x * 2,
                        y: centerY + y * 2
                    });
                }
                
                this.alpha = Math.random() * 0.5 + 0.3;
                this.rotation = 0;
            }

            update() {
                this.rotation += 0.005;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.save();
                ctx.globalAlpha = this.alpha * (Math.sin(Date.now() * 0.001) * 0.3 + 0.7);
                ctx.strokeStyle = '#ff69b4';
                ctx.lineWidth = 2;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ff69b4';

                ctx.beginPath();
                this.points.forEach((point, i) => {
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                ctx.closePath();
                ctx.stroke();

                this.points.forEach(point => {
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.restore();
            }
        }

        let particles: Particle[] = [];
        let constellations: Constellation[] = [];

        // Mouse Movement
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            if (cursorFollow) {
                cursorFollow.style.left = e.clientX + 'px';
                cursorFollow.style.top = e.clientY + 'px';
            }

            if (Math.random() > 0.7) {
                const trail = document.createElement('div');
                trail.className = 'cursor-trail';
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                document.body.appendChild(trail);

                setTimeout(() => {
                    trail.style.opacity = '0';
                    trail.style.transform = 'translate(-50%, -50%) scale(2)';
                    trail.style.transition = 'all 1s ease-out';
                }, 10);

                setTimeout(() => trail.remove(), 1100);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Initialize objects
        for (let i = 0; i < 400; i++) {
            particles.push(new Particle());
        }

        for (let i = 0; i < 5; i++) {
            constellations.push(new Constellation());
        }

        function animate() {
            if (!ctx || !canvas) return;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            constellations.forEach(c => {
                c.update();
                c.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
        };
    }, []);

    // Auto-play attempt
    useEffect(() => {
        const attemptPlay = async () => {
            if (backgroundMusicRef.current) {
                try {
                    await backgroundMusicRef.current.play();
                    setMusicStarted(true);
                    setShowAudioBtn(false);
                } catch (e) {
                    // Autoplay prevented
                    setShowAudioBtn(true);
                }
            }
        };
        
        attemptPlay();
    }, []);

    const handleStartAudio = () => {
        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.play();
            setMusicStarted(true);
            setShowAudioBtn(false);
        }
    };

    const createMagicExplosion = () => {
        const colors = ['💖', '💕', '💗', '💓', '💘', '❤️', '🧡', '💛', '💚', '💙', '💜', '✨', '⭐', '🌟', '💫', '⚡', '🏩', '🏩', '🏩', '🏩', '💘', '💝', '🎀', '🌹'];
        
        // Create 300 emojis for massive, spectacular effect
        for (let i = 0; i < 300; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'emoji-explosion';
                emoji.textContent = colors[Math.floor(Math.random() * colors.length)];
                
                // Random starting position across entire screen
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * window.innerHeight;
                emoji.style.left = startX + 'px';
                emoji.style.top = startY + 'px';
                
                // Larger emojis for visibility (40-80px)
                const size = Math.random() * 40 + 40;
                emoji.style.fontSize = size + 'px';
                
                // Falling animation paths
                const midX = (Math.random() - 0.5) * 300;
                const midY = (Math.random() - 0.5) * 300;
                const midRot = Math.random() * 720;
                const endX = (Math.random() - 0.5) * 600;
                const endY = 300 + Math.random() * 400; // Falls down
                const endRot = Math.random() * 1440;

                (emoji as any).style.setProperty('--mid-transform', `translate(${midX}px, ${midY}px) scale(1.8) rotate(${midRot}deg)`);
                (emoji as any).style.setProperty('--end-transform', `translate(${endX}px, ${endY}px) scale(0) rotate(${endRot}deg)`);

                document.body.appendChild(emoji);

                // Keep emojis visible for 3 seconds
                setTimeout(() => emoji.remove(), 3000);
            }, i * 15);
        }
    };

    const handleMagicClick = () => {
        setShowModal(true);
        createMagicExplosion();
        
        if (backgroundMusicRef.current && loveMusicRef.current) {
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current.currentTime = 0;
            loveMusicRef.current.play().catch(console.error);
        }
    };

    const handleBackClick = () => {
        setShowModal(false);
        
        if (backgroundMusicRef.current && loveMusicRef.current) {
            loveMusicRef.current.pause();
            loveMusicRef.current.currentTime = 0;
            if (musicStarted) {
                backgroundMusicRef.current.play().catch(console.error);
            }
        }
    };

    return (
        <div className="home-container">
            <canvas ref={canvasRef} className="home-canvas" />
            <div ref={cursorRef} className="cursor-follow" />
            
            <audio ref={backgroundMusicRef} loop>
                <source src={backgroundMusicSrc} type="audio/mpeg" />
            </audio>
            
            <audio ref={loveMusicRef} loop>
                <source src={loveMusicSrc} type="audio/mpeg" />
            </audio>
            
            {showAudioBtn && (
                <button className="start-audio-btn" onClick={handleStartAudio}>
                    🎵 Activar Música
                </button>
            )}

            <div className="overlay">
                <div className="title-section">
                    <h1 className="romantic-title">
                        Para la niña mas hermosa del mundo mundial <span className="emoji-heart">🏩</span>
                    </h1>
                    <p className="instruction">✨ Mi Clic, mi Chuchurrumina, mis Ojitos Bonitos ✨</p>
                </div>

                <div className="button-container">
                    <button className="magic-button" onClick={handleMagicClick}>
                        <span>💖 DESCUBRE MI AMOR 💖</span>
                    </button>
                </div>
            </div>

            <div className={`love-modal ${showModal ? 'active' : ''}`}>
                <div className="memory-container">
                    <h2 style={{position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: '#ff69b4', fontSize: '2.5em', textShadow: '0 0 20px rgba(255, 105, 180, 0.8)', margin: 0, zIndex: 1000}}>✨ Momentos felices de nuestra vida ✨</h2>
                    {showModal && memories.map((memory, index) => {
                        // 💖 ESPIRAL EXPANDIDA PARA USAR TODO EL ESPACIO 💖
                        const total = memories.length;
                        
                        // Espiral logarítmica más grande
                        const angle = (index / total) * Math.PI * 3.5; // 1.75 vueltas
                        const radius = 80 + (index / total) * 250; // Expandido más
                        
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        
                        // Tamaño más grande para usar el espacio
                        const size = 70 + (index % 5) * 6;
                        const delay = (index % 12) * 0.12;
                        
                        const style = {
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: 0.72,
                            transform: `translate(-50%, -50%) rotate(${(index * 7.2) % 360}deg)`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${7 + Math.random() * 2}s`
                        } as React.CSSProperties;

                        return memory.type === 'video' ? (
                            <video 
                                key={index}
                                src={memory.src}
                                className="floating-memory"
                                style={style}
                                autoPlay
                                loop
                                muted
                                playsInline
                                onError={(e) => {
                                    (e.target as HTMLVideoElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <img 
                                key={index}
                                src={memory.src}
                                className="floating-memory"
                                style={style}
                                alt=""
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        );
                    })}
                </div>

                <div className="message-box">
                    <h1>💕 Para Ti, Mi Amor Erika 🏩 💕</h1>
                    
                    <img 
                        src="/erika-photo.jpg" 
                        alt="Para ti mi amor" 
                        style={{
                            maxWidth: '80%', 
                            maxHeight: '400px',
                            borderRadius: '20px', 
                            boxShadow: '0 0 30px rgba(255, 105, 180, 0.5)',
                            margin: '30px auto',
                            display: 'block',
                            border: '3px solid rgba(255, 255, 255, 0.5)',
                            objectFit: 'cover'
                        }} 
                    />

                    <p style={{fontSize: '1.4em', lineHeight: '1.8', fontStyle: 'italic', color: '#ffdaf0', margin: '40px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                        "Solo puedo decir que eres una de las casualidades más maravillosas y hermosas que me pudo haber pasado. No sé, pero yo creo que el destino y Dios quisieron que te conozca, porque ¿qué probabilidad había de que nuestros caminos se cruzaran? Hay muchas personas y millones en el mundo, pero tú y yo coincidimos. Te amo demasiado, en serio te lo digo. Nosotros podemos, si somos fuertes, no lo olvides. Tú eres mi clic."
                    </p>
                    
                    <p style={{fontSize: '1.4em', lineHeight: '1.8', fontStyle: 'italic', color: '#ffdaf0', margin: '40px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                        "Conocerte me cambió la vida. Hemos pasado tantas cosas, nos hemos dejado de hablar por mucho tiempo, y solo te puedo decir que mi corazón nunca dejará de sentir cosas por ti. De nada me servía estar lejos de ti si nunca te pude sacar de mi cabeza ni de mi corazón. Tienes mi corazón, eres mi mundo, mi paz."
                    </p>

                    <p>Mi Clic hermosa, entre miles de millones de almas en este vasto universo...</p>
                    <p><span className="special">La mía eligió amarte a ti, mi Chuchurrumina.</span></p>
                    <p>Tus ojitos bonitos son mi constelación favorita, la luz que ilumina cada uno de mis días, la razón por la que sonrío sin darme cuenta.</p>
                    <p>Mi Erika Marquez, contigo descubrí que <span className="special">el amor verdadero</span> no es solo un sentimiento... es despertarme pensando en ti, es extrañarte a cada segundo, es soñar contigo cada noche.</p>
                    <p className="glowing-title" style={{fontSize: '2.8em', margin: '60px 0'}}>TE AMO MI CLIC, CON TODO MI CORAZÓN 🏩✨</p>
                    <p>Eres mi Chuchurrumina perfecta, mi presente, mi futuro, mi todo. Cada vez que veo tus ojitos bonitos, me enamoro de ti otra vez.</p>
                    <p style={{fontSize: '1.8em', fontStyle: 'italic', marginTop: '50px', color: '#ffb3d9'}}>
                        Gracias por ser tú, mi Erika Marquez, por existir y llenar mi vida de amor... 💖✨🏩
                    </p>

                    <p style={{fontSize: '1.4em', lineHeight: '1.8', fontStyle: 'italic', color: '#ffdaf0', margin: '50px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                        "Mi corazón eligió amarte. El pensarte y extrañarte cuando no estés es algo que me pasará toda la vida, porque hay algo en este mundo que es tú. Yo quiero que estés ahí porque eres mi vida y mi amor."
                    </p>

                    <p style={{fontSize: '1.4em', lineHeight: '1.8', fontStyle: 'italic', color: '#ffdaf0', margin: '40px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                        "Escribir poemas puede ser tan fácil si tú eres mi inspiración, y de esta forma demostrarte mi amor. Que a pesar de la distancia, mi corazón te ama. Qué ojitos maravillosos que tienes, iluminas todo incluyendo mi mente. Eres mi hermoso clic que hace que mi corazón palpite muy rápido."
                    </p>

                    <p style={{fontSize: '1.4em', lineHeight: '1.8', fontStyle: 'italic', color: '#ffdaf0', margin: '40px 20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                        "Si un día nos alejamos, mi corazón pediría a gritos un 'te extraño'. Esperaría y moriría por que llames una noche para arreglar lo nuestro. Porque en serio, Erika, esto es tan especial de lo que te puedes imaginar. Solo pienso en ti y si tú no estás aquí, mi vida sería una tortura."
                    </p>

                    <p style={{fontSize: '2.2em', fontWeight: 'bold', margin: '50px 0', color: '#ff69b4', textShadow: '0 0 20px rgba(255, 105, 180, 1)'}}>
                        ERIKA MARQUEZ, TE AMO DE AQUÍ HASTA LA LUNA 🌙💖 MUAKKKKK
                    </p>
                    
                    <div style={{marginTop: '60px', position: 'relative', zIndex: 2}}>
                        <a 
                            href="https://youtube.com/shorts/ZFG1i8jFxu8" 
                            target="_blank" 
                            style={{
                                display: 'inline-block',
                                padding: '25px 50px',
                                fontSize: '1.8em',
                                background: 'linear-gradient(135deg, rgba(255, 110, 196, 0.4), rgba(138, 43, 226, 0.4))',
                                backdropFilter: 'blur(20px)',
                                border: '4px solid rgba(255, 255, 255, 0.6)',
                                borderRadius: '40px',
                                color: '#fff',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                boxShadow: '0 0 40px rgba(255, 110, 196, 0.8)',
                                transition: 'all 0.4s'
                            }}
                        >
                            🎥 VER VIDEO ESPECIAL 💖
                        </a>
                    </div>
                    
                    <button className="back-button" onClick={handleBackClick}>
                        Volver a Nuestro Universo ❤️
                    </button>
                </div>
            </div>
        </div>
    );
}