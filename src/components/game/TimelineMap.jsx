import { motion } from 'framer-motion';
import clsx from 'clsx';
import { getSigilData } from '../../utils/sigilSystem';
import PropTypes from 'prop-types';
import { resolveIcon } from '../../utils/iconResolver';

const TimelineMap = ({ entries = [], onEntryClick }) => {
    return (
        <div className="relative w-full h-full overflow-y-auto no-scrollbar p-12 perspective-container">

            {/* Background Map Texture */}
            <div className="absolute inset-0 bg-[#f4e4bc] opacity-10 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000000 0, #000000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
            />

            <div className="max-w-3xl mx-auto relative min-h-[1000px]">
                {/* The Path Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-[#5D4037]/30 transform -translate-x-1/2" />

                {entries.map((entry, index) => {
                    const isLeft = index % 2 === 0;
                    const sigil = getSigilData(entry.journal_meaning, entry.journal_type);
                    const resolvedIcon = resolveIcon(entry);
                    const hasImageIcon = resolvedIcon && (typeof resolvedIcon === 'string' && (resolvedIcon.startsWith('http') || resolvedIcon.startsWith('/src') || resolvedIcon.startsWith('/assets')));

                    return (
                        <motion.div
                            key={entry.id || index}
                            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={clsx(
                                "relative flex items-center mb-24",
                                isLeft ? "justify-end pr-12 text-right" : "justify-start pl-12 flex-row-reverse text-left"
                            )}
                        >
                            {/* The Node (Center Point) - Shows icon thumbnail */}
                            <div className="absolute left-1/2 top-1/2 w-12 h-12 rounded-full border-4 border-[#0a0a0a] bg-slate-800 transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-[0_0_15px_rgba(255,215,0,0.6)] overflow-hidden flex items-center justify-center">
                                {hasImageIcon ? (
                                    <img src={resolvedIcon} alt="" className="w-8 h-8 object-contain" />
                                ) : (
                                    <span className="text-xl">{sigil.icon}</span>
                                )}
                            </div>

                            {/* Content Card */}
                            <div
                                onClick={() => onEntryClick && onEntryClick(entry)}
                                className={clsx(
                                    "w-72 p-4 rounded-lg border-2 bg-[#1a1a1a] cursor-pointer hover:scale-105 transition-transform group",
                                    sigil.scheme.border,
                                    isLeft ? "mr-10" : "ml-10"
                                )}
                            >
                                {/* Icon display area */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={clsx(
                                        "w-14 h-14 rounded-lg flex items-center justify-center border",
                                        sigil.scheme.bg,
                                        sigil.scheme.border
                                    )}>
                                        {hasImageIcon ? (
                                            <img 
                                                src={resolvedIcon} 
                                                alt={entry.journal_meaning || 'Journal icon'} 
                                                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                                            />
                                        ) : (
                                            <span className="text-2xl group-hover:scale-110 transition-transform">{sigil.icon}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={clsx("font-serif font-bold text-base leading-tight", sigil.scheme.text)}>
                                            {entry.journal_meaning || "Quest Log"}
                                        </h4>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                                            {entry.journal_type?.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Entry preview */}
                                {entry.journal_entry && (
                                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                                        {entry.journal_entry.substring(0, 80)}...
                                    </p>
                                )}
                                
                                <p className="text-xs text-slate-600 uppercase tracking-widest">
                                    {new Date(entry.created_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}

                {/* Start Point */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-4 text-center">
                    <span className="text-4xl">🏁</span>
                    <p className="text-xs text-white/50 uppercase">Start of Journey</p>
                </div>
                
                {/* Empty State */}
                {entries.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <span className="text-6xl mb-4">🗺️</span>
                        <h3 className="text-xl font-serif text-white mb-2">Your Journey Awaits</h3>
                        <p className="text-slate-400">Start journaling to see your path unfold</p>
                    </div>
                )}
            </div>
        </div>
    );
};

TimelineMap.propTypes = {
    entries: PropTypes.array,
    onEntryClick: PropTypes.func,
};

export default TimelineMap;
