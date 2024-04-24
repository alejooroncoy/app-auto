import { Browser } from "puppeteer";

/**
 *
 * @param {Browser} browser
 * @param {*} dni
 */
const openTabs = async (browser, dni) => {
  const links = [
    "https://www.sssalud.gob.ar/index.php?cat=consultas&page=busopcmono",
    "https://www.sssalud.gob.ar/index.php?cat=consultas&page=busmon",
    "https://www.sssalud.gob.ar/index.php?cat=consultas&page=mono_pagos",
    "https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaCredencialEfectorAction.do",
  ];

  for (const link of links) {
    const page = await browser.newPage();
    await page.goto(link);

    const isLast = link === links.at(-1);

    if (isLast) {
      const iframe = await page.$("iframe#miBody");
      const frame = await iframe.contentFrame();
      const inputRef = await frame.$("input[id='cuit']");
      await inputRef?.type(dni);
      continue;
    }

    const inputRef =
      (await page.$('input[name="nro_cuil"]')) ||
      (await page.$('input[name="cuil_b"]'));

    const dniFormatted =
      dni.slice(0, 2) + "-" + dni.slice(2, 10) + "-" + dni.slice(10);
    inputRef?.type(dniFormatted);
  }
};

export default openTabs;
