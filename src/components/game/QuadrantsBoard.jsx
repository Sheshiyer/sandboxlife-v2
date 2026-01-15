import { Children, isValidElement } from 'react';
import clsx from 'clsx';

const ZONE_CONFIG = {
    mind: { label: 'Mind', color: 'bg-blue-900/40', border: 'border-blue-500/30', icon: '🧠' }, // Blue
    spirit: { label: 'Spirit', color: 'bg-purple-900/40', border: 'border-purple-500/30', icon: '✨' }, // Purple
    body: { label: 'Body', color: 'bg-red-900/40', border: 'border-red-500/30', icon: '💪' }, // Red
    heart: { label: 'Heart', color: 'bg-green-900/40', border: 'border-green-500/30', icon: '❤️' }, // Green
};

const QuadrantZone = ({ id, config, children, decayLevel = 0 }) => (
    <div className={clsx(
        "relative h-full rounded-2xl border-2 flex flex-col p-4 transition-all duration-500 overflow-hidden",
        config.color,
        config.border,
        "hover:bg-opacity-60 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)_inset]"
    )}>
        {/* Zone Label Watermark */}
        <div className="absolute top-4 left-4 text-4xl opacity-20 select-none pointer-events-none filter blur-sm">
            {config.icon}
        </div>
        <div className="absolute bottom-4 right-4 text-xs font-serif uppercase tracking-[0.2em] opacity-40">
            {config.label} Domain
        </div>

        {/* Decay Overlay (Cobwebs/Cracks) */}
        {decayLevel > 0.5 && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply"
                style={{
                    backgroundImage: `url('https://www.transparenttextures.com/patterns/cracked-ground.png')`,
                    filter: 'grayscale(100%) contrast(200%)'
                }}
            />
        )}
        {decayLevel > 0.8 && (
            <div className="absolute top-0 right-0 p-2 text-xs text-red-500 font-bold bg-black/80 rounded-bl-lg border border-red-500/50">
                ⚠️ NEGLECTED
            </div>
        )}

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 xl:grid-cols-2 gap-4 place-content-start">
            {children}
        </div>
    </div>
);

const QuadrantsBoard = ({ children, decayState = {} }) => {
    // Sort children into zones (mock logic for now, assumes children match zones)
    // In a real app, you'd filter the children array by 'quadrant' prop.

    // For demonstration, we'll just render the grid skeleton.
    // The consumer (DashboardV2) will need to pass categorized lists.

    return (
        <div className="w-full h-[calc(100vh-140px)] grid grid-cols-2 grid-rows-2 gap-6 p-4">
            {Object.entries(ZONE_CONFIG).map(([key, config]) => (
                <QuadrantZone key={key} id={key} config={config} decayLevel={decayState[key] || 0}>
                    {/* This is where we will inject the cards for this zone */}
                    {/* For now, just a placeholder if empty */}
                    {/* {children} */}
                    {/* Filter children for this quadrant */}
                    {Children.map(children, child => {
                        if (isValidElement(child) && child.props['data-quadrant'] === key) {
                            return child;
                        }
                        return null;
                    })}
                </QuadrantZone>
            ))}
        </div>
    );
};

export default QuadrantsBoard;
