import { Controller } from "@hotwired/stimulus";
import { createPopup } from "@picmo/popup-picker";
import { TextEmoji } from "../classes/TextEmoji";

// Connects to data-controller="emoji-picker"
export default class extends Controller {
  static targets = ["input", "pickerContainer"];
  connect() {
    console.log("Connected to emoji-picker");
    const buttonString = this.emojiButtonString();
    let picker;
    const emojiButton = this.emojiButtonTemplate(buttonString);
    let inputText = new TextEmoji(picker, emojiButton);
    picker = createPopup(
      {
        rootElement: this.pickerContainerTarget,
      },
      {
        // The element that triggers the popup
        triggerElement: emojiButton,
        // The element to position the picker relative to - often this is also the trigger element,
        referenceElement: emojiButton,
        // specify how to position the popup
        position: "bottom-start",
      }
    );

    picker.addEventListener("emoji:select", (event) => {
      this.inputTarget.value += event.emoji
    });

    inputText.setPicker(picker);
  }

  emojiButtonTemplate(buttonString) {
    const domParser = new DOMParser();
    const emojiButton = domParser
      .parseFromString(buttonString, "text/html")
      .querySelector("button");
    return emojiButton;
  }

  emojiButtonString() {
    const buttonString = `<button type="button" class="emoji-button" id="emoji-picker" data-text-action="popupPicker" tabindex="1">😀</button>`;
    return buttonString;
  }
}