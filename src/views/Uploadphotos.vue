<template>
  <div>
    <button @click="showDialog" class="open-dialog-btn">Upload Image</button>

    <dialog ref="uploadDialog">
      <div class="dialog-content">
        <button class="close-btn" @click="hideDialog">&times;</button>
        <form @submit.prevent="uploadImage" class="upload-form">
          <input type="file" @change="handleFileChange" class="file-input" />
          <div v-if="imagePreviewUrl" class="preview-container">
            <p class="preview-text">图片预览:</p>
            <img :src="imagePreviewUrl" alt="Image Preview" />
          </div>
          <button type="submit" class="submit-btn">上传图片</button>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      imagePreviewUrl: null,
      imageUrl: null,
      apiKey: '5c5784acf86cb2b3631df52ead600cd9'
    };
  },
  methods: {
    showDialog() {
      this.$refs.uploadDialog.showModal();
    },
    hideDialog() {
      this.$refs.uploadDialog.close();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedFile = null;
        this.imagePreviewUrl = null;
      }
    },
    async uploadImage() {
      if (!this.selectedFile) {
        alert('Please select an image first!');
        return;
      }
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      try {
        const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
          params: {
            key: this.apiKey
          }
        });
        this.imageUrl = response.data.data.url;
        alert(`Upload successful!\nImage URL: ${this.imageUrl}`);
        this.hideDialog();
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Upload failed. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.open-dialog-btn, .submit-btn {
  padding: 6px 18px;
  font-size: 16px;
}

.close-btn {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.upload-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-input {
  margin: 10px 0;
  padding: 12px;
  font-size: 16px;
  width: 100%;
}

.preview-container {
  margin-top: 20px;
  text-align: center;
}

.preview-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

img {
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 8px;
}

dialog {
  width: 640px;
  padding: 20px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f9f9f9;
  box-sizing: border-box;
}
</style>
