import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import PropTypes from "prop-types";
import JournalEntry from "./JournalEntry";
import EntryDetails from "./EntryDetails";
import { formatDatetime, formatJournalType } from "../utils/formatters";
import { useGameMode } from "../context/GameModeContext";

const GridList = ({ items, chapters = [] }) => {
  const [selected, setSelected] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState("All");
  const { isGameMode } = useGameMode();

  const handleOnClick = (data) => {
    setSelected(data);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-6 w-full">
      {chapters.length > 0 && (
        <div className="flex flex-row items-center justify-start gap-3">
          <p className={`text-sm font-medium ${isGameMode ? "text-yellow-500/70" : "text-darkpapyrus"}`}>Filter by chapter:</p>
          <Menu>
            <MenuButton className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              isGameMode 
                ? "bg-slate-900/60 border-yellow-500/30 text-yellow-500 hover:bg-slate-800" 
                : "bg-white border-darkpapyrus text-slate-700 hover:bg-bgpapyrus"
            }`}>
              {selectedChapter}
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className={`absolute z-10 w-48 py-2 mt-2 border rounded-lg shadow-xl ${
                isGameMode 
                  ? "bg-slate-900 border-yellow-500/30 text-slate-200" 
                  : "bg-lightpapyrus border-darkpapyrus text-slate-700"
              }`}
            >
              <MenuItem
                className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                  isGameMode ? "hover:bg-slate-800 hover:text-yellow-500" : "hover:bg-bgpapyrus"
                }`}
                onClick={() => setSelectedChapter("All")}
              >
                <p>All Chapters</p>
              </MenuItem>
              {chapters?.map((chapter, index) => (
                <MenuItem
                  key={index}
                  className={`block px-4 py-2 text-sm cursor-pointer transition-colors ${
                    isGameMode ? "hover:bg-slate-800 hover:text-yellow-500" : "hover:bg-bgpapyrus"
                  }`}
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <p>{chapter}</p>
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      )}
      <div className="relative w-full entry-grid">
        {items
          .filter((item) => {
            if (selectedChapter === "All") return true;
            return item?.journal_meaning === selectedChapter;
          })
          .map((d, index) =>
            d && d.id ? (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => handleOnClick(d)}
              >
                <JournalEntry
                  id={d.id}
                  title={formatJournalType(d.journal_type)}
                  iconTitle={d.journal_meaning}
                  date={formatDatetime(d.created_at).date}
                  image={d.journal_icon}
                  message={d.journal_entry}
                  time={formatDatetime(d.created_at).time}
                  selected={selected}
                  index={index}
                />
              </div>
            ) : null
          )}
        {selected && (
          <EntryDetails
            id={selected.id}
            title={formatJournalType(selected.journal_type)}
            iconTitle={selected.journal_meaning}
            date={formatDatetime(selected.created_at).date}
            image={selected.journal_icon}
            message={selected.journal_entry}
            time={formatDatetime(selected.created_at).time}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
    </div>
  );
};


GridList.propTypes = {
  items: PropTypes.array.isRequired,
  chapters: PropTypes.array,
};

export default GridList;
