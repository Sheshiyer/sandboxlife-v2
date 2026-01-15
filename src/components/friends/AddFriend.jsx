import { useState } from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { searchUsers, sendFriendRequest, getFriendshipStatus } from "../../utils/social";
import { toast } from "react-toastify";
import { useGameMode } from "../../context/GameModeContext";

const AddFriend = ({ userId, onClose, onRequestSent }) => {
  const { isGameMode } = useGameMode();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await searchUsers(query.trim());
    if (result.success) {
      // Check friendship status for each result
      const resultsWithStatus = await Promise.all(
        result.data.map(async (user) => {
          const statusResult = await getFriendshipStatus(userId, user.user_id);
          return {
            ...user,
            friendshipStatus: statusResult.data?.status || null,
            friendshipId: statusResult.data?.id || null,
          };
        })
      );
      setResults(resultsWithStatus);
    } else {
      toast.error("Search failed");
    }
    setLoading(false);
  };

  const handleSendRequest = async (targetUserId) => {
    setSending(targetUserId);
    const result = await sendFriendRequest(targetUserId);
    if (result.success) {
      toast.success("Friend request sent!");
      setResults((prev) =>
        prev.map((u) =>
          u.user_id === targetUserId
            ? { ...u, friendshipStatus: "pending" }
            : u
        )
      );
      onRequestSent?.();
    } else {
      toast.error(result.error || "Failed to send request");
    }
    setSending(null);
  };

  const getButtonState = (user) => {
    if (user.friendshipStatus === "accepted") {
      return { 
        text: "Friends", 
        disabled: true, 
        className: isGameMode ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-green-100 text-green-700" 
      };
    }
    if (user.friendshipStatus === "pending") {
      return { 
        text: "Pending", 
        disabled: true, 
        className: isGameMode ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-yellow-100 text-yellow-700" 
      };
    }
    if (user.friendshipStatus === "blocked") {
      return { 
        text: "Blocked", 
        disabled: true, 
        className: isGameMode ? "bg-slate-800 text-slate-500 border border-white/5" : "bg-slate-100 text-slate-500" 
      };
    }
    return { 
      text: "Add Friend", 
      disabled: false, 
      className: isGameMode ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-md" : "bg-red text-white hover:bg-red/90" 
    };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl border ${
        isGameMode ? "bg-slate-900 border-yellow-500/30" : "bg-white border-darkpapyrus"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isGameMode ? "border-white/10" : "border-darkpapyrus"
        }`}>
          <h2 className={`text-lg font-semibold ${isGameMode ? "text-yellow-500 font-serif" : "text-slate-800"}`}>
            {isGameMode ? "Recruit Adventurers" : "Add Friends"}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isGameMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-lightpapyrus text-slate-600"
            }`}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className={`p-4 border-b ${
          isGameMode ? "border-white/10 bg-black/20" : "border-darkpapyrus"
        }`}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isGameMode ? "text-yellow-500/50" : "text-slate-400"
              }`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isGameMode ? "Search by character name..." : "Search by name..."}
                className={`w-full pl-10 pr-4 py-2 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  isGameMode 
                    ? "bg-slate-800 border-white/10 text-slate-100 focus:ring-yellow-500/50" 
                    : "border-darkpapyrus focus:ring-red"
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`px-4 py-2 rounded-xl disabled:opacity-50 transition-all font-medium ${
                isGameMode 
                  ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
                  : "bg-red text-white hover:bg-red/90"
              }`}
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                isGameMode ? "border-yellow-500" : "border-red"
              }`}></div>
            </div>
          ) : results.length === 0 ? (
            <div className={`text-center py-12 ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>
              {query ? "No adventurers found in the realm" : "Enter a name to begin your search"}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((user) => {
                const displayName = user.display_name || user.user_id?.slice(0, 8) || "User";
                const buttonState = getButtonState(user);
                const level = user.level || 1;
                const title = user.title || "Wanderer";

                return (
                  <div
                    key={user.user_id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      isGameMode 
                        ? "bg-black/20 border-white/5 hover:border-yellow-500/20" 
                        : "border-darkpapyrus"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={displayName}
                          className={`w-10 h-10 rounded-full object-cover ${isGameMode ? "border-2 border-slate-700" : ""}`}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                          isGameMode ? "bg-slate-800 text-yellow-500 border-2 border-slate-700" : "bg-red text-white"
                        }`}>
                          {displayName[0]?.toUpperCase()}
                        </div>
                      )}
                      {isGameMode && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center text-[9px] font-bold border border-slate-900">
                          {level}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${isGameMode ? "text-slate-200" : "text-slate-800"}`}>
                        {displayName}
                      </h3>
                      {isGameMode && (
                        <p className="text-[10px] font-serif text-yellow-500/60 uppercase tracking-wider">
                          {title}
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSendRequest(user.user_id)}
                      disabled={buttonState.disabled || sending === user.user_id}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${buttonState.className}`}
                    >
                      {sending === user.user_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      ) : (
                        <>
                          {!buttonState.disabled && <UserPlusIcon className="w-4 h-4" />}
                          {buttonState.text}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


AddFriend.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onRequestSent: PropTypes.func,
};

export default AddFriend;
