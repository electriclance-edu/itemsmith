//GLOBALS ---------------------------
var tooltipElement, mpx, currentHover;
//EVENT LISTENERS ---------------------------
document.addEventListener('mouseover', event => {
  currentHover = event.target;
});
setTimeout(function(){
  document.addEventListener('mousemove', event => {
    if (currentHover.className == "item") {
      tooltipElement.style.display = "block";
      tooltipElement.style.left = event.pageX + mpx*8 + "px";
      tooltipElement.style.top = event.pageY - mpx*6 + "px";
    } else {
      tooltipElement.style.display = "none";
    }
  });
},10);
//FUNCTIONS ---------------------------
function onload() {
  tooltipElement = document.getElementById("itemTooltip");
  mpx = getComputedStyle(document.body).getPropertyValue("--truePixelSize");
  mpx = mpx.substr(0,mpx.length - 2);
  Data.onload();
  Editor.onload();
  for (var i = 0; i < templateItems.length;i++) {
    Item.displayItem(i);
  }
}
function notify(textData) {

}
function toggle(id,height,pad) {
  var element = document.getElementById(id);
  if (element.style.height == height) {
    element.style.height = "0";
    element.style.padding = "0";
  } else {
    element.style.height = height;
    element.style.padding = pad;
  }
}
//CLASSES ---------------------------
class Editor {
  static onload() {
    //initialize editorColors (add colors)
    var editorColors = document.getElementById("editorColors");
    var colorList = Object.keys(textColors);
    for (var i = 0; i < colorList.length; i++) {
      var colorTile = document.createElement("div");
      colorTile.style.backgroundColor = textColors[colorList[i]][0];
      colorTile.style.boxShadow = "calc(var(--mpx)*1) calc(var(--mpx)*1) " + textColors[colorList[i]][1];
      colorTile.setAttribute("data-color",colorList[i]);
      colorTile.onclick = function() {
        Editor.selectColor(this.getAttribute("data-color"));
      };

      editorColors.appendChild(colorTile);
    }
  }
  static selectColor(color) {
    this.selectedColor = color;
    document.getElementById("selectedColor").style.backgroundColor = textColors[color][0];
    document.getElementById("selectedColor").style.boxShadow = "calc(var(--mpx)*1) calc(var(--mpx)*1) " + textColors[color][1];
  }
}
class Data {
  static onload() {
    this.items = [];
    this.chest = [];
    this.selectedItem; //index of item in the inventory that is currently being edited, so

    for (var i = 0; i < templateItems.length; i++) {
      this.items.push(templateItems[i])
    }
  }
  static firstFreeSlot(type = "chest") {
    var i;
    for (i = 0; i < this[type].length; i++) {
      if (this[type][i] == undefined || this[type][i] == "") {
        break;
      }
    }
    return i;
  }
  static textDataToText(textData) {
    var text = document.createElement("div");

    for (var i = 0; i < textData.length; i++) {
      if (Array.isArray(textData[i])) {
        text.appendChild(this.sectionedDataToText(textData[i]));
      } else {
        text.appendChild(this.lineDataToText(textData[i]));
        text.appendChild(document.createElement("br"));
      }
    }

    return text;
  }
  static sectionedDataToText(sectionData) {
    var section = document.createElement("div");
    for (var i = 0; i < sectionData.length; i++) {
      section.appendChild(this.lineDataToText(sectionData[i]));
    }
    return section;
  }
  static lineDataToText(textData,elementType = "span") {
    var text = document.createElement(elementType);
    //set style attributes first
    if (textData.italic) {
      text.style.fontStyle = "italic";
    }
    if (textData.bold) {
      text.style.fontWeight = "bold";
    }
    var textDecoration = ""
    if (textData.underlined) {
      textDecoration += "underline ";
    }
    if (textData.strikethrough) {
      textDecoration += "line-through";
    }
    text.style.textDecoration = textDecoration;
    if (textData.obfuscated) {
      text.className = "obfuscated";
    }
    //set colors next
    if (!textData.hasOwnProperty("color")) {
      textData.color = "white";
    }
    text.style.color = textColors[textData.color][0];
    text.style.textShadow = "var(--mpx) var(--mpx) " + textColors[textData.color][1];
    //finally set content
    text.innerHTML = textData.text;
    return text;
  }
  static idToName(id) {
    var name = "";
    id = id.split("_");
    for (var i = 0; i < id.length; i++) {
      id[i] = id[i].charAt(0).toUpperCase() + id[i].slice(1);
      name += id[i] + " ";
    }
    return name;
  }
  static idToText(id) {
    if (id.substring(0,7) == "custom/") {
      id = id.substring(7,id.length);
      id = Data.idToName(id);
      id = Data.textDataToText([{text:id,color:"green"}]);
      return id;
    }
    id = Data.textDataToText([{text:Data.idToName(id)}]);
    return id;
  }
}
class Item {
  static createItem(id,name,lore) {
    var item = {
      id:id,
      name:name,
      lore:lore
    };
    return item;
  }
  static displayItem(itemIndex,slot = Data.firstFreeSlot()) {
    Data.chest[slot] = itemIndex;
    var itemData = Data.items[itemIndex];
    var itemImage = document.createElement("img");
    itemImage.className = "item";
    itemImage.src = "images/textures/" + itemData.id + ".png";
    document.getElementById("chestSlots").children[slot].appendChild(itemImage);

    itemImage.setAttribute("data-index",itemIndex);
    itemImage.onmouseover = function() {
      Item.displayOnTooltip(Data.items[this.getAttribute("data-index")]);
    }
  }
  static displayOnTooltip(itemData) {
    var tooltip = document.getElementById("itemTooltip");
    tooltip.innerHTML = " ";

    if (itemData.hasOwnProperty("display")) {
      var title = Data.textDataToText(itemData.display.name);
      var lore = Data.textDataToText(itemData.display.lore);
      tooltip.appendChild(title);
      tooltip.appendChild(lore);
    } else {
      var title = Data.idToText(itemData.id);
      tooltip.appendChild(title);
    }
  }
  static storeItem(itemData) {
    this.inventory.push(item);
  }
}
/*
  PSEUDOCODE
  while - typing characters
  {
    save what section is being typed in currently
    if
      - the current color is the same as the section being typed on
      put data into that section
    else
      create a new section
      place user in that section
      save data to that section

    if
      - the user deletes a character
      the color of that character will become the user's currently selected character
    if
      - a section contains zero characters
      - && the section was not just created
      - && the section is not a line ("{}") (to preserve empty line breaks)
      delete section
  }
  while - the data is updated
  {
    note
      the code under here is ran when the data is finished being modified
      this may be different from whenever the user types a character, like when a section gets deleted when it gets zero characters
    if
      - a section only contains one line
      reset it to a line ("{}" as opposed to "[{}]")
  }
*/
