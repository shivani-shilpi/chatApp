export class TextEmoji {
  constructor(picker, emojiButton) {
    this.picker = picker;
    this.emojiButton = emojiButton;
    this.createEmojiPickerButton();
    console.log("this is a textemoji")
  }

  createEmojiPickerButton() {
    this.emojiButton.addEventListener(
      "click",
      this.toggleEmojiPicker.bind(this)
    );
    document
      .querySelector(".emoji-picker-container")
      .prepend(this.emojiButton);
  }

  toggleEmojiPicker(event) {
    debugger
    this.picker.toggle();
  }

  setPicker(picker) {
    this.picker = picker;
  }
}