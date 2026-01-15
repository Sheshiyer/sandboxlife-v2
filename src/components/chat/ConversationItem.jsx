import PropTypes from "prop-types";
import { ChatBubbleLeftRightIcon, UserGroupIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

const ConversationItem = ({ conversation, onClick, isActive, otherUser }) => {
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
        return <GlobeAltIcon className="w-5 h-5 text-slate-500" />;
      case "group":
        return <UserGroupIcon className="w-5 h-5 text-slate-500" />;
      default:
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  const getName = () => {
    if (conversation.type === "global") return "Global Chat Room";
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
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    if (otherUser?.avatar_url) {
      return (
        <img 
          src={otherUser.avatar_url} 
          alt={getName()} 
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-full bg-lightpapyrus border border-darkpapyrus flex items-center justify-center">
        {getIcon()}
      </div>
    );
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
        isActive 
          ? "bg-red/10 border border-red" 
          : "hover:bg-lightpapyrus border border-transparent"
      }`}
    >
      {getAvatar()}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-slate-800 truncate">{getName()}</h3>
          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
            {formatTime(conversation.last_message_at)}
          </span>
        </div>
        <p className="text-sm text-slate-500 truncate">
          {conversation.type === "global" ? "Public chat room" : "Tap to view messages"}
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
  }),
};

export default ConversationItem;
