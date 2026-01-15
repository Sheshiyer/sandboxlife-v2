import { useState } from "react";
import PropTypes from "prop-types";
import { MagnifyingGlassIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { searchUsers, sendFriendRequest, getFriendshipStatus } from "../../utils/social";
import { toast } from "react-toastify";

const AddFriend = ({ userId, onClose, onRequestSent }) => {
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
      return { text: "Friends", disabled: true, className: "bg-green-100 text-green-700" };
    }
    if (user.friendshipStatus === "pending") {
      return { text: "Pending", disabled: true, className: "bg-yellow-100 text-yellow-700" };
    }
    if (user.friendshipStatus === "blocked") {
      return { text: "Blocked", disabled: true, className: "bg-slate-100 text-slate-500" };
    }
    return { text: "Add Friend", disabled: false, className: "bg-red text-white hover:bg-red/90" };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-darkpapyrus">
          <h2 className="text-lg font-semibold text-slate-800">Add Friends</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-lightpapyrus transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-4 border-b border-darkpapyrus">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-darkpapyrus focus:outline-none focus:ring-2 focus:ring-red"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 disabled:opacity-50 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {query ? "No users found" : "Search for users to add as friends"}
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((user) => {
                const displayName = user.display_name || user.user_id?.slice(0, 8) || "User";
                const buttonState = getButtonState(user);

                return (
                  <div
                    key={user.user_id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-darkpapyrus"
                  >
                    {/* Avatar */}
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red text-white flex items-center justify-center font-medium">
                        {displayName[0]?.toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-800 truncate">{displayName}</h3>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSendRequest(user.user_id)}
                      disabled={buttonState.disabled || sending === user.user_id}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${buttonState.className}`}
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
