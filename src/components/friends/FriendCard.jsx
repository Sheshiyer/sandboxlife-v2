import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChatBubbleLeftIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../../context/GameModeContext";

const FriendCard = ({ friend, onMessage, onRemove }) => {
  const { isGameMode } = useGameMode();
  const displayName = friend.friend_display_name || friend.friend_email?.split("@")[0] || "User";
  const isOnline = friend.friend_online_status === "online";
  
  // D&D Info
  const level = friend.level || 1;
  const title = friend.title || "Wanderer";

  return (
    <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border transition-all ${
      isGameMode 
        ? "bg-slate-900/60 border-yellow-500/20 hover:border-yellow-500/40 shadow-lg" 
        : "bg-white border-darkpapyrus shadow-sm"
    }`}>
      {/* Avatar - Clickable to profile */}
      <Link to={`/user/${friend.friend_id}`} className="relative flex-shrink-0">
        <div className={`p-0.5 rounded-full ${isGameMode ? "bg-gradient-to-tr from-yellow-600 to-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.2)]" : ""}`}>
          {friend.friend_avatar_url ? (
            <img
              src={friend.friend_avatar_url}
              alt={displayName}
              className={`w-12 h-12 rounded-full object-cover ${isGameMode ? "border-2 border-slate-900" : ""}`}
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
              isGameMode ? "bg-slate-800 text-yellow-500 border-2 border-slate-900" : "bg-red text-white"
            }`}>
              {displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>
        {/* Online indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${
            isGameMode ? "border-slate-900" : "border-white"
          } ${
            isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-slate-400"
          }`}
        />
        
        {/* Level Badge (Game Mode Only) */}
        {isGameMode && (
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center text-[10px] font-bold border-2 border-slate-900 shadow-sm">
            {level}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/user/${friend.friend_id}`} className="group">
          <h3 className={`font-medium truncate transition-colors ${
            isGameMode ? "text-slate-100 group-hover:text-yellow-500" : "text-slate-800 group-hover:underline"
          }`}>
            {displayName}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {isGameMode ? (
            <span className="text-xs font-serif text-yellow-500/70 tracking-wide uppercase">
              {title}
            </span>
          ) : (
            <p className="text-sm text-slate-500">
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onMessage(friend)}
          className={`p-2.5 rounded-full transition-all active:scale-95 shadow-md ${
            isGameMode 
              ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
              : "bg-red text-white hover:bg-red/90"
          }`}
          title="Send message"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onRemove(friend)}
          className={`p-2.5 rounded-full transition-all active:scale-95 ${
            isGameMode 
              ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-red-400 border border-white/5" 
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
          title="Remove friend"
        >
          <UserMinusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


FriendCard.propTypes = {
  friend: PropTypes.shape({
    friendship_id: PropTypes.string.isRequired,
    friend_id: PropTypes.string.isRequired,
    friend_email: PropTypes.string,
    friend_display_name: PropTypes.string,
    friend_avatar_url: PropTypes.string,
    friend_online_status: PropTypes.string,
    level: PropTypes.number,
    title: PropTypes.string,
  }).isRequired,
  onMessage: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FriendCard;
