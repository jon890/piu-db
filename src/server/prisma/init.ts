import ChartDB from "./chart.db";
import SongDB from "./song.db";

export const initializeCache = async () => {
  console.log("initializeCache");
  await SongDB.findAll();
  await ChartDB.findAll();
};
