const {ipcRenderer} = require('electron');
const isNumeric = (num) => (typeof (num) === 'number' || typeof (num) === "string" && num.trim() !== '') && !isNaN(num);
const _unset = Math.pow(2, 24) - 1;

function capitalize(ss) {
  return ss.charAt(0).toUpperCase() + ss.slice(1);
}

class configEntry {
  entryName = "";
  entryType = "";
  entryValue = "";
  entryDescription = "";
  min = 0;
  max = 0;
  step = 0;
  desc_autogen = false;

  constructor(name, type, val, desc, minimum, maximum, step) {
    this.entryName = name;
    switch (type) {
      case "string":
        this.entryType = "string";
        break;
      case "int":
        this.entryType = "int";
        break;
      case "float":
        this.entryType = "float";
        break;
      case "bool":
        this.entryType = "bool";
        break;
      case "color":
        this.entryType = "color";
        break;

      default:
        throw new Error("Invalid type " + type);
    }
    this.entryValue = val;
    this.entryDescription = desc !== undefined ? desc : this.entryName;
    if (this.entryDescription.includes("AUTOGEN")) {
      console.log(this.entryName + " has autogen description");
      this.entryDescription = this.entryDescription.replace("AUTOGEN", "");
      this.desc_autogen = true;
    }
    this.min = minimum !== undefined ? minimum : -_unset;
    this.max = maximum !== undefined ? maximum : _unset;
    this.step = step !== undefined ? step : this.entryType === "float" ? 0.1 : 1;
  }
}

let commentLines = [];
let configFile = [];
let pushDefaults = true;
if (pushDefaults) {

  configFile.push(new configEntry("songProgressColor", "color", "#7d8cd8", "Color of the song progress bar"));
  configFile.push(new configEntry("starProgressColor", "color", "#e4b159", "Color of the star progress bar"));
  configFile.push(new configEntry("noteStreakColor", "color", "#ffffff", "Color of the combo counter"));
  configFile.push(new configEntry("starColor", "color", "#ffffff", "Color of the star counter"));
  configFile.push(new configEntry("scoreColor", "color", "#ffffff", "Color of the score counter"));
  configFile.push(new configEntry("scoreHUDColor", "color", "#ffffff", "Color of the background of the score HUD"));
  configFile.push(new configEntry("greenFretColor", "color", "#00ff00"));
  configFile.push(new configEntry("redFretColor", "color", "#ff0000"));
  configFile.push(new configEntry("yellowFretColor", "color", "#ffff00"));
  configFile.push(new configEntry("blueFretColor", "color", "#2222ff"));
  configFile.push(new configEntry("orangeFretColor", "color", "#ffa500"));
  configFile.push(new configEntry("strumColor", "color", "#cc11cc"));
  configFile.push(new configEntry("showClock", "bool", "True", "Show the current time"));
  configFile.push(new configEntry("showInputViewer", "bool", "True", "Show the input viewer"));
  configFile.push(new configEntry("showGhosts", "bool", "True", "Show ghost notes"));
  configFile.push(new configEntry("showMissCounter", "bool", "True", "Show the miss counter"));
  configFile.push(new configEntry("showOverstrums", "bool", "True", "Show the overstrum counter"));
  configFile.push(new configEntry("showSessionTimer", "bool", "True", "Show how long you've had the game open"));
  configFile.push(new configEntry("inputViewerHz", "int", "60", "Update rate of most things on screen"));
  configFile.push(new configEntry("inputViewerIndent", "int", "14", "How many units to indent the input viewer row"));
  configFile.push(new configEntry("rainbowFlames", "bool", "False", "Use rainbow flames"));
  configFile.push(new configEntry("rainbowFlameSpeed", "float", "1.500", "How fast the rainbow flames should change color", 0, 10, 0.05));
  configFile.push(new configEntry("smoothScore", "bool", "True", "Smooth out the score counter (osu style)"));
  configFile.push(new configEntry("highwaySpeed", "float", "1.000", "How fast the highway scrolls (relative to the notes)", -3, 3, 0.1));
  configFile.push(new configEntry("strikelinePistonSpeed", "float", "1", "How fast the pistons move when you hit notes", 0, 10, 0.1));
  configFile.push(new configEntry("rainbowSPBar", "bool", "False"));
  configFile.push(new configEntry("strikelineFPSFix", "bool", "True", "Disables sprite masking on the strikeline. Faster but looks ugly"));
  configFile.push(new configEntry("fontSize", "float", "0.90",));
  configFile.push(new configEntry("useColorProfile", "bool", "True", "Use the colors from the color profile (possibly broken)"));
  configFile.push(new configEntry("perFretFlameColors", "bool", "True", "Separate flame colors for each fret"));
  configFile.push(new configEntry("colorIntensity", "int", "0", "Intensity of the per fret colors"));
  configFile.push(new configEntry("showFPS", "bool", "True"));
  configFile.push(new configEntry("showTotalPointsIngame", "bool", "False", "Replace the score counter with the total points you've earned"));
  configFile.push(new configEntry("scorespyNoFail", "bool", "True"));
  configFile.push(new configEntry("useJudgements", "bool", "True"));
  configFile.push(new configEntry("showJudgementsUnderFretboard", "bool", "True"));
  configFile.push(new configEntry("WeightSystem", "int", "1", "Which judgement weights to use (see config file for more info)"));
  configFile.push(new configEntry("JudgeLevel", "int", "4", "Which judgement level to use (see config file for more info)"));
  configFile.push(new configEntry("maximumImprecision", "int", "6", "Related to the precision mode (see config file for more info)"));
  configFile.push(new configEntry("breakComboOnEarly", "bool", "False", "Related to the precision mode (see config file for more info)"));
  configFile.push(new configEntry("soundOnJudgeBreak", "bool", "False", "Related to the precision mode (see config file for more info)"));
  configFile.push(new configEntry("judgeBreakSoundVolume", "float", "0.150", "Related to the precision mode (see config file for more info)"));
  configFile.push(new configEntry("hitWindowDisplaySize", "int", "0", "How big the visual hit window should be (see config file for more info)"));
  configFile.push(new configEntry("showAvgInaccuracy", "bool", "True"));
  configFile.push(new configEntry("renderFrameInterval", "int", "-60", "Set negative to target a specific FPS value. Set positive to render 1 in n frames. Set 1 to disable", -360, 100, 1));
  configFile.push(new configEntry("deafenAtPercentage", "int", "-1", "Sends scroll lock when you get to this percentage of the song without missing. You have to bind this to deafen in discord to do anything."));
  configFile.push(new configEntry("showHighway", "bool", "True"));
  configFile.push(new configEntry("showHighwaySide", "bool", "True"));
  configFile.push(new configEntry("showBeatlines", "bool", "True"));
  configFile.push(new configEntry("showFretStrings", "bool", "True"));
  configFile.push(new configEntry("showHPBar", "bool", "True"));
  configFile.push(new configEntry("hideHPOnFail", "bool", "False"));
  configFile.push(new configEntry("versionID", "int", "-1", "Don't touch this", 2020613212, 2020613212, 0));
  configFile.push(new configEntry("version", "string", "", "Don't touch this"));
}
let read = false;
ipcRenderer.send('read-file');
ipcRenderer.on('file-read-success', (event, data) => {
  data = data.split('\n');
  for (let i = 0; i < data.length; i++) {
    if (data[i].length > 0) {

      let eName = data[i].split(':')[0].trim();
      if (eName.startsWith("#") || eName.startsWith(";")) {
        commentLines.push({line: i, comment: eName});
        continue;
      }
      let eVal = data[i].split(':')[1].trim();
      let step
      let found = false;
      for (let j = 0; j < configFile.length; j++) {
        if (configFile[j].entryName === eName) {
          configFile[j].entryValue = eVal;
          if (configFile[j].entryDescription === configFile[j].entryName) {
            let idx = 1;

            if (data[i - 1].trim().startsWith("#") || data[i - 1].trim().startsWith(";")) {
              configFile[j].desc_autogen = true;
              let cmnt = [];
              while (i - idx > -1 && (data[i - idx].trim().startsWith("#") || data[i - idx].trim().startsWith(";"))) {
                cmnt.push(data[i - idx].slice(1).trim());

                idx++;
              }
              configFile[j].entryDescription = cmnt.join("\n");
            }
          }
          found = true;
        }
      }
      if (!found) {
        let eType = "string";
        if (eVal.toLowerCase().includes("true") || eVal.toLowerCase().includes("false")) {
          eType = "bool";
        }
        if (isNumeric(eVal)) if (eVal.toLowerCase().includes(".")) {
          eType = "float";
          step = 0.1;

        } else {
          eType = "int";
        }
        if (eVal.toLowerCase().includes("#")) {
          eType = "color";
        }
        let cmnt = [];
        let idx = 1;
        if (data[i - 1].trim().startsWith("#") || data[i - 1].trim().startsWith(";")) {
          while (i - idx > -1 && (data[i - idx].trim().startsWith("#") || data[i - idx].trim().startsWith(";"))) {
            cmnt.push(data[i - idx].slice(1).trim() + "AUTOGEN");
            console.log(cmnt);
            idx++;
          }
        } else {
          cmnt.push(["Unknown key/value found in config and value is uncommentedAUTOGEN"]);
        }

        configFile.push(new configEntry(eName, eType, eVal, cmnt.join("\n")));
      }
    }
  }
  createEditors();
})
ipcRenderer.on('file-read-error', (event, data) => {
  console.log(data);
  createEditors();
});

function createEditors() {

  for (let i = 0; i < configFile.length; i++) {
    let title = "", h = "", u = "", c = "";
    if (configFile[i].entryDescription !== configFile[i].entryName) {
      title = `title="${configFile[i].entryDescription}"`;
      if (!configFile[i].entryDescription.includes("Unknown key/value")) {


        if (configFile[i].desc_autogen) {
          u = "text-decoration:underline dotted 2px;underline-thickness:2px;text-decoration-color:#aaaaaaaa;";
        } else {
          u = "text-decoration:underline dotted 1px;underline-thickness:1px;"
        }
      } else {
        u = "color: #ffaaff;";
      }

    }


    let inputType = "text";
    switch (configFile[i].entryType) {
      case "color":
        inputType = "color";
        break;
      case "string":
        inputType = "text";
        break;
      case "int":
        inputType = "number";
        break;
      case "float":
        inputType = "number";
        break;
      case "bool":
        inputType = "checkbox";
        if (configFile[i].entryValue === "True") {
          c = "checked";
        }
        break;
    }
    h = "";
    let disable = "";
    if (configFile[i].entryName.includes("version")) {
      disable = "disabled";
    }
    let ss_step = "", ss_min = "", ss_max = "";
    if (configFile[i].step !== _unset) {
      ss_step = `step="${configFile[i].step}"`;
    }
    if (configFile[i].min !== _unset) {
      ss_min = `min="${configFile[i].min}"`;
    }
    if (configFile[i].max !== _unset) {
      ss_max = `max="${configFile[i].max}"`;
    }
    document.body.innerHTML += `<br><span ${title} style="${u} ${h} position:relative;left:20%">${configFile[i].entryName}</span>`;
    document.body.innerHTML += `<input ${disable} onchange="ChangeHandler(this)" style="${h} position:absolute;left:70%;" type="${inputType}" ${c} id="${configFile[i].entryName}" ${ss_step} ${ss_min} ${ss_max} value="${configFile[i].entryValue}">`;
  }

  read = true;
}

function ChangeHandler(el) {
  for (let i = 0; i < configFile.length; i++) {
    if (configFile[i].entryName === el.id && configFile[i].entryType === "int") {
      el.value = Math.round(el.value);
    }
  }


  let config = generateConfig();
  ipcRenderer.send('save-file', config);
}

function generateConfig() {
  let config = [];
  let ell = document.getElementsByTagName("input");
  for (let i = 0; i < ell.length; i++) {
    if (ell[i].type !== "checkbox") {
      config.push(`${ell[i].id}: ${ell[i].value}`);
    } else {
      config.push(`${ell[i].id}: ${capitalize(ell[i].checked.toString())}`);
    }

  }
  let j = 0;
  for (let i = 0; i < commentLines.length; i++) {
    config.splice(commentLines[i].line + j, 0, `${commentLines[i].comment}`);

  }
  console.log(commentLines);
  console.log(config.join('\n'));
  return config.join('\r\n');

}


