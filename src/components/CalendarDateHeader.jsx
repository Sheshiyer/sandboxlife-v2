import { useEffect, useState } from "react";
import { fetchWeeklyData } from "../utils/supabase";
import { formatDatetime } from "../utils/formatters";
import { 
  book_journal_questions, 
  daily_journal_questions, 
  iconsv2_questions 
} from "../constants/questions";

const CalendarComponent = () => {
  const [weeklyData, setweeklyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem("user_id");
        const today = new Date();
        const week = new Date(today);
        week.setDate(today.getDate() - 5);
        const dateFrom = week.toISOString();

        const result = await fetchWeeklyData(storedUserId, dateFrom);

        if (result) {
          setweeklyData(result);
        }
      } catch (error) {
        // Failed to fetch weekly data
      }
    };
    fetchData();
  }, []);

  const getIconSource = (entry) => {
    if (!entry) return null;

    // Try finding in V1 daily questions
    let question = daily_journal_questions.find(q => q.meaning === entry.journal_meaning);
    if (question && question.icon) return question.icon;

    // Try finding in V1 book questions
    question = book_journal_questions.find(q => q.meaning === entry.journal_meaning);
    if (question && question.icon) return question.icon;

    // Try finding in V2 questions
    question = iconsv2_questions.find(q => q.meaning === entry.journal_meaning);
    if (question && question.icon) return question.icon;

    // Fallback to the stored URL (though this is likely the broken one we're fixing)
    return entry.journal_icon;
  };

  return (
    <div
      className="sticky right-0 z-10 w-full"
      style={{ zIndex: "1", position: "sticky", top: "6.6vh", left: "0px" }}
    >
      <div className="flex items-center h-auto gap-2 px-3 py-3 text-xs justify-evenly bg-lightpapyrus border border-darkpapyrus rounded-2xl shadow-sm">
      {weeklyData &&
        weeklyData?.sort()?.map((day, index) => {
          const iconSrc = getIconSource(day);
          return (
            <div key={index} className="w-16 h-20 m-auto">
              <div
                className={`relative flex flex-col items-center h-16 rounded-xl border border-transparent ${
                  index === 4 &&
                  "border-darkpapyrus shadow-[#787878] shadow-md bg-bgpapyrus"
                }`}
              >
                {iconSrc && (
                  <img
                    src={iconSrc}
                    alt={day.journal_meaning || ""}
                    className={`w-12 h-12 my-auto rounded-xl object-cover bg-white shadow-sm ${
                      index === 4 && "w-12 h-12"
                    }`}
                    onError={(e) => {
                      // Fallback if the resolved source (or DB URL) still fails
                      // Maybe hide it or show a placeholder
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              <span className={` font-semibold text-[0.4rem] sm:text-[0.5rem] `}>
                {formatDatetime(day.created_at).date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarComponent;
