import Swal from "sweetalert2";
import "animate.css";

/**
 * 🎉 Show success alert
 * @param {string} title - The title of the alert
 * @param {string} text - The body text of the alert
 */
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title: `✅ ${title}`,
    text,
    icon: "success",
    confirmButtonColor: "#10B981", // green-500
    confirmButtonText: "OK",
    background: "#f9fafb",
    timer: 2000,
    timerProgressBar: true,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
};

/**
 * ⚠️ Show error alert
 * @param {string} title - The title of the alert
 * @param {string} text - The body text of the alert
 */
export const showErrorAlert = (title, text) => {
  Swal.fire({
    title: `❌ ${title}`,
    text,
    icon: "error",
    confirmButtonColor: "#EF4444", // red-500
    confirmButtonText: "Try Again",
    background: "#fff7f7",
    timer: 3000,
    timerProgressBar: true,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
};
