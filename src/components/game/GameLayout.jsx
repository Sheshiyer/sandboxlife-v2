import '../../styles/game-theme.css';
import { motion } from 'framer-motion';
import { Bars3Icon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const GameLayout = ({ children, mana = 0, toggleMenu, userId }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'QUESTS', path: `/quests/${userId}`, icon: '⚔️', disabled: false },
        { label: 'INVENTORY', path: `/inventory/${userId}`, icon: '🎒', disabled: false },
        { label: 'MAP', path: `/map/${userId}`, icon: '🗺️', disabled: true },
    ];

    const isActive = (path) => location.pathname === path;

    const handleClassicView = () => {
        if (userId) {
            navigate(`/home/${userId}`);
        }
    };

    const handleNavClick = (item) => {
        if (!item.disabled && userId) {
            navigate(item.path);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-vignette pointer-events-none z-10" />

            {/* Header / HUD */}
            <header className="relative z-20 px-8 py-6 flex justify-between items-center border-b border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    {/* Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center justify-center transition-colors"
                        aria-label="Menu"
                    >
                        <Bars3Icon className="w-6 h-6 text-white" />
                    </button>

                    <div className="w-12 h-12 bg-yellow-500 rounded-full border-2 border-white/20 shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center justify-center font-bold text-black text-lg">
                        {mana}
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif text-white tracking-widest uppercase">Chronicles</h1>
                        <p className="text-xs text-yellow-500 uppercase tracking-widest">Sandbox Life Beta</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Classic View Button */}
                    <button
                        onClick={handleClassicView}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg border border-white/20 transition-all font-semibold text-sm shadow-lg"
                    >
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                        <span>Classic View</span>
                    </button>

                    <div className="flex gap-4 text-sm font-semibold tracking-wider">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => handleNavClick(item)}
                                disabled={item.disabled}
                                className={clsx(
                                    "flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all",
                                    isActive(item.path)
                                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                        : item.disabled
                                        ? "text-slate-600 cursor-not-allowed"
                                        : "text-slate-400 hover:text-white hover:bg-white/10"
                                )}
                                title={item.disabled ? "Coming Soon" : item.label}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                                {item.disabled && <span className="text-[0.6rem] text-slate-500 ml-1">(Soon)</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Tabletop Area */}
            <main className="relative z-20 container mx-auto p-8 perspective-container">
                {children}
            </main>

            {/* Floating Particles (Decor) */}
            <motion.div
                animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-10 left-10 w-2 h-2 bg-yellow-500 rounded-full blur-[2px] z-10"
            />
        </div>
    );
};

GameLayout.propTypes = {
    children: PropTypes.node.isRequired,
    mana: PropTypes.number,
    toggleMenu: PropTypes.func.isRequired,
    userId: PropTypes.string,
};

export default GameLayout;
