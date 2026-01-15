import PropTypes from "prop-types";
import { useGameMode } from "../../context/GameModeContext";

const MessageBubble = ({ message, isOwn, senderName, senderAvatar, senderTitle }) => {
  const { isGameMode } = useGameMode();
  
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 animate-reveal`}>
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[85%] sm:max-w-[75%]`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`p-0.5 rounded-full ${isGameMode ? "bg-gradient-to-tr from-yellow-600 to-yellow-300" : ""}`}>
            {senderAvatar ? (
              <img 
                src={senderAvatar} 
                alt={senderName} 
                className={`w-8 h-8 rounded-full object-cover ${isGameMode ? "border-2 border-slate-900" : ""}`}
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isGameMode ? "bg-slate-800 text-yellow-500 border-2 border-slate-900" : "bg-red text-white"
              }`}>
                {senderName?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className={`text-[10px] font-bold ${isGameMode ? "text-slate-300" : "text-slate-600"}`}>
                {senderName?.split("@")[0] || "Unknown"}
              </span>
              {isGameMode && senderTitle && (
                <span className="text-[9px] font-serif text-yellow-500/70 uppercase tracking-wider">
                  {senderTitle}
                </span>
              )}
            </div>
          )}
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-md transition-all ${
              isOwn
                ? isGameMode 
                  ? "bg-yellow-500 text-slate-950 rounded-br-sm font-medium" 
                  : "bg-red text-white rounded-br-sm"
                : isGameMode
                  ? "bg-slate-800 border border-yellow-500/20 text-slate-100 rounded-bl-sm"
                  : "bg-white border border-darkpapyrus text-slate-800 rounded-bl-sm"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          </div>
          <span className={`text-[9px] mt-1 px-1 font-medium ${isGameMode ? "text-slate-500" : "text-slate-400"}`}>
            {formatTime(message.created_at)}
            {message.edited_at && " (edited)"}
          </span>
        </div>
      </div>
    </div>
  );
};


MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    edited_at: PropTypes.string,
    sender_id: PropTypes.string,
  }).isRequired,
  isOwn: PropTypes.bool.isRequired,
  senderName: PropTypes.string,
  senderAvatar: PropTypes.string,
  senderTitle: PropTypes.string,
};

export default MessageBubble;
