import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/game-theme.css';
import PropTypes from 'prop-types';

const ScribeEditor = ({ isOpen, onClose, context, onSave }) => {
    const [content, setContent] = useState('');
    const [isSealing, setIsSealing] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        setIsSealing(true);
        setTimeout(() => {
            onSave(content);
            setIsSealing(false);
            setContent('');
            onClose();
        }, 1500); // Wait for seal animation
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-[4/3] bg-[#F5E6D3] rounded-lg shadow-2xl flex overflow-hidden perspective-container"
            >
                {/* Book Spine / Shadow */}
                <div className="absolute inset-y-0 left-1/2 w-12 -ml-6 bg-gradient-to-r from-transparent via-[#D4C5B0] to-transparent z-10 opacity-50 pointer-events-none" />

                {/* Left Page (Context/Prompt) */}
                <div className="flex-1 p-12 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] border-r border-[#D4C5B0] relative">
                    <h2 className="text-3xl font-serif text-[#3E2723] mb-6 capitalize border-b-2 border-[#3E2723] pb-2">
                        {context?.title || 'Chronicle'}
                    </h2>
                    <div className="text-xl font-serif text-[#5D4037] italic leading-relaxed">
                        &ldquo;{context?.desc || 'What adventure calls to you today?'}&rdquo;
                    </div>

                    <div className="absolute bottom-12 left-12 opacity-50">
                        <div className="text-6xl">{context?.icon}</div>
                    </div>
                </div>

                {/* Right Page (Editor) */}
                <div className="flex-1 p-12 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Begin your inscription..."
                        className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-xl font-body text-[#3E2723] leading-loose custom-lines"
                        style={{
                            backgroundImage: 'linear-gradient(transparent 95%, #D4C5B0 95%)',
                            backgroundSize: '100% 2rem',
                            lineHeight: '2rem'
                        }}
                    />

                    {/* Actions */}
                    <div className="absolute bottom-8 right-12 flex gap-4">
                        <button
                            onClick={onClose}
                            className="text-[#5D4037] hover:text-[#3E2723] font-serif uppercase tracking-widest text-sm"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-[#3E2723] text-[#F5E6D3] font-serif rounded-sm shadow-lg hover:bg-[#5D4037] transition-colors relative overflow-hidden group"
                        >
                            <span className="relative z-10">Seal Entry</span>
                            {/* Ink Splash Effect */}
                            <div className="absolute inset-0 bg-[#8B4513] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>
                    </div>

                    {/* Wax Seal Animation Layer */}
                    <AnimatePresence>
                        {isSealing && (
                            <motion.div
                                initial={{ scale: 2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center z-20 bg-[#F5E6D3]/50 backdrop-blur-sm"
                            >
                                <div className="w-32 h-32 rounded-full bg-red-800 border-4 border-red-900 shadow-xl flex items-center justify-center">
                                    <span className="text-5xl text-red-900 font-serif font-bold">S</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

            </motion.div>
        </div>
    );
};

ScribeEditor.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    context: PropTypes.shape({
        title: PropTypes.string,
        desc: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    }),
    onSave: PropTypes.func.isRequired,
};

export default ScribeEditor;
