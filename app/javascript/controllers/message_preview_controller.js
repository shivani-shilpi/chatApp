import { Controller } from "@hotwired/stimulus";
import { DirectUpload } from "@rails/activestorage";
export default class extends Controller {
  connect() {
    console.log("Connected to preview image")
    this.audio();
  }
  
  preview() {
    this.clearPreviews();
    for (let i = 0; i < this.targets.element.files.length; i++) {
      let file = this.targets.element.files[i];
      const reader = new FileReader();
      this.createAndDisplayFilePreviewElements(file, reader);
    }
  }
  
  createAndDisplayFilePreviewElements(file, reader) {
    reader.onload = () => {
      let element = this.constructPreviews(file, reader);
      element.src = reader.result;
      element.setAttribute("href", reader.result);
      element.setAttribute("target", "_blank");
      element.classList.add("attachment-preview");

      document.getElementById("attachment-previews").appendChild(element);
    };
    reader.readAsDataURL(file);
  }

  constructPreviews(file, reader) {
    let element;
    let cancelFunction = (e) => this.removePreview(e);
    switch (file.type) {
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        element = this.createImageElement(cancelFunction, reader);
        break;
      case "video/mp4":
      case "video/quicktime":
        element = this.createVideoElement(cancelFunction);
        break;
      case "audio/mpeg":
      case "audio/mp3":
      case "audio/wav":
      case "audio/ogg":
      case "audio/x-way":
        element = this.createAudioElement(cancelFunction);
        break;
      default:
        element = this.createDefaultElement(cancelFunction);
    }
    element.dataset.filename = file.name;
    return element;
  }
 
  createImageElement(cancelFunction, reader) {
    let cancelUploadButton, element;
    const image = document.createElement("img");
    image.setAttribute("style", "background-image: url(" + reader.result + ")");
    image.classList.add("preview-image");
    element = document.createElement("div");
    element.classList.add("attachment-image-container", "file-removal");
    element.appendChild(image);
    cancelUploadButton = document.createElement("i");
    cancelUploadButton.classList.add(
      "bi",
      "bi-x-circle-fill",
      "cancel-upload-button"
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }

  createAudioElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement("i");
    element.classList.add(
      "bi",
      "bi-file-earmark-music-fill",
      "audio-preview-icon",
      "file-removal"
    );
    cancelUploadButton = document.createElement("i");
    cancelUploadButton.classList.add(
      "bi",
      "bi-x-circle-fill",
      "cancel-upload-button"
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
 
  createVideoElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement("i");
    element.classList.add(
      "bi",
      "bi-file-earmark-play-fill",
      "video-preview-icon",
      "file-removal"
    );
    cancelUploadButton = document.createElement("i");
    cancelUploadButton.classList.add(
      "bi",
      "bi-x-circle-fill",
      "cancel-upload-button"
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
  
  createDefaultElement(cancelFunction) {
    let cancelUploadButton, element;
    element = document.createElement("i");
    element.classList.add(
      "bi",
      "bi-file-check-fill",
      "file-preview-icon",
      "file-removal"
    );
    cancelUploadButton = document.createElement("i");
    cancelUploadButton.classList.add(
      "bi",
      "bi-x-circle-fill",
      "cancel-upload-button"
    );
    cancelUploadButton.onclick = cancelFunction;
    element.appendChild(cancelUploadButton);
    return element;
  }
 
  removePreview(event) {
    const target = event.target.parentNode.closest(".attachment-preview");
    const dataTransfer = new DataTransfer();
    let fileInput = document.getElementById("message_attachments");
    let files = fileInput.files;
    let filesArray = Array.from(files);

    filesArray = filesArray.filter((file) => {
      let filename = target.dataset.filename;
      return file.name !== filename;
    });
    target.parentNode.removeChild(target);
    filesArray.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
  }
 
  clearPreviews() {
    document.getElementById("attachment-previews").innerHTML = "";
  }

  audio() {
    debugger
    let record = document.getElementById("audio-record-button");
    let messageAttachments = document.getElementById("message_attachments");

    let recording = false;

    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      let chunks = [];

      let onSuccess = function (stream) {
        const mediaRecorder = new MediaRecorder(stream);

        record.onclick = function (event) {
          event.preventDefault();
          if (recording) {
            mediaRecorder.stop();
            record.style.color = "";
          } else {
            mediaRecorder.start();
            record.style.color = "red";
          }
          recording = !recording;
        };

        mediaRecorder.onstop = function (event) {
          const audioType = "audio/ogg; codecs=opus";
          const blob = new Blob(chunks, { type: audioType });
          chunks = [];

          let file = new File([blob], "audio-message.ogg", {
            type: audioType,
            lastModified: new Date().getTime(),
          });
          let container = new DataTransfer();
          container.items.add(file);
          uploadFile(file);
          messageAttachments.files = container.files;
          messageAttachments.dispatchEvent(new Event("change"));
        };

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
      };
      let onError = function (err) {
        console.log("The following error occured: " + err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }
}

const uploadFile = (file) => {
  // Your form needs the file_field direct_upload: true, which
  // provides data-direct-upload-url
  const input = document.getElementById("message_attachments");
  const url = input.dataset.directUploadUrl;
  const upload = new DirectUpload(file, url);

  upload.create((error, blob) => {
    if (error) {
      // idk, do something
    } else {
      // Add an appropriately-named hidden input to the form with a
      //  value of blob.signed_id so that the blob ids will be
      //  transmitted in the normal upload flow
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("value", blob.signed_id);
      hiddenField.name = input.name;
      let messageForm = document.getElementById("message-form");
      messageForm.appendChild(hiddenField);
    }
  });
}