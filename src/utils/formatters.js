export const formatJournalType = (journalType) => {
  switch (journalType) {
    case "daily_journal":
      return "Daily";
    case "book_journal":
      return "Book";
    case "thought_of_the_day":
    case "tought_of_the_day":
      return "Status";
    default:
      return journalType;
  }
};

export const formatDatetime = (datetimeStr) => {
  const date = new Date(datetimeStr);

  const formatDate = () => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits of year

    return `${month}/${day}/${year}`;
  };

  const formatTime = () => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return {
    date: formatDate(),
    time: formatTime(),
  };
};
