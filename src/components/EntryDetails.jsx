import { useEffect, useState } from "react";
import defaultImg from "../assets/icons/default.jpg";
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  BookOpenIcon,
  CalendarIcon,
  LightBulbIcon,XMarkIcon
} from "@heroicons/react/24/outline";
import { daily_journal_questions } from "../constants/questions";
import { useGameMode } from "../context/GameModeContext";
import { resolveIcon } from "../utils/iconResolver";

export default function EntryDetails({
  title,
  iconTitle,
  date,
  image,
  message,
  time,
  selected,
  setSelected
}) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const { isGameMode } = useGameMode();

  // Resolve icon for the display
  const resolvedImage = resolveIcon({ journal_meaning: iconTitle, journal_icon: image });

  const getPanelStyles = () => {
    if (isGameMode) {
      switch (title) {
        case "Book":
          return {
            bg: "bg-slate-900",
            border: "border-purple-500/50",
            badge: "bg-purple-500/30",
            text: "text-slate-200",
            titleText: "text-purple-400",
            subText: "text-slate-400",
            contentBg: "bg-slate-950/70",
            icon: "text-purple-400"
          };
        case "Daily":
          return {
            bg: "bg-slate-900",
            border: "border-sky-500/50",
            badge: "bg-sky-500/30",
            text: "text-slate-200",
            titleText: "text-sky-400",
            subText: "text-slate-400",
            contentBg: "bg-slate-950/70",
            icon: "text-sky-400"
          };
        case "Status":
          return {
            bg: "bg-slate-900",
            border: "border-yellow-500/50",
            badge: "bg-yellow-500/30",
            text: "text-slate-200",
            titleText: "text-yellow-400",
            subText: "text-slate-400",
            contentBg: "bg-slate-950/70",
            icon: "text-yellow-400"
          };
        default:
          return {
            bg: "bg-slate-900",
            border: "border-yellow-500/30",
            badge: "bg-slate-800",
            text: "text-slate-200",
            titleText: "text-yellow-500",
            subText: "text-slate-400",
            contentBg: "bg-slate-950/70",
            icon: "text-slate-300"
          };
      }
    }

    switch (title) {
      case "Book":
        return {
          bg: "bg-[#d4edfc]",
          border: "border-[#5bb8f2]",
          badge: "bg-[#83cefd]/40",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          contentBg: "bg-white/70",
          icon: "text-slate-700"
        };
      case "Status":
        return {
          bg: "bg-[#fef3d4]",
          border: "border-[#d9a84b]",
          badge: "bg-[#f5c15f]/40",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          contentBg: "bg-white/70",
          icon: "text-slate-700"
        };
      case "Daily":
        return {
          bg: "bg-[#d4fcd9]",
          border: "border-[#4adf61]",
          badge: "bg-[#72fe82]/40",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          contentBg: "bg-white/70",
          icon: "text-slate-700"
        };
      default:
        return {
          bg: "bg-lightpapyrus",
          border: "border-darkpapyrus",
          badge: "bg-darkpapyrus/40",
          text: "text-slate-700",
          titleText: "text-slate-900",
          subText: "text-slate-700",
          contentBg: "bg-white/70",
          icon: "text-slate-700"
        };
    }
  };

  const panelStyles = getPanelStyles();

  useEffect(() => {
    if (selected) setOpen(true);

    daily_journal_questions.find((data) => {
      if (data.meaning === iconTitle && data.trigger_question.length === 4) {
        // console.log(data.trigger_question.length);
      } else if (data.trigger_question.length > 4) {
        setQuestion(data.trigger_question);
      }
    });
  }, [selected,iconTitle]);


  return (
    <>
      <Transition show={open}>
        <Dialog
          className="relative  z-50"
          onClose={setOpen}
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-0 z-10 w-full h-full overflow-y-auto bg-black/60 backdrop-blur-md"
            onClick={() => {setOpen(false) , setSelected(null) } }
          >
            <div className="flex  min-h-full  justify-center items-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 "
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 "
              >
                <DialogPanel className={`relative transform overflow-hidden rounded-3xl text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border ${panelStyles.border}`}>
                  <div className={`relative ${panelStyles.bg} rounded-3xl px-6 py-6 md:px-8 md:py-7 shadow-inner`}>
                    <button
                      type="button"
                      className={`absolute right-4 top-4 rounded-full ${isGameMode ? "bg-slate-800 hover:bg-slate-700" : "bg-lightpapyrus hover:shadow-md"} p-1.5 transition`}
                      onClick={() => { setOpen(false); setSelected(null); }}
                    >
                      <XMarkIcon className={`w-4 h-4 ${isGameMode ? "text-yellow-500" : "text-gray-700"}`} />
                    </button>
                    <div className="grid gap-6 md:grid-cols-[1.6fr_0.9fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-2 text-sm font-semibold ${panelStyles.subText}`}>
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${panelStyles.badge} text-white`}>
                              Q
                            </span>
                            Quest Inquiry
                          </div>
                          <h2 className={`text-lg md:text-xl font-serif font-semibold leading-snug ${panelStyles.titleText}`}>
                            {question}
                          </h2>
                        </div>
                        <div className="space-y-2">
                          <div className={`inline-flex items-center gap-2 text-sm font-semibold ${panelStyles.subText}`}>
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${panelStyles.badge} text-white`}>
                              A
                            </span>
                            Chronicle Entry
                          </div>
                          <div
                            style={{ scrollbarWidth: "thin" }}
                            className={`max-h-[12rem] overflow-y-auto rounded-2xl ${panelStyles.contentBg} px-4 py-3 text-[0.98rem] leading-relaxed ${panelStyles.text} shadow-inner border ${isGameMode ? "border-white/5" : "border-black/5"}`}
                          >
                            {message || "No response captured yet."}
                          </div>
                        </div>
                      </div>
                      <div className={`flex flex-col items-center gap-4 rounded-2xl ${panelStyles.contentBg} px-4 py-4 text-center shadow-inner border ${isGameMode ? "border-white/5" : "border-black/5"}`}>
                        <h3 className={`text-sm font-semibold ${panelStyles.titleText}`}>{iconTitle}</h3>
                        <div className={`p-1 rounded-2xl ${isGameMode ? "bg-yellow-500/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]" : ""}`}>
                          <img
                            src={resolvedImage ? resolvedImage : defaultImg}
                            alt={iconTitle}
                            className={`h-24 w-24 rounded-2xl object-cover ${isGameMode ? "bg-slate-900" : "bg-white"} shadow-sm border ${isGameMode ? "border-yellow-500/30" : "border-black/5"}`}
                          />
                        </div>
                        <div className={`text-sm font-medium ${panelStyles.text}`}>
                          <div>{date}</div>
                          <div>{time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center justify-center w-9 h-9 border rounded-xl ${isGameMode ? "border-yellow-500/30 bg-slate-800" : "border-[#b1b1b1] bg-white"}`}>
                            <div className={`rounded-md p-1 ${isGameMode ? "" : "bg-darkpapyrus"}`}>
                              {title === "Book" && (
                                <BookOpenIcon className={`w-4 h-4 inline ${panelStyles.icon}`} />
                              )}
                              {title === "Daily" && (
                                <CalendarIcon className={`w-4 h-4 inline ${panelStyles.icon}`} />
                              )}
                              {title === "Status" && (
                                <LightBulbIcon className={`w-4 h-4 inline ${panelStyles.icon}`} />
                              )}
                            </div>
                          </div>
                          <span className={`text-sm font-semibold ${panelStyles.text}`}>{title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}


EntryDetails.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  iconTitle: PropTypes.string,
  date: PropTypes.string,
  image: PropTypes.string,
  message: PropTypes.string,
  time: PropTypes.string,
  selected: PropTypes.bool,
  setSelected: PropTypes.func,
};
