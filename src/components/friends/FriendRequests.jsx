import PropTypes from "prop-types";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

const FriendRequests = ({ requests, onAccept, onDecline }) => {
  if (requests.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 text-left">
        Friend Requests ({requests.length})
      </h2>
      <div className="space-y-2">
        {requests.map((request) => {
          const displayName = request.requester_display_name || request.requester_email?.split("@")[0] || "User";
          
          return (
            <div
              key={request.friendship_id}
              className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200"
            >
              {/* Avatar */}
              {request.requester_avatar_url ? (
                <img
                  src={request.requester_avatar_url}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red text-white flex items-center justify-center text-lg font-medium">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 truncate">{displayName}</h3>
                <p className="text-sm text-slate-500">
                  Sent {new Date(request.requested_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAccept(request.friendship_id)}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                  title="Accept"
                >
                  <CheckIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDecline(request.friendship_id)}
                  className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                  title="Decline"
                >
                  <XMarkIcon className="w-5 h-5" />
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
