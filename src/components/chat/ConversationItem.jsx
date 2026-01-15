import PropTypes from "prop-types";
import { ChatBubbleLeftRightIcon, UserGroupIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../../context/GameModeContext";

const ConversationItem = ({ conversation, onClick, isActive, otherUser }) => {
  const { isGameMode } = useGameMode();
  
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: "short" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getIcon = () => {
    switch (conversation.type) {
      case "global":
        return <GlobeAltIcon className={`w-5 h-5 ${isGameMode ? "text-yellow-500" : "text-slate-500"}`} />;
      case "group":
        return <UserGroupIcon className={`w-5 h-5 ${isGameMode ? "text-yellow-500" : "text-slate-500"}`} />;
      default:
        return <ChatBubbleLeftRightIcon className={`w-5 h-5 ${isGameMode ? "text-yellow-500" : "text-slate-500"}`} />;
    }
  };

  const getName = () => {
    if (conversation.type === "global") return isGameMode ? "The Tavern" : "Global Chat Room";
    if (conversation.type === "group") return conversation.name || "Group Chat";
    if (otherUser) return otherUser.display_name || otherUser.email?.split("@")[0] || "User";
    return conversation.name || "Direct Message";
  };

  const getAvatar = () => {
    if (conversation.avatar_url) {
      return (
        <img 
          src={conversation.avatar_url} 
          alt={getName()} 
          className={`w-12 h-12 rounded-full object-cover ${isGameMode ? "border-2 border-yellow-500/30" : ""}`}
        />
      );
    }
    if (otherUser?.avatar_url) {
      return (
        <img 
          src={otherUser.avatar_url} 
          alt={getName()} 
          className={`w-12 h-12 rounded-full object-cover ${isGameMode ? "border-2 border-yellow-500/30" : ""}`}
        />
      );
    }
    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
        isGameMode 
          ? "bg-slate-800 border-yellow-500/20" 
          : "bg-lightpapyrus border-darkpapyrus"
      }`}>
        {getIcon()}
      </div>
    );
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border mb-2 ${
        isActive 
          ? isGameMode 
            ? "bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(255,215,0,0.1)]" 
            : "bg-red/10 border-red shadow-sm"
          : isGameMode
            ? "bg-slate-900/40 border-white/5 hover:border-yellow-500/20 hover:bg-slate-800/60"
            : "bg-white border-transparent hover:bg-lightpapyrus hover:border-darkpapyrus"
      }`}
    >
      <div className="relative">
        {getAvatar()}
        {otherUser?.online_status === "online" && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
            isGameMode ? "border-slate-900" : "border-white"
          } bg-green-500`} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium truncate ${
            isGameMode ? (isActive ? "text-yellow-500" : "text-slate-100") : "text-slate-800"
          }`}>
            {getName()}
          </h3>
          <span className={`text-[10px] flex-shrink-0 ml-2 ${
            isGameMode ? "text-slate-500" : "text-slate-400"
          }`}>
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        <p className={`text-xs truncate ${
          isGameMode ? "text-slate-500 font-serif italic" : "text-slate-500"
        }`}>
          {conversation.type === "global" 
            ? (isGameMode ? "Public tales and rumors" : "Public chat room") 
            : "Tap to view messages"}
        </p>
      </div>
    </button>
  );
};


ConversationItem.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["direct", "group", "global"]).isRequired,
    name: PropTypes.string,
    avatar_url: PropTypes.string,
    last_message_at: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  otherUser: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string,
    avatar_url: PropTypes.string,
    online_status: PropTypes.string,
  }),
};

export default ConversationItem;
