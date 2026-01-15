import PropTypes from "prop-types";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../../context/GameModeContext";

const FriendRequests = ({ requests, onAccept, onDecline }) => {
  const { isGameMode } = useGameMode();
  
  if (requests.length === 0) return null;

  return (
    <section className="mb-8 animate-reveal">
      <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-left ${
        isGameMode ? "text-yellow-500/60 font-serif" : "text-slate-500"
      }`}>
        Party Invitations ({requests.length})
      </h2>
      <div className="space-y-3">
        {requests.map((request) => {
          const displayName = request.requester_display_name || request.requester_email?.split("@")[0] || "User";
          const level = request.requester_level || 1;
          const title = request.requester_title || "Wanderer";
          
          return (
            <div
              key={request.friendship_id}
              className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${
                isGameMode 
                  ? "bg-slate-900 border-yellow-500/30" 
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                {request.requester_avatar_url ? (
                  <img
                    src={request.requester_avatar_url}
                    alt={displayName}
                    className={`w-12 h-12 rounded-full object-cover ${isGameMode ? "border-2 border-yellow-500/20" : ""}`}
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                    isGameMode ? "bg-slate-800 text-yellow-500 border-2 border-yellow-500/20" : "bg-red text-white"
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
                <h3 className={`font-medium truncate ${isGameMode ? "text-slate-100" : "text-slate-800"}`}>
                  {displayName}
                </h3>
                <p className={`text-xs ${isGameMode ? "text-yellow-500/70 font-serif uppercase tracking-wider" : "text-slate-500"}`}>
                  {isGameMode ? title : `Sent ${new Date(request.requested_at).toLocaleDateString()}`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAccept(request.friendship_id)}
                  className={`p-2.5 rounded-full transition-all active:scale-95 shadow-md ${
                    isGameMode 
                      ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                  title="Accept"
                >
                  <CheckIcon className="w-5 h-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => onDecline(request.friendship_id)}
                  className={`p-2.5 rounded-full transition-all active:scale-95 shadow-md ${
                    isGameMode 
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-red-400 border border-white/5" 
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                  title="Decline"
                >
                  <XMarkIcon className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};


FriendRequests.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      friendship_id: PropTypes.string.isRequired,
      requester_id: PropTypes.string.isRequired,
      requester_email: PropTypes.string,
      requester_display_name: PropTypes.string,
      requester_avatar_url: PropTypes.string,
      requested_at: PropTypes.string,
    })
  ).isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default FriendRequests;
