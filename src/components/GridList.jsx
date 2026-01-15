import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import PropTypes from "prop-types";
import JournalEntry from "./JournalEntry";
import EntryDetails from "./EntryDetails";
import { formatDatetime, formatJournalType } from "../utils/formatters";

const GridList = ({ items, chapters = [] }) => {
  const [selected, setSelected] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState("All");

  const handleOnClick = (data) => {
    setSelected(data);
  };

  return (
    <div className="flex flex-col items-start justify-start gap-6 w-full">
      {chapters.length > 0 && (
        <div className="flex flex-row items-center justify-start gap-3">
          <p className="text-sm font-medium text-darkpapyrus">Filter by chapter:</p>
          <Menu>
            <MenuButton className="px-4 py-2 bg-white border border-darkpapyrus rounded-lg text-sm font-medium hover:bg-bgpapyrus transition-colors">
              {selectedChapter}
            </MenuButton>
            <MenuItems
              anchor="bottom"
              className="absolute z-10 w-48 py-2 mt-2 border border-darkpapyrus rounded-lg shadow-lg bg-lightpapyrus"
            >
              {chapters?.map((chapter, index) => (
                <MenuItem
                  key={index}
                  className="block px-4 py-2 text-sm hover:bg-bgpapyrus cursor-pointer transition-colors"
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
