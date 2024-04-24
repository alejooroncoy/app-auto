import getDnis from "./getDnis.js";
import { Spinner } from "@topcli/spinner";
import openTabsChunks from "./openTabsChunks.js";
import { question } from "readline-sync";

const cli = async () => {
  let srcPath, dnis, spinner;

  do {
    srcPath = question(
      "Ingrese la ruta del archivo (Admitidos: pdf, txt) [Presione Enter si desea salir]: "
    );
    spinner = new Spinner().start("Tomando los datos...");

    if (!srcPath) {
      spinner.succeed("Agradecemos su tiempo, vuelva pronto. Hasta luego!");
      return;
    }

    dnis = await getDnis(srcPath);

    if (!dnis) {
      spinner.failed(
        "No se pudo tomar los datos, pruebe otra vez con otra ruta"
      );
    } else {
      spinner.succeed("Datos tomados con éxito");
    }
  } while (!dnis);

  let chunckSize;

  do {
    chunckSize = question(
      "Intervalo de DNIs (No debe exceder a la cantidad de DNIs) [Por defecto 5]: ",
      {
        encoding: "UTF-8",
      }
    );

    if (!/^\d+$/.test(chunckSize)) chunckSize = Math.min(5, dnis.length);

    if (+chunckSize > dnis.length)
      console.log(
        "El tamaño del intervalo no puede ser mayor a la cantidad de DNIs, intentelo nuevamente."
      );
  } while (chunckSize > dnis.length);

  await openTabsChunks(dnis, chunckSize);
};

export default cli;
