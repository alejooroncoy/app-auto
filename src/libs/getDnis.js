import pdfParser from "pdf-parser";
import path from "node:path";
import { readFile } from "node:fs/promises";

const processPdf = (srcPath) =>
  new Promise((res, rej) => {
    pdfParser.pdf2json(srcPath, (err, pdf) => {
      if (err) return rej(err);
      res(pdf);
    });
  });

const getDnis = async (srcPath) => {
  if (path.extname(srcPath) === ".pdf") {
    const { pages } = await processPdf(srcPath);

    const cuil = pages
      .find((page) => page.texts.some((textNode) => textNode.text === "CUIL"))
      ?.texts.find((textNode) => textNode.text === "CUIL");

    if (cuil) {
      const textsMatrix = pages.map((page) => {
        const texts = page.texts
          .filter(
            (textNode) =>
              textNode.text.match(/\d{11}/g) > 0 &&
              textNode.left >= cuil.left - 50 &&
              textNode.left <= cuil.left + 50
          )
          .map((textNode) => textNode.text);
        return texts;
      });

      return textsMatrix.flat();
    }
    return [];
  } else if (path.extname(srcPath) === ".txt") {
    const text = await readFile(srcPath, "utf-8");
    const dnis = text.match(/\d{11}/g);
    return dnis;
  }
  return;
};

export default getDnis;
