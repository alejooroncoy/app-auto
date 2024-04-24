import openTabs from "./openTabs.js";

const openTabPerChunk = async (chunk, browser) => {
  for (const dni of chunk) {
    await openTabs(browser, dni);
  }
};

export default openTabPerChunk;
