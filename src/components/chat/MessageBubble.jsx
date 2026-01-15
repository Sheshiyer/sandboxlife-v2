import PropTypes from "prop-types";

const MessageBubble = ({ message, isOwn, senderName, senderAvatar }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[75%]`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {senderAvatar ? (
            <img 
              src={senderAvatar} 
              alt={senderName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-red text-white flex items-center justify-center text-sm font-medium">
              {senderName?.[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
          {!isOwn && (
            <span className="text-xs text-slate-500 mb-1 px-1">
              {senderName?.split("@")[0] || "Unknown"}
            </span>
          )}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? "bg-red text-white rounded-br-md"
                : "bg-lightpapyrus border border-darkpapyrus text-slate-800 rounded-bl-md"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <span className="text-xs text-slate-400 mt-1 px-1">
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
};

export default MessageBubble;
