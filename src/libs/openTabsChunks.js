import { Spinner } from "@topcli/spinner";
import openTabPerChunk from "./openTabPerChunk.js";
import { keyIn, keyInPause, question } from "readline-sync";
import puppeteer from "puppeteer";

const openTabsChunks = async (dnis, chunckSize) => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const chunksLength = Math.trunc(dnis.length / chunckSize);
  const restLength = dnis.length % chunckSize;

  for (let i = 0; i < chunksLength; i++) {
    const spinner = new Spinner().start(`Abriendo pestañas chunk ${i + 1}`);

    const chunk = dnis.slice(i * chunckSize, (i + 1) * chunckSize);
    try {
      await openTabPerChunk(chunk, browser);
    } catch (err) {
      spinner.failed(
        "Hubo un error al abrir las pestañas, no cerrar la ventana mientras se procesa"
      );
      process.exit(1);
    }

    spinner.succeed("Pestañas abiertas con éxito");

    if (i !== chunksLength - 1 || restLength) {
      const answer = keyIn(
        "Presione una tecla para continuar con el siguiente chunk o C para acabar con el programa [No enter]",
        {
          hideEchoBack: true,
          mask: "",
        }
      );

      if (answer.toLowerCase() === "c") {
        console.log("Proceso cancelado");
        keyInPause("Presione una tecla para cerrar la ventana [No enter]");
        browser.close();
      }
    } else if (!restLength) {
      console.log("Todos los chunks han sido procesados");
      keyInPause("Presione una tecla para cerrar la ventana [No enter]");
      browser.close();
    }
  }

  if (restLength) {
    const chunk = dnis.slice(chunksLength * chunckSize);
    await openTabPerChunk(chunk, browser);

    console.log("Todos los chunks han sido procesados");
    keyInPause("Presione una tecla para cerrar la ventana");
    browser.close();
  }
};

export default openTabsChunks;
