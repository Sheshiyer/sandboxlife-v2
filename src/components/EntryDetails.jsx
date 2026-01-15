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

  const getPanelStyles = () => {
    switch (title) {
      case "Book":
        return {
          bg: "bg-[#d4edfc]",
          border: "border-[#5bb8f2]",
          badge: "bg-[#83cefd]/40",
        };
      case "Status":
        return {
          bg: "bg-[#fef3d4]",
          border: "border-[#d9a84b]",
          badge: "bg-[#f5c15f]/40",
        };
      case "Daily":
        return {
          bg: "bg-[#d4fcd9]",
          border: "border-[#4adf61]",
          badge: "bg-[#72fe82]/40",
        };
      default:
        return {
          bg: "bg-lightpapyrus",
          border: "border-darkpapyrus",
          badge: "bg-darkpapyrus/40",
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
          className="relative  z-10"
          onClose={setOpen}
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-0 z-10 w-full h-full overflow-y-auto bg-black/30 backdrop-blur-sm"
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
                <DialogPanel className="relative transform overflow-hidden rounded-3xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                  <div className={`relative border-2 ${panelStyles.border} ${panelStyles.bg} rounded-3xl px-6 py-6 md:px-8 md:py-7`}>
                    <button
                      type="button"
                      className="absolute right-4 top-4 rounded-full bg-lightpapyrus p-1.5 shadow-sm hover:shadow-md transition"
                      onClick={() => { setOpen(false); setSelected(null); }}
                    >
                      <XMarkIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <div className="grid gap-6 md:grid-cols-[1.6fr_0.9fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${panelStyles.badge}`}>
                              Q
                            </span>
                            Question
                          </div>
                          <h2 className="text-lg md:text-xl font-serif font-semibold text-slate-900 leading-snug">
                            {question}
                          </h2>
                        </div>
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 ${panelStyles.badge}`}>
                              A
                            </span>
                            Answer
                          </div>
                          <div
                            style={{ scrollbarWidth: "thin" }}
                            className={`max-h-[12rem] overflow-y-auto rounded-2xl bg-white/70 px-4 py-3 text-[0.98rem] leading-relaxed text-slate-700 shadow-inner`}
                          >
                            {message || "No response captured yet."}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/70 px-4 py-4 text-center shadow-inner">
                        <h3 className="text-sm font-semibold text-slate-700">{iconTitle}</h3>
                        <img
                          src={image ? image : defaultImg}
                          alt={iconTitle}
                          className="h-24 w-24 rounded-2xl object-cover bg-white shadow-sm"
                        />
                        <div className="text-sm font-medium text-slate-700">
                          <div>{date}</div>
                          <div>{time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-9 h-9 border border-[#b1b1b1] rounded-xl bg-white">
                            <div className="bg-darkpapyrus rounded-md">
                              {title === "Book" && (
                                <BookOpenIcon className="w-4 h-4 inline m-1 text-slate-700" />
                              )}
                              {title === "Daily" && (
                                <CalendarIcon className="w-4 h-4 inline m-1 text-slate-700" />
                              )}
                              {title === "Status" && (
                                <LightBulbIcon className="w-4 h-4 inline m-1 text-slate-700" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{title}</span>
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
