import { useState } from "react";
import PropTypes from "prop-types";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useGameMode } from "../../context/GameModeContext";

const MessageInput = ({ onSend, disabled, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState("");
  const { isGameMode } = useGameMode();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end gap-2 p-3 sm:p-4 border-t transition-colors safe-area-inset-bottom ${
      isGameMode ? "bg-slate-950 border-white/10" : "border-darkpapyrus bg-bgpapyrus"
    }`}>
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`w-full px-4 py-3 rounded-2xl border transition-all focus:outline-none focus:ring-2 resize-none min-h-[44px] sm:min-h-[48px] max-h-[120px] text-base ${
            isGameMode 
              ? "bg-slate-900 border-white/10 text-slate-100 placeholder-slate-500 focus:ring-yellow-500/50" 
              : "border-darkpapyrus bg-white text-slate-800 placeholder-slate-400 focus:ring-red"
          }`}
          style={{ height: "auto" }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`flex-shrink-0 p-3 rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
          isGameMode 
            ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
            : "bg-red text-white hover:bg-red/90"
        }`}
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>
    </form>
  );
};


MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default MessageInput;
