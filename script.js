//GLOBALS ---------------------------
var tooltipElement, mpx, currentHover;
//EVENT LISTENERS ---------------------------
document.addEventListener('mouseover', event => {
  currentHover = event.target;
});
document.addEventListener('mousemove', event => {
  if (currentHover.className == "item") {
    tooltipElement.style.display = "block";
    tooltipElement.style.left = event.pageX + mpx*8 + "px";
    tooltipElement.style.top = event.pageY - mpx*6 + "px";
  } else {
    tooltipElement.style.display = "none";
  }
});
//FUNCTIONS ---------------------------
function onload() {
  tooltipElement = document.getElementById("itemTooltip");
  mpx = getComputedStyle(document.body).getPropertyValue("--truePixelSize");
  mpx = mpx.substr(0,mpx.length - 2);
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
function moveToMouse(elem) {
  console.log(e);
}
//CLASSES ---------------------------
class Convert {
  static textToJSON(text,color,formatting) {
    /*
    formatting:[true,false,false,false...]
    which means italic=true, bold=false, ...*/
  }
}
