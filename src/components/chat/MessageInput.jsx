import { useState } from "react";
import PropTypes from "prop-types";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const MessageInput = ({ onSend, disabled, placeholder = "Type a message..." }) => {
  const [message, setMessage] = useState("");

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
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 sm:p-4 border-t border-darkpapyrus bg-bgpapyrus safe-area-inset-bottom">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-darkpapyrus bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red resize-none min-h-[44px] sm:min-h-[48px] max-h-[120px] text-base"
          style={{ height: "auto" }}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="flex-shrink-0 p-2.5 sm:p-3 rounded-full bg-red text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red/90 active:scale-95 transition-all touch-manipulation"
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
