import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState } from 'react';
import clsx from 'clsx';
import { SparklesIcon } from '@heroicons/react/24/solid';

const Card3D = ({
    title,
    subtitle,
    rarity = 'common',
    icon,
    scheme,
    quadrant,
    onClick
}) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXPos = e.clientX - rect.left;
        const mouseYPos = e.clientY - rect.top;

        const xPct = mouseXPos / width - 0.5;
        const yPct = mouseYPos / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const getRarityColor = (r) => {
        switch (r) {
            case 'rare': return 'border-blue-500 shadow-blue-500/20';
            case 'epic': return 'border-purple-500 shadow-purple-500/20';
            case 'legendary': return 'border-yellow-400 shadow-yellow-400/30';
            default: return 'border-slate-600 shadow-slate-900/10';
        }
    };

    return (
        <div className="game-perspective w-full h-[320px] cursor-pointer" onClick={() => { setIsFlipped(!isFlipped); onClick && onClick(); }}>
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    rotateZ: isFlipped ? 180 : 0,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={clsx(
                    "relative w-full h-full rounded-xl preserve-3d transition-shadow duration-300",
                    "border-4 bg-slate-800",
                    getRarityColor(rarity)
                )}
            >
                {/* FRONT FACE */}
                <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-lg p-6 flex flex-col items-center justify-between overflow-hidden">
                    {/* Glare Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="text-center z-10">
                        {rarity === 'legendary' && <SparklesIcon className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-pulse" />}
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 font-serif">
                            {title}
                        </h3>
                        <p className={clsx("text-sm mt-1", scheme?.text || "text-slate-400")}>{subtitle}</p>
                    </div>

                    <div className={clsx(
                        "w-full h-32 rounded-md flex items-center justify-center border inner-shadow transition-colors",
                        scheme?.bg ? scheme.bg + "/50" : "bg-slate-800",
                        scheme?.border ? scheme.border + "/30" : "border-slate-700/50"
                    )}>
                        {icon && icon.startsWith('http') ? (
                            <img 
                                src={icon} 
                                alt={title || 'Journal icon'} 
                                className="w-20 h-20 object-contain drop-shadow-xl"
                            />
                        ) : (
                            <span className="text-6xl drop-shadow-xl filter">{icon || "⚔️"}</span>
                        )}
                    </div>

                    <div className="w-full">
                        <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                            <div className={clsx("h-full w-2/3", scheme?.text?.replace('text-', 'bg-') || "bg-yellow-500")} />
                        </div>
                        <p className={clsx("text-xs text-right mt-1", scheme?.text || "text-yellow-500")}>Lcvl 3</p>
                    </div>
                </div>

                {/* BACK FACE */}
                <div
                    className="absolute inset-0 backface-hidden bg-slate-800 rounded-lg p-6 rotate-y-180 flex flex-col"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    <h4 className="text-lg font-bold text-white mb-4">Quest Log</h4>
                    <ul className="text-slate-300 text-sm space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Read 5 pages
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                            Update Journal
                        </li>
                    </ul>
                </div>

            </motion.div>
        </div>
    );
};

export default Card3D;
