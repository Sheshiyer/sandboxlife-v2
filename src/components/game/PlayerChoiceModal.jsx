import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useGameMode } from '../../context/GameModeContext';
import PropTypes from 'prop-types';

const CHOICE_CARDS = [
    { id: 'daily_journal', title: 'Daily Quest', icon: '📜', desc: 'Record your daily reflections and experiences.', color: 'from-blue-600 to-blue-900', border: 'border-blue-400', route: '/dailyjournal' },
    { id: 'book_journal', title: 'Campaign Tome', icon: '📖', desc: 'Continue your book journey chronicle.', color: 'from-purple-600 to-purple-900', border: 'border-purple-400', route: '/bookjourney' },
    { id: 'thought_of_the_day', title: 'Oracle\'s Wisdom', icon: '✨', desc: 'Capture today\'s guiding thought.', color: 'from-yellow-600 to-yellow-900', border: 'border-yellow-400', route: '/thoughtoftheday' },
];

const PlayerChoiceModal = ({ isOpen, onClose, onSelect }) => {
    const navigate = useNavigate();
    const { enableGameMode } = useGameMode();

    if (!isOpen) return null;

    const handleCardClick = (card) => {
        enableGameMode(); // Enable game mode before navigation
        
        if (card.route) {
            navigate(card.route);
        }
        
        onSelect(card);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-5xl p-8 flex flex-col items-center">

                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-serif text-white mb-12 tracking-widest text-center"
                >
                    <span className="text-yellow-500">Choose</span> Your Path
                </motion.h2>

                <div className="flex gap-8 perspective-container text-white">
                    {CHOICE_CARDS.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 50, rotateY: 90 }}
                            animate={{ opacity: 1, y: 0, rotateY: 0 }}
                            transition={{ delay: idx * 0.1, type: "spring" }}
                            whileHover={{ y: -20, scale: 1.05, transition: { duration: 0.2 } }}
                            onClick={() => handleCardClick(card)}
                            className={clsx(
                                "w-64 h-96 rounded-xl border-4 cursor-pointer relative overflow-hidden group bg-gradient-to-br shadow-2xl",
                                card.color,
                                card.border
                            )}
                        >
                            {/* Back Pattern (Hidden on Reveal) - For now just front face */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">
                                    {card.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-serif mb-2 uppercase tracking-wider">{card.title}</h3>
                                <p className="text-white/80 font-sans text-sm leading-relaxed">{card.desc}</p>

                                <div className="absolute bottom-6 w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                    ➜
                                </div>
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none" />
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-16 text-slate-500 hover:text-white uppercase tracking-widest text-sm"
                >
                    Cancel Navigation
                </button>

            </div>
        </div>
    );
};

PlayerChoiceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default PlayerChoiceModal;
