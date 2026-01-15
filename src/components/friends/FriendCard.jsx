import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ChatBubbleLeftIcon, UserMinusIcon } from "@heroicons/react/24/outline";

const FriendCard = ({ friend, onMessage, onRemove }) => {
  const displayName = friend.friend_display_name || friend.friend_email?.split("@")[0] || "User";
  const isOnline = friend.friend_online_status === "online";

  return (
    <div className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-darkpapyrus">
      {/* Avatar - Clickable to profile */}
      <Link to={`/user/${friend.friend_id}`} className="relative flex-shrink-0">
        {friend.friend_avatar_url ? (
          <img
            src={friend.friend_avatar_url}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-red text-white flex items-center justify-center text-lg font-medium">
            {displayName[0]?.toUpperCase()}
          </div>
        )}
        {/* Online indicator */}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-slate-300"
          }`}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/user/${friend.friend_id}`} className="hover:underline">
          <h3 className="font-medium text-slate-800 truncate">{displayName}</h3>
        </Link>
        <p className="text-sm text-slate-500">
          {isOnline ? "Online" : "Offline"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onMessage(friend)}
          className="p-2 rounded-full bg-red text-white hover:bg-red/90 active:scale-95 transition-all touch-manipulation"
          title="Send message"
        >
          <ChatBubbleLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onRemove(friend)}
          className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 transition-all touch-manipulation"
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
  }).isRequired,
  onMessage: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default FriendCard;
